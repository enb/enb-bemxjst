/**
 * bemhtml
 * =======
 *
 * Склеивает *bemhtml.xjst* и *bemhtml*-файлы по deps'ам, обрабатывает `bem-xjst`-транслятором,
 * сохраняет (по умолчанию) в виде `?.bemhtml.js`.
 * **Внимание:** По умолчанию поддерживает только JS-синтаксис. Чтобы включить поддержку первоначального синтаксиса
 * используйте `compat` опцию.
 *
 * **Опции**
 *
 * * *String* **target** — Результирующий таргет. По умолчанию — `?.bemhtml.js`.
 * * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 *   (его предоставляет технология `files`). По умолчанию — `?.files`.
 * * *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет.
 *    По умолчанию — `['bemhtml', 'bemhtml.xjst']`.
 * * *String* **exportName** — Имя переменной-обработчика BEMHTML. По умолчанию — `'BEMHTML'`.
 * * *Boolean* **compat** — Поддержка первоначального синтаксиса. По умолчанию — false.
 * * *Boolean* **devMode** — Development-режим. По умолчанию — true.
 * * *Boolean* **cache** — Кэширование. Возможно только в production-режиме. По умолчанию — `false`.
 * * *Object* **modulesDeps** — Хэш-объект, прокидывающий в генерируемую для скомпилированных шаблонов обвязку,
 *    необходимые YModules-модули.
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
    .defineOption('compat', false)
    .defineOption('devMode', true)
    .defineOption('cache', false)
    .defineOption('modulesDeps')
    .useFileList(['bemhtml', 'bemhtml.xjst'])
    .builder(function (sourceFiles) {
        return this._sourceFilesProcess(sourceFiles, this._compat);
    })
    .createTech();
