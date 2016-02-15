var vow = require('vow'),
    browserify = require('browserify'),
    promisify = require('vow-node').promisify,
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
 * @param {Boolean}  [options.includeVow=false]     Include code of `vow` module, it is necessary to BEMTREE.
 * @param {Object}   [options.requires={}]          Names for dependencies.
 * @returns {String}
 */
exports.compile = function (code, options) {
    options || (options = {});

    var requires = options.requires || {};

    return compileCommonJSRequire(requires, options.dirname)
        .then(function (commonJSModules) {
            return template(code, {
                exportName: options.exportName,
                requires: requires,
                commonJSModules: commonJSModules
            });
        });
};

/**
 * Compiles require with modules from CommonJS.
 *
 * @ignore
 * @param {Object}   [requires] Names for requires to `bh.lib.name`.
 * @param {String}   [dirname]  Path to a directory with compiled file.
 * @returns {String}
 */
function compileCommonJSRequire(requires, dirname) {
    var browserifyOptions = {
            basedir: dirname
        },
        renderer = browserify(browserifyOptions),
        bundle = promisify(renderer.bundle.bind(renderer)),
        hasRequire = false;

    Object.keys(requires).forEach(function (name) {
        var item = requires[name];

        if (item.commonJS) {
            renderer.require(item.commonJS);
            hasRequire = true;
        }
    });

    if (!hasRequire) {
        return vow.resolve('');
    }

    return bundle()
        .then(function (buf) {
            return 'var ' + buf.toString('utf-8');
        });
}
