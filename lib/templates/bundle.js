var fs = require('fs'),
    path = require('path'),
    compile = require('lodash').template,
    templatePath = path.join(__dirname, '..', 'assets', 'bundle.jst'),
    template = compile(fs.readFileSync(templatePath, 'utf-8')),
    EOL = require('os').EOL;

/**
 * Template for compile BEMHTML or BEMTREE to bundle.
 *
 * @param {String}   code                           Code compiled with the `bem-xjst` (BEMHTML or BEMTREE).
 * @param {Object}   options                        Options.
 * @param {String}   [options.exportName=BEMHTML]   Name for exports.
 * @param {Object}   [options.requires={}]          Names for dependencies.
 * @param {String}   [options.commonJSModules]      Code of CommonJS modules: require function
 *                                                  compiled with `browserify`.
 * @returns {String}
 */
module.exports = function (code, options) {
    options || (options = {});

    var exportName = options.exportName || 'BEMHTML',
        requires = options.requires || {},
        commonJSModules = options.commonJSModules,
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
};

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
