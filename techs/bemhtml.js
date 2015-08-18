var bundle = require('../lib/bundle');

/**
 * @class BemhtmlTech
 * @augments {BemxjstTech}
 * @classdesc
 *
 * Compiles BEMHTML template files with BEMXJST translator and merges them into a single BEMHTML bundle.<br/><br/>
 *
 * Important: It supports only JS syntax by default. Use `compat` option to support old BEMHTML syntax.
 *
 * @param {Object}    [options]                          Options
 * @param {String}    [options.target='?.bemhtml.js']    Path to a target with compiled file.
 * @param {String}    [options.filesTarget='?.files']    Path to a target with FileList.
 * @param {String[]}  [options.sourceSuffixes]           Files with specified suffixes involved in the assembly.
 * @param {String}    [options.exportName='BEMHTML']     Name of BEMHTML template variable.
 * @param {Boolean}   [options.compat=false]             Sets `compat` option to support old BEMHTML syntax.
 * @param {Boolean}   [options.devMode=true]             Sets `devMode` option for convenient debugging. If `devMode` is
 * set to true, code of templates will not be compiled but only wrapped for development purposes.
 * @param {Object}    [options.requires]                 Names of dependencies which should be available from
 * code of templates.
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
 *             [bemTechs.levels, levels: ['blocks']],
 *             bemTechs.deps,
 *             bemTechs.files
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
    .defineOption('compat', false)
    .defineOption('devMode', true)
    .defineOption('requires', {})
    .useFileList(['bemhtml.js', 'bemhtml'])
    .builder(function (fileList) {
        // don't add fat wrapper code of bem-xjst
        if (fileList.length === 0) {
            return this._mockBEMHTML();
        }

        var filenames = this._getUniqueFilenames(fileList);

        return this._readFiles(filenames)
            .then(this._processSources, this)
            .then(this._compileBEMXJST, this);
    })
    .methods({
        /**
         * Returns BEMHTML mock.
         *
         * @returns {String}
         * @private
         */
        _mockBEMHTML: function () {
            var code = 'exports.apply = function () { return ""; };';

            return bundle.compile(code, {
                exportName: this._exportName
            });
        }
    })
    .createTech();
