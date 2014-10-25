var vow = require('vow'),
    fs = require('enb/lib/fs/async-fs'),
    bemxjst = require('bem-xjst'),
    bemcompat = require('bemhtml-compat'),
    BemxjstProcessor = require('sibling').declare({
        process: function (source, options) {
            return bemxjst.generate(source, options);
        }
    }),
    XJST_SUFFIX = 'xjst';

module.exports = require('enb/lib/build-flow').create()
    .name('bem-xjst')
    .target('target', '?.bem-xjst.js')
    .methods({
        _sourceFilesProcess: function (sourceFiles, oldSyntax) {
            return vow.all(sourceFiles.map(function (file) {
                    return fs.read(file.fullname, 'utf8')
                        .then(function (source) {
                            if (oldSyntax && XJST_SUFFIX !== file.suffix.split('.').pop()) {
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
                    wrap: true,
                    exportName: this._exportName,
                    optimize: !this._devMode,
                    cache: !this._devMode && this._cache,
                    modulesDeps: this._modulesDeps
                })
                .then(function (res) {
                    bemxjstProcessor.dispose();
                    return res;
                });
        }
    })
    .createTech();
