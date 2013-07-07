module.exports = require('./bemhtml').buildFlow()
    .name('bemhtml-old')
    .builder(function(sourceFiles) {
        return this._oldFilesProcess(sourceFiles, this._devMode, this._cache, this._exportName);
    })
    .createTech();
