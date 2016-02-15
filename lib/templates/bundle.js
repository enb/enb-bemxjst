var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    assetDir = path.join(__dirname, '..', 'assets'),
    templates = {
        globals:  { path: path.join(assetDir, 'global-dependencies.jst') },
        commonjs: { path: path.join(assetDir, 'commonjs-dependencies.jst') },
        ym:       { path: path.join(assetDir, 'ym-dependencies.jst') },
        bundle:   { path: path.join(assetDir, 'bundle.jst') }
    };

// load templates
_.mapKeys(templates, function (template, name) {
    templates[name] = _.template(fs.readFileSync(template.path, 'utf-8'));
});

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

    var requires = options.requires || {},
        templateOpts = { requires: requires },
        ymDependencyNames = [],
        ymDependencyVars = [];

    _.map(requires, function (item, name) {
        if (item.ym) {
            ymDependencyNames.push(item.ym);
            ymDependencyVars.push(name);
        }
    });

    return templates.bundle({
        exportName: options.exportName || 'BEMHTML',
        bemxjst: code,
        commonJSModules: options.commonJSModules,

        globalDependencies:   templates.globals(templateOpts),
        commonJSDependencies: templates.commonjs(templateOpts),
        ymDependencies:       templates.ym(templateOpts),
        ymDependencyNames:    ymDependencyNames,
        ymDependencyVars:     ymDependencyVars
    });
};
