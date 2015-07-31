var fs = require('fs'),
    contents = fs.readFileSync(require.resolve('vow'), 'utf-8'),
    EOL = require('os').EOL;

/**
 * Code of `vow` module.
 *
 * Provides to `Vow` variable.
 *
 * This code is used for correct work of BEMTREE. Base templates of BEMTREE expect `vow` module from `Vow` variable.
 * Without this variable work of BEMTREE will be completed with an error.
 *
 * @type {String}
 */
module.exports = [
    // Prohibits `vow` module to provide itself in modular systems: CommonJS, YModules, AMD.
    'var __vow_init = function(module, exports, modules, define){',
    contents,
    '};',
    // Overrides execution context to `__sandbox`.
    // After execution `vow` is available in `__sandbox.vow`.
    'var __sandbox = {};',
    '__vow_init.apply(__sandbox)',
    // Provides module to `Vow` variable
    'var Vow = __sandbox.vow;'
].join(EOL);
