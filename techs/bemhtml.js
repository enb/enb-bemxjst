module.exports = require('./bem-xjst').buildFlow()
    .name('bemhtml')
    .target('target', '?.bemhtml.js')
    .defineOption('exportName', 'BEMHTML')
    .defineOption('devMode', true)
    .defineOption('cache', true)
    .useFileList(['bemhtml', 'bemhtml.xjst'])
    .builder(function(sourceFiles) {
        return this._sourceFilesProcess(sourceFiles, this._devMode, this._cache, this._exportName);
    })
    .createTech();
