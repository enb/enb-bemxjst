var vow = require('vow');
var mockFs = require('mock-fs');
var mockRequire = require('../lib/mock-require');
var TestNode = require('enb/lib/test/mocks/test-node');
var FileList = require('enb/lib/file-list');
var Tech = require('../../techs/bemhtml-old');
var fixtures = require('../lib/fixtures');
var references = fixtures.references(['page-old.json', 'page-old.html']);

describe('bemhtml-old', function () {
    var node;
    var fileList;

    beforeEach(function () {
        mockRequire.start();
        mockFs({
            blocks: fixtures.blocks(['i-bem.bemhtml', 'page-old.bemhtml']),
            bundle: {}
        });

        node = new TestNode('bundle');

        fileList = new FileList();
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
            var devSource = dev[0];
            var prodSource = prod[0];

            devSource.must.not.be.equal(prodSource);
        }).then(done, done);
    });
});
