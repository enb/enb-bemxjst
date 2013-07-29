var Vow = require('vow'),
    VowFs = require('enb/lib/fs/async-fs'),
    BEMHTML = require('bem-core/.bem/lib/bemhtml');

module.exports = require('enb/lib/build-flow').create()
    .name('bem-xjst')
    .target('target', '?.bemxjst.js')
    .methods({
        _sourceFilesProcess: function(sourceFiles, callback) {
            var _this = this;

            return Vow.all(_this._sourceFilesPreprocess(sourceFiles, callback))
                .then(function(sources) {
                    return _this._bemxjstProcess(sources.join('\n'));
                });
        },
        _oldFilesProcess: function(sourceFiles) {
            var bemcompat = require('bemhtml-compat');

            return this._sourceFilesProcess(sourceFiles, function(source, suffix) {
                if ('bemhtml.xjst' !== suffix) {
                    source = bemcompat.transpile(source);
                }

                return source;
            });
        },
        _sourceFilesPreprocess: function(sourceFiles, callback) {
            return sourceFiles.map(function(file) {
                return VowFs.read(file.fullname, 'utf8')
                    .then(function(source) {
                        source = '/* begin: ' + file.fullname + ' *' + '/\n' +
                            source +
                            '\n/* end: ' + file.fullname + ' *' + '/';

                        return callback ? callback(source, file.suffix) : source;
                    });
            });
        },
        _bemxjstProcess: function(source) {
            var bemxjstProcessor = BemxjstProcessor.fork();

            return bemxjstProcessor.process(source, this._getOptions()).then(function(res) {
                bemxjstProcessor.dispose();
                return res;
            });
        },
        _getOptions: function () {
            var fieldNames = this._optionFieldNames,
                options = {};

            for (var optName in fieldNames) {
                options[optName] = this[fieldNames[optName]];
            }

            return options;
        }
    })
    .createTech();

var BemxjstProcessor = require('sibling').declare({
    process: function(source, options) {
        return BEMHTML.translate(source, options);
    }
});
