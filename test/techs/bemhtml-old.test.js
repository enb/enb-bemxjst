var mockRequire = require('../lib/mock-require'),
    fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    Tech = require('../../techs/bemhtml-old'),
    FileList = require('enb/lib/file-list'),
    bemhtmlCoreFilename = path.join(__dirname, '..', 'fixtures', 'i-bem.bemhtml');

describe('bemhtml-old', function () {
    beforeEach(function () {
        mockRequire.start();
    });

    afterEach(function () {
        mockRequire.restore();
        mock.restore();
    });

    it('must compile BEMHTML file', function () {
        var templates = ['block("bla").tag()("a")'],
            bemjson = { block: 'bla' },
            html = '<a class="bla"></a>';

        return assert(bemjson, html, templates);
    });
});

function assert(bemjson, html, templates, options) {
    var scheme = {
            blocks: {
                'base.bemhtml': fs.readFileSync(bemhtmlCoreFilename, 'utf-8')
            },
            bundle: {}
        },
        bundle, fileList;

    templates && templates.forEach(function (item, i) {
        scheme.blocks['block-' + i + '.bemhtml'] = item;
    });

    mock(scheme);

    bundle = new TestNode('bundle');
    fileList = new FileList();
    fileList.loadFromDirSync('blocks');
    bundle.provideTechData('?.files', fileList);

    return bundle.runTechAndRequire(Tech, options)
        .spread(function (bemhtml) {
            bemhtml.BEMHTML.apply(bemjson).must.be(html);
        });
}
