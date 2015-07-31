var requireOrEval = require('enb/lib/fs/require-or-eval'),
    asyncRequire = require('enb/lib/fs/async-require'),
    dropRequireCache = require('enb/lib/fs/drop-require-cache');

/**
 * @class BemjsonToHtmlTech
 * @augments {BaseTech}
 * @classdesc
 *
 * Build HTML file.<br/><br/>
 *
 * This tech uses `BEMHTML.apply(bemjson)` to build HTML.
 *
 * @param {Object}  [options]                            Options
 * @param {String}  [options.target='?.html']            Path to a target with HTML file.
 * @param {String}  [options.bemhtmlFile='?.bemhtml.js'] Path to a file with compiled BEMHTML module.
 * @param {String}  [options.bemjsonFile='?.bemjson.js'] Path to BEMJSON file.
 *
 * @example
 * var BemjsonToHtmlTech = require('enb-bemxjst/techs/bemjson-to-html'),
 *     BemhtmlTech = require('enb-bemxjst/techs/bemhtml'),
 *     FileProvideTech = require('enb/techs/file-provider'),
 *     bem = require('enb-bem-techs');
 *
 * module.exports = function(config) {
 *     config.node('bundle', function(node) {
 *         // get BEMJSON file
 *         node.addTech([FileProvideTech, { target: '?.bemjson.js' }]);
 *
 *         // get FileList
 *         node.addTechs([
 *             [bem.levels, levels: ['blocks']],
 *             bem.bemjsonToBemdecl,
 *             bem.deps,
 *             bem.files
 *         ]);
 *
 *         // build BEMHTML file
 *         node.addTech(BemhtmlTech);
 *         node.addTarget('?.bemhtml.js');
 *
 *         // build HTML file
 *         node.addTech(BemjsonToHtmlTech);
 *         node.addTarget('?.html');
 *     });
 * };
 */
module.exports = require('enb/lib/build-flow').create()
    .name('bemjson-to-html')
    .target('target', '?.html')
    .useSourceFilename('bemhtmlFile', '?.bemhtml.js')
    .useSourceFilename('bemjsonFile', '?.bemjson.js')
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
