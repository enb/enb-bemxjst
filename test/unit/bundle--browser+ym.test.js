var mockFs = require('mock-fs'),
    utils = require('../utils'),
    compile = utils.compileBundle,
    getLibs = utils.getLibs,
    run = function (code) {
        return utils.run(code, { runtime: 'browser', ym: true });
    },
    EOL = require('os').EOL;

describe('bundle --browser+ym', function () {
    describe('globals', function () {
        it('must get dependency from global scope', function () {
            var code = 'window.text = "Hello world!"',
                options = {
                    requires: { // fallback for backward compatibility, use engineOptions.requires
                        text: {
                            globals: 'text'
                        }
                    }
                };

            return compile(code, options)
                .then(run)
                .then(getLibs)
                .should.become({ text: 'Hello world!' });
        });

        it('must get dependency from global scope using dot-delimited key', function () {
            var code = 'window.text = { text: "Hello world!" };',
                options = {
                    requires: { // fallback for backward compatibility, use engineOptions.requires
                        text: {
                            globals: 'text.text'
                        }
                    }
                };

            return compile(code, options)
                .then(run)
                .then(getLibs)
                .should.become({ text: 'Hello world!' });
        });

        it('must require dependency from ym', function () {
            var code = 'modules.define("text", [], function (provide) { provide("Hello world!"); })',
                options = {
                    requires: { // fallback for backward compatibility, use engineOptions.requires
                        text: {
                            ym: 'text'
                        }
                    }
                };

            return compile(code, options)
                .then(run)
                .then(getLibs)
                .should.become({ text: 'Hello world!' });
        });
    });

    describe('commonJS', function () {
        beforeEach(function () {
            // jscs:disable
            mockFs({
                node_modules: {
                    fake: {
                        'index.js': 'module.exports = { getText: function () { return "Hello world!"; } };'
                    }
                }
            });
            // jscs:enable
        });

        afterEach(function () {
            mockFs.restore();
        });

        it('must require module from CommonJS', function () {
            var options = {
                    requires: { // fallback for backward compatibility, use engineOptions.requires
                        fake: {
                            commonJS: 'fake'
                        }
                    }
                };

            return compile(options)
                .then(run)
                .then(getLibs)
                .then(function (libs) {
                    return libs.fake.getText();
                })
                .should.become('Hello world!');
        });

        it('must get dependency from global scope if it also is presented in CommonJS', function () {
            var code = [
                    'modules.define("text", function (provide) {',
                        'provide({ getText: function () { return "^_YM_^"; } });',
                    '});'
                ].join(EOL),
                options = {
                    requires: { // fallback for backward compatibility, use engineOptions.requires
                        fake: {
                            ym: 'text',
                            commonJS: 'fake'
                        }
                    }
                };

            return compile(code, options)
                .then(run)
                .then(getLibs)
                .then(function (libs) {
                    return libs.fake.getText();
                })
                .should.become('^_YM_^');
        });
    });
});
