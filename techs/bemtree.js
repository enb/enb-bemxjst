/**
 * bemtree
 * =======
 *
 * Склеивает *bemtree*-файлы по deps'ам, обрабатывает BEMXJST-транслятором,
 * сохраняет (по умолчанию) в виде `?.bemtree.js`. Использует компилятор, входящий в состав библиотеки
 * `bem-core` (https://github.com/bem/bem-core).
 * **Внимание:** поддерживает только новый js-совместимый синтаксис.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию — `?.bemtree.js`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 * * *String* **exportName** — Имя переменной-обработчика BEMTREE. По умолчанию — `'BEMTREE'`.
 * * *Boolean* **devMode** — Development-режим. По умолчанию зависит от `YENV` (`true`, если `YENV=development`).
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
    .defineOption('devMode', 'development' === process.env.YENV)
    .useFileList(['bemtree'])
    .builder(function(sourceFiles) {
        return this._sourceFilesProcess(sourceFiles);
    })
    .createTech();
