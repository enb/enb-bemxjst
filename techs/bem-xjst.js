var Vow = require('vow'),
    VowFs = require('enb/lib/fs/async-fs'),
    BEMXJST = require('bem-core/.bem/lib/bemhtml'),
    bemcompat = require('bemhtml-compat');

module.exports = require('enb/lib/build-flow').create()
    .name('bem-xjst')
    .target('target', '?.bem-xjst.js')
    .methods({
        _sourceFilesProcess: function(sourceFiles, oldSyntax) {
            return Vow.all(sourceFiles.map(function(file) {
                    return VowFs.read(file.fullname, 'utf8')
                        .then(function(source) {
                            if (oldSyntax && 'bemhtml.xjst' !== file.suffix) {
                                source = bemcompat.transpile(source);
                            }

                            return '/* begin: ' + file.fullname + ' *' + '/\n' +
                                source +
                                '\n/* end: ' + file.fullname + ' *' + '/';
                        });
                }))
                .then(function(sources) {
                    return this._bemxjstProcess(sources.join('\n'));
                }, this);
        },
        _bemxjstProcess: function(source) {
            var bemxjstProcessor = BemxjstProcessor.fork();

            return bemxjstProcessor.process(source, this._getOptions()).then(function(res) {
                bemxjstProcessor.dispose();
                return res;
            });
        },
        _getOptions: function() {
            var fieldNames = this._optionFieldNames,
                options = {};

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
    process: function(source, options) {
        return BEMXJST.translate(source, options);
    }
});
