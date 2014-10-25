var mockRequire = require('../lib/mock-require'),
    mockFs = require('mock-fs'),
    vow = require('vow'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    FileList = require('enb/lib/file-list'),
    Tech = require('../../techs/bemhtml-old'),
    fixtures = require('../lib/fixtures'),
    references = fixtures.references(['page-old.json', 'page-old.html']);

describe('bemhtml-old', function () {
    var node;

    beforeEach(function () {
        var fileList = new FileList();

        mockRequire.start();
        mockFs({
            blocks: fixtures.blocks(['i-bem.bemhtml', 'page-old.bemhtml']),
            bundle: {}
        });

        node = new TestNode('bundle');
        fileList.loadFromDirSync('blocks');
        node.provideTechData('?.files', fileList);
    });

    afterEach(function () {
        mockRequire.restore();
        mockFs.restore();
    });

    it('must build simple page in development mode', function (done) {
        node.runTechAndRequire(Tech, { devMode: true })
            .spread(function (result) {
                var html = result.BEMHTML.apply(references['page-old.json']);

                html.must.equal(references['page-old.html']);
            })
            .then(done, done);
    });

    it('must build simple page in production mode', function (done) {
        node.runTechAndRequire(Tech, { devMode: false })
            .spread(function (result) {
                var html = result.BEMHTML.apply(references['page-old.json']);

                html.must.equal(references['page-old.html']);
            })
            .then(done, done);
    });

    it('must build different code by mode', function (done) {
        vow.all([
            node.runTechAndGetContent(Tech, { devMode: true }),
            node.runTechAndGetContent(Tech, { devMode: false })
        ]).spread(function (dev, prod) {
            var devSource = dev[0],
                prodSource = prod[0];

            devSource.must.not.be.equal(prodSource);
        }).then(done, done);
    });
});
