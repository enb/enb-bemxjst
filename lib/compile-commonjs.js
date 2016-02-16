var vow = require('vow'),
    browserify = require('browserify'),
    promisify = require('vow-node').promisify;

/**
 * Compiles require with modules from CommonJS.
 *
 * @param {Object}   [requires] Names for requires to `bh.lib.name`.
 * @param {String}   [dirname]  Path to a directory with compiled file.
 * @returns {String}
 */
module.exports = function compileCommonJSRequire(requires, dirname) {
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
};
