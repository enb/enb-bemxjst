/**
 * bemtree-old
 * ===========
 *
 * Склеивает *bemtree*-файлы по deps'ам, обрабатывает BEMXJST-транслятором,
 * сохраняет (по умолчанию) в виде `?.bemtree.js`. Использует компилятор, входящий в состав библиотеки
 * `bem-core` (https://github.com/bem/bem-core). Поддерживает как новый js-совместимый, так и старый синтаксис.
 * Транслирование из старого синтаксиса в новый осуществляется с помощью библиотеки
 * `bemhtml-compat` (https://github.com/bem/bemhtml-compat).
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
 * nodeConfig.addTech([ require('enb-bemxjst/techs/bemtree-old'), { devMode: false } ]);
 * ```
 */
module.exports = require('./bemtree').buildFlow()
    .name('bemtree-old')
    .builder(function(sourceFiles) {
        return this._sourceFilesProcess(sourceFiles, true);
    })
    .createTech();
