var mock = require('mock-fs'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    Tech = require('../../techs/html-from-bemjson-i18n'),
    writeFile = require('../lib/write-file');

describe('html-from-bemjson-i18n', function () {
    var bundle, i18n, fakeCore;

    beforeEach(function () {
        i18n = [
            'var BEM = {',
            '    I18N: function () {',
            '        return "i18n-key";',
            '    }',
            '};'
        ].join('\n');
        fakeCore = [
            'exports.BEMHTML = {',
                'apply: function(bemjson) { return "<html>" + BEM.I18N() + "</html>"; }',
            '};'
        ].join('\n');
    });

    afterEach(function () {
        mock.restore();
    });

    it('must generate html with i18n', function () {
        var scheme = {
            blocks: {},
            bundle: {
                'bundle.bemjson.js': '({ block: "block" })',
                'bundle.bemhtml.js': fakeCore,
                'bundle.lang.all.js': i18n,
                'bundle.lang.ru.js': ''
            }
        };

        mock(scheme);

        bundle = new TestNode('bundle');

        return bundle.runTechAndGetContent(
            Tech, { lang: 'ru' }
        ).spread(function (html) {
            html.toString().must.be('<html>i18n-key</html>');
        });
    });

    describe('caches', function () {
        it('must not use outdated BEMJSON', function () {
            var scheme = {
                blocks: {},
                bundle: {
                    'bundle.bemjson.js': '({ block: "block" })',
                    'bundle.bemhtml.js': [
                        'exports.BEMHTML = {',
                            'apply: function(bemjson) { return "<html>" +bemjson.block+ "</html>"; }',
                        '};'
                    ].join('\n'),
                    'bundle.lang.all.js': i18n,
                    'bundle.lang.ru.js': ''
                }
            };

            mock(scheme);

            bundle = new TestNode('bundle');

            return bundle.runTech(
                    Tech, { lang: 'ru' }
                ).then(function () {
                    return writeFile(
                        'bundle/bundle.bemjson.js',
                        '({ block: "anotherBlock" })'
                    );
                })
                .then(function () {
                    return bundle.runTechAndGetContent(Tech, { lang: 'ru' });
                })
                .spread(function (html) {
                    html.toString().must.be('<html>anotherBlock</html>');
                });
        });

        it('must not use outdated BEMHTML bundle file', function () {
            var scheme = {
                blocks: {},
                bundle: {
                    'bundle.bemjson.js': '({ block: "block" })',
                    'bundle.bemhtml.js': fakeCore,
                    'bundle.lang.all.js': i18n,
                    'bundle.lang.ru.js': ''
                }
            };

            mock(scheme);

            bundle = new TestNode('bundle');

            return bundle.runTech(
                    Tech, { lang: 'ru' }
                ).then(function () {
                    return writeFile(
                        'bundle/bundle.bemhtml.js',
                        'exports.BEMHTML = { apply: function(bemjson) { return "<html>o_o</html>"; } };'
                    );
                })
                .then(function () {
                    return bundle.runTechAndGetContent(Tech, { lang: 'ru' });
                })
                .spread(function (html) {
                    html.toString().must.be('<html>o_o</html>');
                });
        });
    });
});
