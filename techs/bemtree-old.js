module.exports = require('./bemtree').buildFlow()
    .name('bemtree-old')
    .builder(function(sourceFiles) {
        return this._oldFilesProcess(sourceFiles);
    })
    .createTech();
