var mockRequire = require('../lib/mock-require'),
    fs = require('fs'),
    path = require('path'),
    vow = require('vow'),
    vm = require('vm'),
    assert = require('assert'),
    mock = require('mock-fs'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    Tech = require('../../techs/bemtree'),
    FileList = require('enb/lib/file-list'),
    fixturesPath = path.join(__dirname, '..', 'fixtures', 'bemtree'),
    bemtreeCoreFilename = path.join(fixturesPath, 'i-bem.bemtree'),
    iStartFilename = path.join(fixturesPath, 'i-start.bemtree'),
    bDataFilename = path.join(fixturesPath, 'b-data.bemtree');

describe('bemtree', function () {
    beforeEach(function () {
        mockRequire.start();
    });

    afterEach(function () {
        mockRequire.restore();
        mock.restore();
    });

    describe('exportName', function () {
        it('must build block with default exportName', function () {
            return runTest();
        });

        it('must build block with custom exportName', function () {
            return runTest({ exportName: 'BEMBUSH' });
        });
    });

    describe('mode', function () {
        it('must build block in development mode', function () {
            return runTest({ devMode: true });
        });

        it('must build block in production mode', function () {
            return runTest({ devMode: false });
        });

        it('must build different code by mode', function () {
            var scheme = {
                    blocks: {
                        'base.bemtree': fs.readFileSync(bemtreeCoreFilename, 'utf-8'),
                        'bb-start.bemtree': fs.readFileSync(iStartFilename, 'utf-8')
                    },
                    bundle: {}
                },
                bundle, fileList;

            mock(scheme);

            bundle = new TestNode('bundle');
            fileList = new FileList();
            fileList.loadFromDirSync('blocks');
            bundle.provideTechData('?.files', fileList);

            return vow.all([
                bundle.runTechAndGetContent(
                    Tech, { target: 'dev.bemhtml.js', devMode: true }
                ),
                bundle.runTechAndGetContent(
                    Tech, { target: 'prod.bemhtml.js', devMode: false }
                )
            ]).spread(function (dev, prod) {
                var devSource = dev.toString(),
                    prodSource = prod.toString();

                devSource.must.not.be.equal(prodSource);
            });
        });
    });
});

function runTest(options) {
    var scheme = {
            // Файлы должны собираться в нужной последовательности
            blocks: {
                'base.bemtree': fs.readFileSync(bemtreeCoreFilename, 'utf-8'),
                'bb-start.bemtree': fs.readFileSync(iStartFilename, 'utf-8'),
                'bc-data.bemtree': fs.readFileSync(bDataFilename, 'utf-8')
            },
            bundle: {}
        },
        data = {
            bundleName: 'page',
            title: 'Some text'
        },
        expect = {
            block: 'b-data',
            mods: {},
            content: 'Some text'
        },
        exportName = (options && options.exportName) || 'BEMTREE',
        bundle, fileList;

    mock(scheme);

    bundle = new TestNode('bundle');
    fileList = new FileList();
    fileList.loadFromDirSync('blocks');
    bundle.provideTechData('?.files', fileList);

    return bundle.runTechAndGetContent(Tech, options)
        .spread(function (bemtreeSource) {
            var sandbox = {
                Vow: vow
            };

            vm.runInNewContext(bemtreeSource, sandbox);

            return sandbox[exportName].apply(data)
                .then(function (bemjson) {
                    assert.deepEqual(bemjson, expect);
                });
        });
}
