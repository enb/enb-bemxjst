var mockFs = require('mock-fs'),
    MockNode = require('mock-enb/lib/mock-node'),
    Tech = require('../../techs/html-from-bemjson'),
    fixtures = require('../lib/fixtures'),
    references = fixtures.references(['page.html']);

describe('html-from-bemjson', function () {
    var node;

    beforeEach(function () {
        mockFs({
            bundle: fixtures.bundles(['bundle.bemjson.js', 'bundle.bemhtml.js'])
        });

        node = new MockNode('bundle');
    });

    afterEach(function () {
        mockFs.restore();
    });

    it('must build html', function (done) {
        node.runTechAndGetContent(Tech)
            .spread(function (html) {
                html.toString('utf8').must.equal(references['page.html']);
            })
            .then(done, done);
    });
});
