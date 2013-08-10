module.exports = require('./bem-xjst').buildFlow()
    .name('bemtree')
    .target('target', '?.bemtree.js')
    .defineOption('exportName', 'BEMTREE')
    .defineOption('devMode', 'development' === process.env.YENV)
    .useFileList(['bemtree'])
    .builder(function(sourceFiles) {
        return this._sourceFilesProcess(sourceFiles);
    })
    .createTech();
