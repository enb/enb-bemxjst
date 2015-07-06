var vow = require('vow'),
    vfs = require('enb/lib/fs/async-fs'),
    bemxjst = require('bem-xjst'),
    bemcompat = require('bemhtml-compat'),
    BemxjstProcessor = require('sibling').declare({
        process: function (source, options) {
            return bemxjst.generate(source, options);
        }
    }),
    bundle = require('../lib/bundle');

module.exports = require('enb/lib/build-flow').create()
    .name('bem-xjst')
    .target('target', '?.bem-xjst.js')
    .methods({
        _sourceFilesProcess: function (sourceFiles, oldSyntax) {
            var added = {};

            return vow.all(sourceFiles.filter(function (file) {
                    var key = file.fullname.slice(0, -(file.suffix.length + 1));

                    if (added[key]) {
                        return false;
                    }

                    added[key] = true;

                    return true;
                }).map(function (file) {
                    return vfs.read(file.fullname, 'utf8')
                        .then(function (source) {
                            if (oldSyntax) {
                                source = bemcompat.transpile(source);
                            }

                            return '/* begin: ' + file.fullname + ' *' + '/\n' +
                                source +
                                '\n/* end: ' + file.fullname + ' *' + '/';
                        });
                }))
                .then(function (sources) {
                    return this._bemxjstProcess(sources.join('\n'));
                }, this);
        },
        _bemxjstProcess: function (source) {
            var bemxjstProcessor = BemxjstProcessor.fork();

            return bemxjstProcessor.process(source, {
                    wrap: false,
                    optimize: !this._devMode,
                    cache: !this._devMode && this._cache
                })
                .then(function (code) {
                    bemxjstProcessor.dispose();

                    return bundle.compile(code, {
                        exportName: this._exportName,
                        includeVow: this._includeVow,
                        modulesDeps: this._modulesDeps
                    });
                }, this)
                .fail(function (error) {
                    bemxjstProcessor.dispose();
                    throw error;
                });
        }
    })
    .createTech();
