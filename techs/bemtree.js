var path = require('path');

/**
 * @class BemtreeTech
 * @augments {BemxjstTech}
 * @classdesc
 *
 * Compiles BEMTREE template files with BEMXJST translator and merges them into a single BEMTREE bundle.
 *
 * Important: It supports only JS syntax.
 *
 * @param {Object}   [options]                          Options
 * @param {String}   [options.target='?.bemtree.js']    Path to a target with compiled file.
 * @param {String}   [options.filesTarget='?.files']    Path to a target with FileList.
 * @param {String[]} [options.sourceSuffixes]           Files with specified suffixes involved in the assembly.
 * @param {String}   [options.exportName='BEMTREE']     Name of BEMTREE template variable.
 * @param {Object}   [options.requires]                 Deprecated! Use `engineOptions.requires` instead.
 *                                                      Names of dependencies which should be available from
 *                                                      code of templates.
 * @param {Object}   [options.engineOptions]            Proxies options to bem-xjst
 * @param {Boolean}  [options.forceBaseTemplates=false] Include base templates if no user templates present
 *
 * @example
 * var BemtreeTech = require('enb-bemxjst/techs/bemtree'),
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
 *         // build BEMTREE file
 *         node.addTech(BemtreeTech);
 *         node.addTarget('?.bemtree.js');
 *     });
 * };
 */
module.exports = require('./bem-xjst').buildFlow()
    .name('bemtree')
    .target('target', '?.bemtree.js')
    .defineOption('exportName', 'BEMTREE')
    .defineOption('engineOptions')
    .defineOption('requires')
    .defineOption('forceBaseTemplates', false)
    .useFileList(['bemtree.js'])
    .builder(function (fileList) {
        // don't add fat wrapper code of bem-xjst
        if (!this._forceBaseTemplates && fileList.length === 0) {
            return this._mockBEMTREE();
        }

        var filenames = this._getUniqueFilenames(fileList);

        return this._readFiles(filenames)
            .then(this._processSources, this)
            .then(this._compileBEMTREE, this);
    })
    .methods({
        /**
         * Returns BEMTREE mock.
         *
         * @returns {String}
         * @private
         */
        _mockBEMTREE: function () {
            var code = 'exports.apply = function (data) { return data; };',
                bundle = require('../lib/bundle');

            return bundle.compile(code, {
                exportName: this._exportName
            });
        },
        /**
         * Compiles source code using BEMTREE processor.
         * Wraps compiled code for usage with different modular systems.
         *
         * @param {{ path: String, contents: String }[]} sources — objects that contain file information.
         * @returns {Promise}
         * @private
         */
        _compileBEMTREE: function (sources) {
            var compilerFilename = path.resolve(__dirname, '../lib/bemtree-processor');

            return this._compileBEMXJST(sources, compilerFilename);
        }
    })
    .createTech();
