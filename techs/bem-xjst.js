var EOL = require('os').EOL,
    path = require('path'),
    vow = require('vow'),
    vfs = require('enb/lib/fs/async-fs'),
    bemcompat = require('bemhtml-compat'),
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
            var jobQueue = this.node.getSharedResources().jobQueue,
                template = [
                    'oninit(function(exports, context) {',
                    '    context.BEMContext.prototype.require = function(lib) {',
                    '       return __bem_xjst_libs__[lib];',
                    '    };',
                    '});'
                ].join(EOL);

            source += EOL + template;

            return jobQueue.push(
                    path.resolve(__dirname, '../lib/bemxjst-processor'),
                    source,
                    {
                        wrap: false,
                        optimize: !this._devMode,
                        cache: !this._devMode && this._cache
                    }
                )
                .then(function (code) {
                    return bundle.compile(code, {
                        exportName: this._exportName,
                        includeVow: this._includeVow,
                        requires: this._requires
                    });
                }, this);
        }
    })
    .createTech();
