var EOL = require('os').EOL,
    path = require('path'),
    vow = require('vow'),
    vfs = require('enb/lib/fs/async-fs'),
    bemcompat = require('bemhtml-compat'),
    bundle = require('../lib/bundle');

/**
 * @class BemxjstTech
 * @augments {BaseTech}
 * @classdesc
 *
 * Compiles BEMXJST template files with BEMXJST translator and merges them into a single template bundle.<br/><br/>
 *
 * Important: Normally you don't need to use this tech directly.
 *
 * @param {Object}      [options]                           Options
 * @param {String}      [options.target='?.bem-xjst.js']    Path to a target with compiled file.
 */
module.exports = require('enb/lib/build-flow').create()
    .name('bem-xjst')
    .target('target', '?.bem-xjst.js')
    .methods({
        /**
         * Returns filenames to compile.
         *
         * Important: it leaves only one file for a BEM entity in a level.
         *
         * Case #1. BEM entity has several implementations on level.
         * Only file with .bemhtml.js extention will be used (if `.bemhtml.js` extention was specified first).
         *
         * blocks/
         * ├── block.bemhtml
         * └── block.bemhtml.js
         *
         * Case #2. BEM entity has several implementations on several levels.
         * Both files will be used.
         *
         * common.blocks/
         * └── block.bemhtml
         * desktop.blocks/
         * └── block.bemhtml
         *
         * @param {FileList} fileList — objects that contain file information.
         * @returns {String[]}
         * @private
         */
        _getUniqueFilenames: function (fileList) {
            var uniques = {},   // filenames without suffixes
                filenames = [];

            fileList.forEach(function (file) {
                var filename = file.fullname,
                    // filename without suffix
                    key = filename.slice(0, -(file.suffix.length + 1));

                if (!uniques[key]) {
                    uniques[key] = true;
                    filenames.push(filename);
                }
            });

            return filenames;
        },
        /**
         * Reads source files.
         *
         * Each file will be in a form of an object `{ path: String, contents: String }`.
         *
         * @param {String[]} filenames
         * @returns {Promise}
         * @private
         */
        _readFiles: function (filenames) {
            return vow.all(filenames.map(function (filename) {
                return vfs.read(filename, 'utf8')
                    .then(function (source) {
                        return {
                            path: filename,
                            contents: source
                        };
                    });
            }));
        },
        /**
         * Processes sources.
         *
         * @param {{ path: String, contents: String }[]} sources — objects that contain file information.
         * @returns {{ path: String, contents: String }[]}
         * @private
         */
        _processSources: function (sources) {
            return sources.map(function (source) {
                var filename = source.path,
                    contents = source.contents,
                    ext = path.extname(filename);

                // In files with `.js` extension stored templates only in JS syntax.
                if (this._compat && ext !== '.js') {
                    contents = bemcompat.transpile(contents);
                }

                return {
                    path: filename,
                    contents: [
                        '/* begin: ' + filename + ' */',
                        contents,
                        '/* end: ' + filename + ' */'
                    ].join(EOL)
                };
            }, this);
        },
        /**
         * Compiles source code using BEMXJST processor.
         * Wraps compiled code for usage with different modular systems.
         *
         * @param {{ path: String, contents: String }[]} sources — objects that contain file information.
         * @returns {Promise}
         * @private
         */
        _compileBEMXJST: function (sources) {
            var queue = this.node.getSharedResources().jobQueue,
                compilerFilename = path.resolve(__dirname, '../lib/bemxjst-processor'),
                compilerOptions = {
                    wrap: false,
                    optimize: !this._devMode
                },
                // join source code
                sourceCode = sources.map(function (source) {
                    return source.contents;
                }).join(EOL),
                codeToCompile = [
                    sourceCode,
                    'oninit(function(exports, context) {',
                    '    var BEMContext = exports.BEMContext || context.BEMContext;',
                    '    // Block templates can not work without base templates',
                    '    if(!BEMContext) {',
                    '        throw Error("Seems like you have no base templates from i-bem.' + this.getName() + '");',
                    '    }',
                    '    // Provides third-party libraries from different modular systems',
                    '    BEMContext.prototype.require = function(lib) {',
                    '       return __bem_xjst_libs__[lib];',
                    '    };',
                    '});'
                ].join(EOL);

            // Compiles source code using BEMXJST processor.
            return queue.push(compilerFilename, codeToCompile, compilerOptions)
                .then(function (compiledCode) {
                    // Wraps compiled code for usage with different modular systems.
                    return bundle.compile(compiledCode, {
                        dirname: this.node.getDir(),
                        exportName: this._exportName,
                        includeVow: this._includeVow,
                        requires: this._requires
                    });
                }, this);
        }
    })
    .createTech();
