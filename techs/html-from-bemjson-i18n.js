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
    enb = require('enb'),
    vfs = enb.asyncFs || require('enb/lib/fs/async-fs'),
    buildFlow = enb.buildFlow || require('enb/lib/build-flow'),
    requireOrEval = require('enb-require-or-eval'),
    asyncRequire = require('enb-async-require'),
    clearRequire = require('clear-require');

module.exports = buildFlow.create()
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
        return cache.needRebuildFile('bemhtml-file', this.node.resolvePath(this._bemhtmlFile)) ||
            cache.needRebuildFile('bemjson-file', this.node.resolvePath(this._bemjsonFile)) ||
            cache.needRebuildFile('allLang-file', this.node.resolvePath(this._langAllFile)) ||
            cache.needRebuildFile('lang-file', this.node.resolvePath(this._langFile)) ||
            cache.needRebuildFile('html-file', this.node.resolvePath(this._target));
    })
    .saveCache(function (cache) {
        cache.cacheFileInfo('bemhtml-file', this.node.resolvePath(this._bemhtmlFile));
        cache.cacheFileInfo('bemjson-file', this.node.resolvePath(this._bemjsonFile));
        cache.cacheFileInfo('allLang-file', this.node.resolvePath(this._langAllFile));
        cache.cacheFileInfo('lang-file', this.node.resolvePath(this._langFile));
        cache.cacheFileInfo('html-file', this.node.resolvePath(this._target));
    })
    .builder(function (bemhtmlFilename, bemjsonFilename, allLangFilename, langFilename) {
        clearRequire(bemhtmlFilename);
        clearRequire(bemjsonFilename);

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
