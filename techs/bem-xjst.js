var Vow = require('vow'),
    VowFs = require('vow-fs'),
    BEMHTML = require('bem-core/.bem/lib/bemhtml'),
    bemcompat = require('bemhtml-compat');

module.exports = require('enb/lib/build-flow').create()
    .name('bem-xjst')
    .target('target', '?.bemxjst.js')
    .methods({
        _jsFilesProcess: function(sourceFiles, devMode, cache, exportName) {
            var _this = this;

            return Vow.all(_this._jsFilesPreprocess(sourceFiles))
                .then(function(sources) {
                    return _this._bemxjstProcess(sources.join('\n'), devMode, cache, exportName);
                });
        },
        _oldFilesProcess: function(sourceFiles, devMode, cache, exportName) {
            var _this = this,
                jsFiles = sourceFiles.filter(function(file) {
                    return 'bemhtml.xjst' === file.suffix;
                }),
                oldFiles = sourceFiles.filter(function(file) {
                    return 'bemhtml' === file.suffix;
                });

            return Vow.all(Array.prototype.concat(
                    _this._jsFilesPreprocess(jsFiles),
                    _this._oldFilesPreprocess(oldFiles)
                ))
                .then(function(sources) {
                    return _this._bemxjstProcess(sources.join('\n'), devMode, cache, exportName);
                });
        },
        _jsFilesPreprocess: function(sourceFiles) {
            return sourceFiles.map(function(file) {
                return VowFs.read(file.fullname, 'utf8')
                    .then(function(source) {
                        return '/* begin: ' + file.fullname + ' *' + '/\n' +
                            source +
                            '\n/* end: ' + file.fullname + ' *' + '/';
                    });
            });
        },
        _oldFilesPreprocess: function(sourceFiles){
            return Vow.all(sourceFiles.map(function(file) {
                    return VowFs.read(file.fullname, 'utf8');
                }))
                .then(function(sources) {
                    return bemcompat.transpile(sources.join('\n'));
                });
        },
        _bemxjstProcess: function(source, devMode, cache, exportName) {
            this.node.getLogger().log('Calm down, OmetaJS is running...');

            var bemxjstProcessor = BemxjstProcessor.fork();
            return bemxjstProcessor.process(source, devMode, cache, exportName).then(function(res) {
                bemxjstProcessor.dispose();
                return res;
            });
        }
    })
    .createTech();

var BemxjstProcessor = require('sibling').declare({
    process: function(source, devMode, cache, exportName) {
        return BEMHTML.translate(source, {
            devMode: devMode,
            cache: cache,
            exportName: exportName
        });
    }
});
