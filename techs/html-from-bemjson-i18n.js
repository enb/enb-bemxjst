/**
 * html-from-bemjson-i18n
 * ======================
 *
 * Собирает *html*-файл с помощью *bemjson*, *bemhtml*, *lang.all* и *lang.{lang}*.
 *
 * **Опции**
 *
 * * *String* **bemhtmlFile** — Исходный BEMHTML-файл. По умолчанию — `?.bemhtml.js`.
 * * *String* **bemjsonFile** — Исходный BEMJSON-файл. По умолчанию — `?.bemjson.js`.
 * * *String* **langAllFile** — Исходный langAll-файл. По умолчанию — `?.lang.all.js`.
 * * *String* **langFile** — Исходный lang-файл. По умолчанию — `?.lang.{lang}.js`.
 *   Если параметр lang не указан, берется первый из объявленных в проекте языков
 * * *String* **target** — Результирующий HTML-файл. По умолчанию — `?.{lang}.html`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb-bemxjst/techs/html-from-bemjson-i18n'));
 * ```
 */
var vm = require('vm'),
    vow = require('vow'),
    vfs = require('enb/lib/fs/async-fs'),
    requireOrEval = require('enb/lib/fs/require-or-eval'),
    asyncRequire = require('enb/lib/fs/async-require'),
    dropRequireCache = require('enb/lib/fs/drop-require-cache');

module.exports = require('enb/lib/build-flow').create()
    .name('html-from-bemjson-i18n')
    .target('target', '?.{lang}.html')
    .useSourceFilename('bemhtmlFile', '?.bemhtml.js')
    .useSourceFilename('bemjsonFile', '?.bemjson.js')
    .useSourceFilename('langAllFile', '?.lang.all.js')
    .useSourceFilename('langFile', '?.lang.{lang}.js')
    .optionAlias('bemhtmlFile', 'bemhtmlTarget')
    .optionAlias('bemjsonFile', 'bemjsonTarget')
    .optionAlias('langAllFile', 'langAllTarget')
    .optionAlias('langFile', 'langTarget')
    .optionAlias('target', 'destTarget')
    .needRebuild(function (cache) {
        return cache.needRebuildFile('bemhtml-file', this.node.resolvePath(this._bemhtmlTarget)) ||
            cache.needRebuildFile('bemjson-file', this.node.resolvePath(this._bemjsonTarget)) ||
            cache.needRebuildFile('allLang-file', this.node.resolvePath(this._langAllTarget)) ||
            cache.needRebuildFile('lang-file', this.node.resolvePath(this._langTarget)) ||
            cache.needRebuildFile('html-file', this.node.resolvePath(this._destTarget));
    })
    .saveCache(function (cache) {
        cache.cacheFileInfo('bemhtml-file', this.node.resolvePath(this._bemhtmlTarget));
        cache.cacheFileInfo('bemjson-file', this.node.resolvePath(this._bemjsonTarget));
        cache.cacheFileInfo('allLang-file', this.node.resolvePath(this._langAllTarget));
        cache.cacheFileInfo('lang-file', this.node.resolvePath(this._langTarget));
        cache.cacheFileInfo('html-file', this.node.resolvePath(this._destTarget));
    })
    .builder(function (bemhtmlFilename, bemjsonFilename, allLangFilename, langFilename) {
        dropRequireCache(require, bemhtmlFilename);
        dropRequireCache(require, bemjsonFilename);

        return vow.all([
            asyncRequire(bemhtmlFilename),
            requireOrEval(bemjsonFilename),
            vfs.read(allLangFilename),
            vfs.read(langFilename)
        ]).spread(function (bemhtml, bemjson, allLangSource, langSource) {
            vm.runInThisContext(allLangSource, allLangFilename);
            vm.runInThisContext(langSource, langFilename);

            return bemhtml.BEMHTML.apply(bemjson);
        });
    })
    .createTech();
