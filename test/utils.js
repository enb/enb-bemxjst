var fs = require('fs'),
    vm = require('vm'),
    vow = require('vow'),
    ym = require('ym'),
    bundle = require('../lib/bundle.js'),
    EOL = require('os').EOL,
    MOCK_BEMXJST = 'exports.libs = __bem_xjst_libs__;';

/**
 * Compiles bundle with libs.
 *
 * @param {String} [libsCode]  The source code of libs
 * @param {Object} options     The options for bundle module
 * @returns {String}
 */
function compileBundle(libsCode, options) {
    if (arguments.length === 1) {
        options = libsCode;
        libsCode = '';
    }

    return bundle.compile(MOCK_BEMXJST, options)
        .then(function (bundleCode) {
            return [
                libsCode,
                bundleCode
            ].join(EOL);
        });
}

/**
 * Evals code in simulated runtime.
 *
 * @param {Stirng}  code          The code to eval.
 * @param {Object}  opts
 * @param {Stirng}  opts.runtime  The runtime name. Possible options: node, browser.
 * @param {Boolean} opts.ym       Include YModules to runtime.
 * @returns {Object}
 */
function run(code, opts) {
    var runtime = opts.runtime,
        sandbox = {};

    if (runtime === 'node') {
        sandbox.global = {};
        sandbox.exports = {};
        sandbox.module = {
            exports: sandbox.exports
        };
    }

    if (runtime === 'browser') {
        sandbox.window = {};
    }

    if (opts.ym) {
        sandbox.modules = ym;
    }

    vm.runInNewContext(code, sandbox);

    return sandbox;
}

/**
 * Returns libs from executed code.
 *
 * @param {Object} sandbox
 * @returns {Promise<Object>}
 */
function getLibs(sandbox) {
    if (sandbox.BEMHTML) {
        return sandbox.BEMHTML.libs;
    }

    if (sandbox.exports) {
        return sandbox.exports.BEMHTML.libs;
    }

    if (sandbox.modules) {
        return new vow.Promise(function (resolve) {
            sandbox.modules.require('BEMHTML', function (BEMHTML) {
                resolve(BEMHTML.libs);
            });
        });
    }
}

/**
 * Нужно для того, чтобы mtime записанного файла гарантированно отличался от ранее созданных
 * @returns {Promise}
 */
function writeFile() {
    var defer = vow.defer(),
        args = arguments;

    setTimeout(function () {
        fs.writeFileSync.apply(fs, args);
        defer.resolve();
    }, 10);

    return defer.promise();
}

module.exports = {
    compileBundle: compileBundle,
    run: run,
    getLibs: getLibs,
    writeFile: writeFile
};
