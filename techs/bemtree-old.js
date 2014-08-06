/**
 * bemtree-old
 * ===========
 *
 * Склеивает *bemtree*-файлы по deps'ам, обрабатывает `bem-xjst`-транслятором,
 * сохраняет (по умолчанию) в виде `?.bemtree.js`. Поддерживает как js-совместимый, так и первоначальный синтаксис.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию — `?.bemtree.js`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 * * * *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет. По умолчанию — `['bemtree']`.
 * * *String* **exportName** — Имя переменной-обработчика BEMTREE. По умолчанию — `'BEMTREE'`.
 * * *Boolean* **devMode** — Development-режим. По умолчанию — true.
 * * *Object* **modulesDeps** — Хэш-объект, прокидывающий в генерируемую для скомпилированных шаблонов обвязку,
 *    необходимые YModules-модули.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech([ require('enb-bemxjst/techs/bemtree-old'), { devMode: false } ]);
 * ```
 */
module.exports = require('./bemtree').buildFlow()
    .name('bemtree-old')
    .builder(function (sourceFiles) {
        return this._sourceFilesProcess(sourceFiles, true);
    })
    .createTech();
