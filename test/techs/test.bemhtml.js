var vow = require('vow');
var mockFs = require('mock-fs');
var TestNode = require('enb/lib/test/mocks/test-node');
var FileList = require('enb/lib/file-list');
var Tech = require('../../techs/bemhtml');
var fixtures = require('../lib/fixtures');
var references = fixtures.references(['page.json', 'page.html']);

describe('bemhtml', function () {
    var node;
    var fileList;

    beforeEach(function () {
        mockFs({
            blocks: fixtures.blocks(['i-bem.bemhtml', 'page.bemhtml']),
            bundle: {}
        });

        node = new TestNode('bundle');

        fileList = new FileList();
        fileList.loadFromDirSync('blocks');

        node.provideTechData('?.files', fileList);
    });

    afterEach(function () {
        mockFs.restore();
    });

    it('must build simple page in development mode', function (done) {
        node.runTechAndRequire(Tech, { devMode: true })
            .spread(function (result) {
                var html = result.BEMHTML.apply(references['page.json']);

                html.must.equal(references['page.html']);
            })
            .then(done, done);
    });

    it('must build simple page in production mode', function (done) {
        node.runTechAndRequire(Tech, { devMode: false })
            .spread(function (result) {
                var html = result.BEMHTML.apply(references['page.json']);

                html.must.equal(references['page.html']);
            })
            .then(done, done);
    });

    it('must build different code by mode', function (done) {
        vow.all([
            node.runTechAndGetContent(Tech, { devMode: true }),
            node.runTechAndGetContent(Tech, { devMode: false })
        ]).spread(function (dev, prod) {
            var devSource = dev[0];
            var prodSource = prod[0];

            devSource.must.not.be.equal(prodSource);
        }).then(done, done);
    });
});
