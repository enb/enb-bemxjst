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
 * @param {Object}   [options.requires={}]          Deprecated. Fallback for backward
 *                                                  compatibility, use options.engineOptions.requires
 * @returns {String}
 */
exports.compile = function (code, options) {
    options || (options = {});

    var requires;

    if (options.requires) {
        requires = options.requires;
    } else if (options.engineOptions && options.engineOptions.requires) {
        requires = options.engineOptions.requires;
    } else {
        requires = {};
    }

    return compileCommonJS(requires, options.dirname)
        .then(function (commonJSModules) {
            return template(code, {
                exportName: options.exportName,
                requires: requires,
                commonJSModules: commonJSModules
            });
        });
};
