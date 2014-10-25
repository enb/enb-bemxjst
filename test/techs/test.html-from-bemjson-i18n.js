var mockFs = require('mock-fs'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    Tech = require('../../techs/html-from-bemjson-i18n'),
    fixtures = require('../lib/fixtures'),
    references = fixtures.references(['page.ru.html']);

describe('html-from-bemjson-i18n', function () {
    var node;

    beforeEach(function () {
        mockFs({
            bundle: fixtures.bundles([
                'bundle.bemjson.js', 'bundle.bemhtml.i18n.js',
                'bundle.lang.all.js', 'bundle.lang.ru.js'
            ])
        });

        node = new TestNode('bundle');
    });

    afterEach(function () {
        mockFs.restore();
    });

    it('must build html', function (done) {
        node.runTechAndGetContent(Tech, { bemhtmlFile: '?.bemhtml.i18n.js', langFile: '?.lang.ru.js' })
            .spread(function (html) {
                html.toString('utf8').must.equal(references['page.ru.html']);
            })
            .then(done, done);
    });
});
