var vow = require('vow'),
    mockFs = require('mock-fs'),
    mockRequire = require('../lib/mock-require'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    FileList = require('enb/lib/file-list'),
    Tech = require('../../techs/bemtree-old'),
    fixtures = require('../lib/fixtures'),
    references = fixtures.references(['data.json', 'page-old.json']);

describe('bemtree-old', function () {
    var node;

    beforeEach(function () {
        var fileList = new FileList();

        mockRequire.start();
        mockFs({
            blocks: fixtures.blocks(['i-bem.bemtree', 'vow.bemtree', 'i-start-old.bemtree', 'page-old.bemtree']),
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

    it('must build simple view of page in dev mode', function (done) {
        node.runTechAndRequire(Tech, { devMode: true })
            .spread(function (result) {
                return result.BEMTREE.apply(references['data.json']);
            })
            .then(function (view) {
                view.must.eql(references['page-old.json']);
            })
            .then(done, done);
    });

    it('must build simple view of page in production mode', function (done) {
        node.runTechAndRequire(Tech, { devMode: false })
            .spread(function (result) {
                return result.BEMTREE.apply(references['data.json']);
            })
            .then(function (view) {
                view.must.eql(references['page-old.json']);
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
