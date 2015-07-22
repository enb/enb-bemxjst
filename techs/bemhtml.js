var bundle = require('../lib/bundle'),
    BEMHTML_MOCK = 'exports.apply = function () { return ""; };';

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
 * @param {String}    [options.target='?.bemhtml.js']    Path to target with compiled file.
 * @param {String}    [options.exportName='BEMHTML']     Name of BEMHTML template variable.
 * @param {Boolean}   [options.compat=false]             Set `compat` option to support old BEMHTML syntax.
 * @param {Boolean}   [options.devMode=true]             Set `devMode` option for convenient debugging. If `devMode` is
 * set to true, code of templates will not be compiled but only wrapped for development purposes.
 * @param {Boolean}   [options.cache=false]              Set `cache` option for cache usage.
 * @param {Object}    [options.requires]                 Names of dependencies which should be available from
 * code of templates.
 * @param {String[]}  [options.sourceSuffixes]           Files with specified suffixes involved in the assembly.
 *
 * @example
 * var BemhtmlTech = require('enb-bemhtml/techs/bemhtml'),
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
    .defineOption('cache', false)
    .defineOption('requires', {})
    .useFileList(['bemhtml.js', 'bemhtml'])
    .builder(function (sourceFiles) {
        if (sourceFiles.length === 0) {
            return bundle.compile(BEMHTML_MOCK, {
                exportName: this._exportName
            });
        }

        return this._sourceFilesProcess(sourceFiles, this._compat);
    })
    .createTech();
