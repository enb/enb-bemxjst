var compileCommonJS = require('./compile-commonjs'),
    template = require('./templates/bundle');

/**
 * Wraps code of BEMHTML or BEMTREE to bundle.
 *
 * The compiled bundle supports CommonJS and YModules. If there is no any modular system in the runtime,
 * the module will be provided as global variable with name specified in `exportName` option.
 *
 * @param {String}   code                           Code compiled with the `bem-xjst` (BEMHTML or BEMTREE).
 * @param {Object}   options                        Options.
 * @param {String}   opts.dirname                   Path to a directory with compiled file.
 * @param {String}   [options.exportName=BEMHTML]   Name for exports.
 * @param {Object}   [options.requires={}]          Names for dependencies.
 * @param {Object}   [options.exports={globals: true, commonJS: true, ym: true}] Export settings.
 * @returns {String}
 */
exports.compile = function (code, options) {
    options || (options = {});

    var requires = options.requires || {};

    return compileCommonJS(requires, options.dirname)
        .then(function (commonJSModules) {
            return template(code, {
                exportName: options.exportName,
                requires: requires,
                exports: options.exports,
                commonJSModules: commonJSModules
            });
        });
};
