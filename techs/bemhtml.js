/**
 * bemhtml
 * =======
 *
 * Склеивает *bemhtml.xjst* и *bemhtml*-файлы по deps'ам, обрабатывает `bem-xjst`-транслятором,
 * сохраняет (по умолчанию) в виде `?.bemhtml.js`.
 * **Внимание:** поддерживает только js-синтаксис.

 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию — `?.bemhtml.js`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 * * *String* **exportName** — Имя переменной-обработчика BEMHTML. По умолчанию — `'BEMHTML'`.
 * * *Boolean* **devMode** — Development-режим. По умолчанию зависит от `YENV` (`true`, если `YENV=development`).
 * * *Boolean* **cache** — Кэширование. Возможно только в production-режиме. По умолчанию — `false`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech([ require('enb-bemxjst/techs/bemhtml'), { devMode: false } ]);
 * ```
 */
module.exports = require('./bem-xjst').buildFlow()
    .name('bemhtml')
    .target('target', '?.bemhtml.js')
    .defineOption('exportName', 'BEMHTML')
    .defineOption('devMode', 'development' === process.env.YENV)
    .defineOption('cache', false)
    .useFileList(['bemhtml', 'bemhtml.xjst'])
    .builder(function (sourceFiles) {
        return this._sourceFilesProcess(sourceFiles);
    })
    .createTech();
