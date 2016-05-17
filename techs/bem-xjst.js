var EOL = require('os').EOL,
    vow = require('vow'),
    enb = require('enb'),
    vfs = enb.asyncFs || require('enb/lib/fs/async-fs'),
    buildFlow = enb.buildFlow || require('enb/lib/build-flow'),
    I_BEM_REG_EX = /^i-bem(__html)?\.bem(html|tree)(\.js)?$/;

/**
 * @class BemxjstTech
 * @augments {BaseTech}
 * @classdesc
 *
 * Compiles BEMXJST template files with BEMXJST translator and merges them into a single template bundle.<br/><br/>
 *
 * Important: Usually you don't need to use this tech directly.
 *
 * @param {Object}      [options]                           Options
 * @param {String}      [options.target='?.bem-xjst.js']    Path to a target with compiled file.
 * @param {Object}      [options.exports={globals: true, commonJS: true, ym: true}] Export settings.
 */
module.exports = buildFlow.create()
    .name('bem-xjst')
    .target('target', '?.bem-xjst.js')
    .defineOption('exports', {
        globals: true,
        commonJS: true,
        ym: true
    })
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

                // remove base templates as they are inside bem-xjst since 2.x
                if (this._hasBaseTemplate(file.name)) { return; }

                if (!uniques[key]) {
                    uniques[key] = true;
                    filenames.push(filename);
                }
            }, this);

            return filenames;
        },
        /**
         * Reads source files.
         *
         * Each file will be in a form of an object `{ path: String, contents: String }`.
         *
         * @param {String[]} filenames - paths to files
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
                    contents = source.contents;

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
         * @param {String} compilerFilename — path to BEMXJST processor.
         * @returns {Promise}
         * @private
         */
        _compileBEMXJST: function (sources, compilerFilename) {
            var queue = this.node.getSharedResources().jobQueue,
                engineOptions = this._engineOptions || {},
                // join source code
                sourceCode = sources.map(function (source) {
                    return source.contents;
                }).join(EOL),
                codeToCompile = [
                    sourceCode,
                    'oninit(function(exports, context) {',
                    '    var BEMContext = exports.BEMContext || context.BEMContext;',
                    '    // Provides third-party libraries from different modular systems',
                    '    BEMContext.prototype.require = function(lib) {',
                    '       return __bem_xjst_libs__[lib];',
                    '    };',
                    '});'
                ].join(EOL),
                bundle = require('../lib/bundle');

            if (this._naming && !engineOptions.naming) {
                engineOptions.naming = this._naming;
            }

            // Compiles source code using BEMXJST processor.
            return queue.push(compilerFilename, codeToCompile, engineOptions)
                .then(function (compiledCode) {
                    // Wraps compiled code for usage with different modular systems.
                    return bundle.compile(compiledCode, {
                        dirname: this.node.getDir(),
                        exportName: this._exportName,
                        requires: this._requires,
                        exports: this._exports
                    });
                }, this);
        },
        /**
         * Determines whether the file is the basic templates.
         *
         * @param {String} basename - name of file
         * @returns {Boolean}
         */
        _hasBaseTemplate: function (basename) {
            return I_BEM_REG_EX.test(basename);
        }
    })
    .createTech();
