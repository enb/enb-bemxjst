var vow = require('vow');
var fs = require('enb/lib/fs/async-fs');
var bemxjst = require('bem-xjst');
var bemcompat = require('bemhtml-compat');
var XJST_SUFFIX = 'xjst';

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

            return bemxjstProcessor.process(source, this._getOptions()).then(function (res) {
                bemxjstProcessor.dispose();
                return res;
            });
        },
        _getOptions: function () {
            var fieldNames = this._optionFieldNames;
            var options = {};

            for (var optName in fieldNames) {
                if (fieldNames.hasOwnProperty(optName)) {
                    options[optName] = this[fieldNames[optName]];
                }
            }
            return options;
        }
    })
    .createTech();

var BemxjstProcessor = require('sibling').declare({
    process: function (source, options) {
        return bemxjst.generate(source, {
            wrap: true,
            exportName: options.exportName,
            optimize: !options.devMode,
            cache: !options.devMode && options.cache
        });
    }
});
