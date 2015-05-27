var vowCode = require('./vow-code'),
    EOL = require('os').EOL;

/**
 * Wrap code of BEMHTML or BEMTREE to bundle.
 *
 * The compiled bundle supports CommonJS and YModules. If there is no any modular system in the runtime,
 * the module will be provided as global variable with name specified in `exportName` option.
 *
 * @param {String}   code                           Code compiled with the `bem-xjst` (BEMHTML or BEMTREE).
 * @param {Object}   [options]                      Options.
 * @param {String}   [options.exportName=BEMHTML]   Name for exports.
 * @param {Object}   [options.modulesDeps]          Dependencies for YModules.
 * @param {Boolean}  [options.includeVow=false]     Include code of `vow` module, it is necessary to BEMTREE.
 * @returns {String}
 */
exports.compile = function (code, options) {
    options || (options = {});

    var exportName = options.exportName || 'BEMHTML',
        deps = options.modulesDeps,
        modulesDeps = deps ? ', ' + JSON.stringify(Object.keys(deps)) : '',
        modulesProvidedDeps =  deps ? ', ' + Object.keys(deps).map(function (module) {
            var providedName = deps[module];
            return providedName === true ? module : providedName;
        }).join(', ') : '';

    return [
        '(function(g) {',
        '  var __bem_xjst = function(exports' + modulesProvidedDeps + ') {',
        options.includeVow ? vowCode : '',
        '     ' + code + ';',
        '     return exports;',
        '  }',
        '  var defineAsGlobal = true;',
        '  if(typeof module === "object" && typeof module.exports === "object") {',
        '    exports["' + exportName + '"] = __bem_xjst({}' + modulesProvidedDeps + ');',
        '    defineAsGlobal = false;',
        '  }',
        '  if(typeof modules === "object") {',
        '    modules.define("' + exportName + '"' + modulesDeps + ',',
        '      function(provide' + modulesProvidedDeps + ') {',
        '        provide(__bem_xjst({}' + modulesProvidedDeps + ')) });',
        '    defineAsGlobal = false;',
        '  }',
        '  defineAsGlobal && (g["' + exportName + '"] = __bem_xjst({}' + modulesProvidedDeps + '));',
        '})(this);'
    ].join(EOL);
};
