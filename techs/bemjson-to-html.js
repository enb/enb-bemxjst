/**
 * bemjson-to-html
 * ===============
 *
 * Собирает *html*-файл с помощью *bemjson* и *bemhtml*.
 *
 * **Опции**
 *
 * * *String* **bemhtmlFile** — Исходный BEMHTML-файл. По умолчанию — `?.bemhtml.js`.
 * * *String* **bemjsonFile** — Исходный BEMJSON-файл. По умолчанию — `?.bemjson.js`.
 * * *String* **target** — Результирующий HTML-файл. По умолчанию — `?.html`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb-bemxjst/techs/bemjson-to-html'));
 * ```
 */
var requireOrEval = require('enb/lib/fs/require-or-eval'),
    asyncRequire = require('enb/lib/fs/async-require'),
    dropRequireCache = require('enb/lib/fs/drop-require-cache');

module.exports = require('enb/lib/build-flow').create()
    .name('bemjson-to-html')
    .target('target', '?.html')
    .useSourceFilename('bemhtmlFile', '?.bemhtml.js')
    .useSourceFilename('bemjsonFile', '?.bemjson.js')
    .optionAlias('bemhtmlFile', 'bemhtmlTarget')
    .optionAlias('bemjsonFile', 'bemjsonTarget')
    .optionAlias('target', 'destTarget')
    .builder(function (bemhtmlFilename, bemjsonFilename) {
        dropRequireCache(require, bemjsonFilename);

        return requireOrEval(bemjsonFilename)
            .then(function (json) {
                dropRequireCache(require, bemhtmlFilename);

                return asyncRequire(bemhtmlFilename)
                    .then(function (bemhtml) {
                        return bemhtml.BEMHTML.apply(json);
                    });
            });
    })
    .createTech();
