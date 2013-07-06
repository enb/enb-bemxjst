var Vow = require('vow'),
    VowFs = require('vow-fs'),
    BEMHTML = require('bem-core/.bem/lib/bemhtml');

module.exports = require('enb/lib/build-flow').create()
    .name('bem-xjst')
    .target('target', '?.bemxjst.js')
    .methods({
        _sourceFilesProcess: function(sourceFiles, devMode, cache, exportName) {
            var _this = this;

            return Vow.all(sourceFiles.map(function(file) {
                    return VowFs.read(file.fullname, 'utf8').then(function(source) {
                        return '/* begin: ' + file.fullname + ' *' + '/\n' +
                            source +
                            '\n/* end: ' + file.fullname + ' *' + '/';
                    });
                }))
                .then(function(sources) {
                    return _this._bemxjstProcess(sources.join('\n'), devMode, cache, exportName);
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
