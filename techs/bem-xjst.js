var vow = require('vow'),
    enb = require('enb'),
    vfs = enb.asyncFs || require('enb/lib/fs/async-fs'),
    buildFlow = enb.buildFlow || require('enb/lib/build-flow'),
    File = require('enb-source-map/lib/file'),
    I_BEM_REG_EX = /^i-bem(__html)?\.bem(html|tree)(\.js)?$/;

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
module.exports = buildFlow.create()
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
            return sources;
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
                file = new File(this.node.resolvePath(this._target), { sourceMap: this._sourcemap }),
                needWrapIIFE = this._iife;

            sources.forEach(function (source) {
                file.writeLine('/* begin: ' + source.path + ' */');
                needWrapIIFE && file.writeLine('(function(){');
                file.writeFileContent(source.path, source.contents);
                needWrapIIFE && file.writeLine('}());');
                file.writeLine('/* end: ' + source.path + ' */');
            });

            if (this._naming && !engineOptions.naming) {
                engineOptions.naming = this._naming;
            }

            engineOptions.exportName || (engineOptions.exportName = this._exportName);

            if (this._requires) {
                this.node.getLogger().logOptionIsDeprecated(
                    this.node.unmaskTargetName(this._target),
                    'enb-bemxjst',
                    this.getName(),
                    'requires',
                    'engineOptions.requires',
                    ' It will be removed in v9.0.0.'
                );

                if (!engineOptions.requires) {
                    engineOptions.requires = this._requires;
                }
            }

            engineOptions.sourceMap = { from: this._target };

            var prevSourceMap = file.getSourceMap();

            if (prevSourceMap) {
                prevSourceMap.file = this._target;
                engineOptions.sourceMap.prev = prevSourceMap
            }

            return queue.push(compilerFilename, file.render(), engineOptions);
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
