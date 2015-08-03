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
 * It supports only JS syntax by default. Use `compat` option to support old BEMXJST syntax. <br/><br/>
 *
 * @param {Object}      [options]                           Options
 * @param {String}      [options.target='?.bem-xjst.js']    Path to a target with compiled file.
 */
module.exports = require('enb/lib/build-flow').create()
    .name('bem-xjst')
    .target('target', '?.bem-xjst.js')
    .methods({
        /**
         * Processes all given source files. Join them into single file and pass into BEMXJST compiler.
         * @param {Object[]} sourceFiles — objects that contain file information.
         * @param {Boolean} oldSyntax — enables transpilation from old syntax to regular JS syntax.
         * @returns {Promise}
         * @private
         */
        _sourceFilesProcess: function (sourceFiles, oldSyntax) {
            var added = {};

            return vow.all(sourceFiles.filter(function (file) {
                    var key = file.fullname.slice(0, -(file.suffix.length + 1));

                    if (added[key]) {
                        return false;
                    }

                    added[key] = true;

                    return true;
                }).map(function (file) {
                    return vfs.read(file.fullname, 'utf8')
                        .then(function (source) {
                            if (oldSyntax) {
                                source = bemcompat.transpile(source);
                            }

                            return '/* begin: ' + file.fullname + ' *' + '/\n' +
                                source +
                                '\n/* end: ' + file.fullname + ' *' + '/';
                        });
                }))
                .then(function (sources) {
                    return this._bemxjstProcess(sources.join('\n'));
                }, this);
        },
        /**
         * Uses BEMXJST processor for templates compilation.
         * Wraps compiled code for usage with different modular systems.
         * @param {String} source — merged code of templates.
         * @returns {Promise}
         * @private
         */
        _bemxjstProcess: function (source) {
            var jobQueue = this.node.getSharedResources().jobQueue,
                template = [
                    'oninit(function(exports, context) {',
                    '    var BEMContext = exports.BEMContext || context.BEMContext;',
                    '    if(!BEMContext) {',
                    '        throw Error("Seems like you have no base templates from i-bem.' + this.getName() + '");',
                    '    }',
                    '    BEMContext.prototype.require = function(lib) {',
                    '       return __bem_xjst_libs__[lib];',
                    '    };',
                    '});'
                ].join(EOL);

            source += EOL + template;

            return jobQueue.push(
                    path.resolve(__dirname, '../lib/bemxjst-processor'),
                    source,
                    {
                        wrap: false,
                        optimize: !this._devMode,
                        cache: !this._devMode && this._cache
                    }
                )
                .then(function (code) {
                    return bundle.compile(code, {
                        exportName: this._exportName,
                        includeVow: this._includeVow,
                        requires: this._requires
                    });
                }, this);
        }
    })
    .createTech();
