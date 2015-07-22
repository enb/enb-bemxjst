var bundle = require('../lib/bundle'),
    BEMTREE_MOCK = 'exports.apply = function () { return Vow.resolve({}); };';

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
 * @param {String}      [options.target='?.bemtree.js']    Path to target with compiled file.
 * @param {String}      [options.exportName='BEMTREE']     Name of BEMTREE template variable.
 * @param {Boolean}     [options.compat=false]             Set `compat` option to support old BEMTREE syntax.
 * @param {Boolean}     [options.devMode=true]             Set `devMode` option for convenient debugging.
 * If `devMode` is set to true, code of templates will not be compiled but only wrapped for development purposes.
 * @param {Boolean}     [options.includeVow=true]          Set `includeVow` option to include code of `vow` module
 * into template file
 * @param {String[]}    [options.sourceSuffixes]           Files with specified suffixes involved in the assembly.
 *
 * @example
 * var BemtreeTech = require('enb-bemhtml/techs/bemtree'),
 *     FileProvideTech = require('enb/techs/file-provider'),
 *     bem = require('enb-bem-techs');
 *
 * module.exports = function(config) {
 *     config.node('bundle', function(node) {
 *         // get FileList
 *         node.addTechs([
 *             [FileProvideTech, { target: '?.bemdecl.js' }],
 *             [bem.levels, levels: ['blocks']],
 *             bem.deps,
 *             bem.files
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
    .defineOption('compat', false)
    .defineOption('devMode', true)
    .defineOption('includeVow', true)
    .useFileList(['bemtree.js', 'bemtree'])
    .builder(function (sourceFiles) {
        if (sourceFiles.length === 0) {
            return bundle.compile(BEMTREE_MOCK, {
                exportName: this._exportName,
                includeVow: this._includeVow
            });
        }

        return this._sourceFilesProcess(sourceFiles, this._compat);
    })
    .createTech();
