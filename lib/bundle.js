var fs = require('fs'),
    path = require('path'),
    vow = require('vow'),
    browserify = require('browserify'),
    promisify = require('vow-node').promisify,
    compile = require('lodash').template,
    templatePath = path.join(__dirname, 'assets', 'bundle.jst'),
    template = compile(fs.readFileSync(templatePath, 'utf-8')),
    EOL = require('os').EOL;

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

    var exportName = options.exportName || 'BEMHTML',
        requires = options.requires || {},
        libs = {
            commonJS: Object.keys(requires).reduce(function (prev, name) {
                var item = requires[name];
                if (item.commonJS) {
                    prev.push(name + ': require("' + item.commonJS + '")');
                } else if (item.globals) {
                    prev.push(name + ': global' + compileGlobalAccessor(item.globals));
                }
                return prev;
            }, []),
            yModules: Object.keys(requires).reduce(function (prev, name) {
                var item = requires[name];
                if (item.ym) {
                    prev.push(name + ': ' + name);
                } else if (item.commonJS) {
                    prev.push(name + ': require("' + item.commonJS + '")');
                } else if (item.globals) {
                    prev.push(name + ': global' + compileGlobalAccessor(item.globals));
                }
                return prev;
            }, []),
            global: Object.keys(requires).reduce(function (prev, name) {
                var item = requires[name];
                if (item.globals) {
                    prev.push(name + ': global' + compileGlobalAccessor(item.globals));
                } else if (item.commonJS) {
                    prev.push(name + ': require("' + item.commonJS + '")');
                }
                return prev;
            }, [])
        };

    libs = Object.keys(libs).reduce(function (prev, item) {
        prev[item] = '{' + libs[item].join(',' + EOL) + '}';
        return prev;
    }, {});

    var ymDependencyNames = [],
        ymDependencyVars = [];

    Object.keys(requires).forEach(function (name) {
        var item = requires[name];

        if (item.ym) {
            ymDependencyNames.push(item.ym);
            ymDependencyVars.push(name);
        }
    });

    return compileCommonJSRequire(requires, options.dirname).then(function (commonJSModules) {
        return template({
            exportName: exportName,
            bemxjst: code,
            commonJSModules: commonJSModules,
            commonJSDependencies: libs.commonJS,
            globalDependencies: libs.global,
            ymDependencies: libs.yModules,
            ymDependencyNames: ymDependencyNames.map(function (name) { return '"' + name + '"'; }).join(','),
            ymDependencyVars: ymDependencyVars.join(',')
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

/**
 * Compiles accessor path of the `global` object.
 *
 * @ignore
 * @param {String} value  Dot delimited accessor path
 * @returns {String}
 */
function compileGlobalAccessor(value) {
    return '["' + value.split('.').join('"]["') + '"]';
}
