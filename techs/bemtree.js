var bundle = require('../lib/bundle');

/**
 * @class BemtreeTech
 * @augments {BemxjstTech}
 * @classdesc
 *
 * Compiles BEMTREE template files with BEMXJST translator and merges them into a single BEMTREE bundle.<br/><br/>
 *
 * Important: It supports only JS syntax by default. Use `compat` option to support old BEMTREE syntax.
 *
 * @param {Object}      [options]                          Options
 * @param {String}      [options.target='?.bemtree.js']    Path to a target with compiled file.
 * @param {String}      [options.filesTarget='?.files']    Path to a target with FileList.
 * @param {String[]}    [options.sourceSuffixes]           Files with specified suffixes involved in the assembly.
 * @param {String}      [options.exportName='BEMTREE']     Name of BEMTREE template variable.
 * @param {Boolean}     [options.compat=false]             Sets `compat` option to support old BEMTREE syntax.
 * @param {Boolean}     [options.devMode=true]             Sets `devMode` option for convenient debugging.
 * If `devMode` is set to true, code of templates will not be compiled but only wrapped for development purposes.
 * @param {Object}      [options.requires]                 Names of dependencies which should be available from
 * code of templates.
 * @param {Boolean}     [options.includeVow=true]          Sets `includeVow` option to include code of `vow` module
 * into a template file.
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
 *             [bemTechs.levels, levels: ['blocks']],
 *             bemTechs.deps,
 *             bemTechs.files
 *         ]);
 *
 *         // builds BEMTREE file
 *         node.addTech(BemtreeTech);
 *         node.addTarget('?.bemtree.js');
 *     });
 * };
 */
module.exports = require('./bem-xjst').buildFlow()
    .name('bemtree')
    .target('target', '?.bemtree.js')
    .defineOption('exportName', 'BEMTREE')
    .defineOption('compat', false)
    .defineOption('devMode', true)
    .defineOption('requires', {})
    .defineOption('includeVow', true)
    .useFileList(['bemtree.js', 'bemtree'])
    .builder(function (fileList) {
        // don't add fat wrapper code of bem-xjst
        if (fileList.length === 0) {
            return this._mockBEMTREE();
        }

        var filenames = this._getUniqueFilenames(fileList);

        return this._readFiles(filenames)
            .then(this._processSources, this)
            .then(this._compileBEMXJST, this);
    })
    .methods({
        /**
         * Returns BEMTREE mock.
         *
         * @returns {String}
         * @private
         */
        _mockBEMTREE: function () {
            var code = 'exports.apply = function () { return Vow.resolve({}); };';

            return bundle.compile(code, {
                exportName: this._exportName,
                includeVow: this._includeVow
            });
        }
    })
    .createTech();
