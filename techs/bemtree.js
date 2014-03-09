/**
 * bemtree
 * =======
 *
 * Склеивает *bemtree*-файлы по deps'ам, обрабатывает `bem-xjst`-транслятором,
 * сохраняет (по умолчанию) в виде `?.bemtree.js`.
 * **Внимание:** поддерживает только js-синтаксис.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию — `?.bemtree.js`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 * * *String* **exportName** — Имя переменной-обработчика BEMTREE. По умолчанию — `'BEMTREE'`.
 * * *Boolean* **devMode** — Development-режим. По умолчанию — true.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech([ require('enb-bemxjst/techs/bemtree'), { devMode: false } ]);
 * ```
 */
module.exports = require('./bem-xjst').buildFlow()
    .name('bemtree')
    .target('target', '?.bemtree.js')
    .defineOption('exportName', 'BEMTREE')
    .defineOption('devMode', true)
    .useFileList(['bemtree'])
    .builder(function (sourceFiles) {
        return this._sourceFilesProcess(sourceFiles);
    })
    .createTech();
