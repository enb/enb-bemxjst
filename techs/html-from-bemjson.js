/**
 * html-from-bemjson
 * =================
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
 * nodeConfig.addTech(require('enb-bemxjst/techs/html-from-bemjson'));
 * ```
 */
var enb = require('enb'),
    buildFlow = enb.buildFlow || require('enb/lib/build-flow'),
    requireOrEval = require('enb-require-or-eval'),
    asyncRequire = require('enb-async-require'),
    clearRequire = require('clear-require');

module.exports = buildFlow.create()
    .name('html-from-bemjson')
    .target('target', '?.html')
    .useSourceFilename('bemhtmlFile', '?.bemhtml.js')
    .useSourceFilename('bemjsonFile', '?.bemjson.js')
    .optionAlias('bemhtmlFile', 'bemhtmlTarget')
    .optionAlias('bemjsonFile', 'bemjsonTarget')
    .optionAlias('target', 'destTarget')
    .builder(function (bemhtmlFilename, bemjsonFilename) {
        clearRequire(bemjsonFilename);

        return requireOrEval(bemjsonFilename)
            .then(function (json) {
                clearRequire(bemhtmlFilename);

                return asyncRequire(bemhtmlFilename)
                    .then(function (bemhtml) {
                        return bemhtml.BEMHTML.apply(json);
                    });
            });
    })
    .createTech();
