/**
 * bemhtml-old
 * ===========
 *
 * Склеивает *bemhtml.xjst* и *bemhtml*-файлы по deps'ам, обрабатывает BEMXJST-транслятором,
 * сохраняет (по умолчанию) в виде `?.bemhtml.js`. Использует компилятор, входящий в состав библиотеки
 * `bem-core` (https://github.com/bem/bem-core). Поддерживает как новый js-совместимый, так и старый синтаксис.
 * Транслирование из старого синтаксиса в новый осуществляется с помощью библиотеки
 * `bemhtml-compat` (https://github.com/bem/bemhtml-compat).
 * **Внимание:** считается, что файлы с суффиксом `*.xjst` могут быть написаны только в новом синтаксисе
 * (старый синтаксис не поддерживается).
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию — `?.bemhtml.js`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 * * *String* **exportName** — Имя переменной-обработчика BEMHTML. По умолчанию — `'BEMHTML'`.
 * * *Boolean* **devMode** — Development-режим. По умолчанию зависит от `YENV` (`true`, если `YENV=development`).
 * * *Boolean* **cache** — Кеширование. По умолчанию — `true`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech([ require('enb-bemxjst/techs/bemhtml-old'), { devMode: false } ]);
 * ```
 */
module.exports = require('./bemhtml').buildFlow()
    .name('bemhtml-old')
    .builder(function(sourceFiles) {
        return this._sourceFilesProcess(sourceFiles, true);
    })
    .createTech();
