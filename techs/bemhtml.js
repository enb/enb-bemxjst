var path = require('path');

/**
 * @class BemhtmlTech
 * @augments {BemxjstTech}
 * @classdesc
 *
 * Compiles BEMHTML template files with BEMXJST translator and merges them into a single BEMHTML bundle.
 *
 * Important: It supports only JS syntax.
 *
 * @param {Object}    [options]                        Options
 * @param {String}    [options.target='?.bemhtml.js']  Path to a target with compiled file.
 * @param {String}    [options.filesTarget='?.files']  Path to a target with FileList.
 * @param {String[]}  [options.sourceSuffixes]         Files with specified suffixes involved in the assembly.
 * @param {String}    [options.exportName='BEMHTML']   Name of BEMHTML template variable.
 * @param {Object}    [options.requires]               Deprecated! Use `engineOptions.requires` instead.
 *                                                     Names of dependencies which should be available from
 *                                                     code of templates.
 * @param {Boolean}   [options.forceBaseTemplates=false] Include base templates if no user templates present
 * @param {Object}    [options.engineOptions]          Proxies options to bem-xjst
 * @param {Object}    [options.naming]                 Deprecated! Use `engineOptions.naming` instead.
 *                                                     Custom naming convention:
 *                                                       * String `elem` — separates element's name from block.
 *                                                         Default as `__`.
 *                                                       * String `mod` — separates names and values of modifiers
 *                                                         from blocks and elements. Default as `_`.
 *
 * @example
 * var BemhtmlTech = require('enb-bemxjst/techs/bemhtml'),
 *     FileProvideTech = require('enb/techs/file-provider'),
 *     bemTechs = require('enb-bem-techs');
 *
 * module.exports = function(config) {
 *     config.node('bundle', function(node) {
 *         // get FileList
 *         node.addTechs([
 *             [FileProvideTech, { target: '?.bemdecl.js' }],
 *             [bemTechs.levels, { levels: ['blocks'] }],
 *             [bemTechs.deps],
 *             [bemTechs.files]
 *         ]);
 *
 *         // build BEMHTML file
 *         node.addTech(BemhtmlTech);
 *         node.addTarget('?.bemhtml.js');
 *     });
 * };
 */
module.exports = require('./bem-xjst').buildFlow()
    .name('bemhtml')
    .target('target', '?.bemhtml.js')
    .defineOption('exportName', 'BEMHTML')
    .defineOption('naming')
    .defineOption('engineOptions')
    .defineOption('requires')
    .defineOption('iife', false)
    .defineOption('sourcemap', false)
    .defineOption('forceBaseTemplates', false)
    .useFileList(['bemhtml.js'])
    .builder(function (fileList) {
        // don't add fat wrapper code of bem-xjst
        if (!this._forceBaseTemplates && fileList.length === 0) {
            return this._mockBEMHTML();
        }

        var filenames = this._getUniqueFilenames(fileList);

        return this._readFiles(filenames)
            .then(this._processSources, this)
            .then(this._compileBEMHTML, this);
    })
    .methods({
        /**
         * Returns BEMHTML mock.
         *
         * @returns {String}
         * @private
         */
        _mockBEMHTML: function () {
            var code = 'exports.apply = function () { return ""; };',
                bundle = require('../lib/bundle');

            return bundle.compile(code, {
                exportName: this._exportName
            });
        },
        /**
         * Compiles source code using BEMHTML processor.
         * Wraps compiled code for usage with different modular systems.
         *
         * @param {{ path: String, contents: String }[]} sources — objects that contain file information.
         * @returns {Promise}
         * @private
         */
        _compileBEMHTML: function (sources) {
            var compilerFilename = path.resolve(__dirname, '../lib/bemhtml-processor');

            return this._compileBEMXJST(sources, compilerFilename);
        }
    })
    .createTech();
