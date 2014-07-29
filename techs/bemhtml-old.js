/**
 * bemhtml-old
 * ===========
 *
 * Склеивает *bemhtml.xjst* и *bemhtml*-файлы по deps'ам, обрабатывает `bem-xjst`-транслятором,
 * сохраняет (по умолчанию) в виде `?.bemhtml.js`. Поддерживает как js-совместимый, так и первоначальный синтаксис.
 * **Внимание:** считается, что файлы с суффиксом `*.xjst` могут быть написаны только в js-синтаксисе
 * (первоначальный синтаксис не поддерживается).
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию — `?.bemhtml.js`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 * * *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет.
 *   По умолчанию — `['bemhtml', 'bemhtml.xjst']`.
 * * *String* **exportName** — Имя переменной-обработчика BEMHTML. По умолчанию — `'BEMHTML'`.
 * * *Boolean* **devMode** — Development-режим. По умолчанию — true.
 * * *Boolean* **cache** — Кэширование. Возможно только в dev-режиме. По умолчанию — `true`.
 * * *Object* **modulesDeps** — Хэш-объект, прокидывающий в генерируемую для скомпилированных шаблонов обвязку,
 *    необходимые YModules-модули.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech([ require('enb-bemxjst/techs/bemhtml-old'), { devMode: false } ]);
 * ```
 */
module.exports = require('./bemhtml').buildFlow()
    .name('bemhtml-old')
    .builder(function (sourceFiles) {
        return this._sourceFilesProcess(sourceFiles, true);
    })
    .createTech();
