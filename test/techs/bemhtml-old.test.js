var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    Tech = require('../../techs/bemhtml-old'),
    FileList = require('enb/lib/file-list'),
    bemhtmlCoreFilename = path.join(__dirname, '..', 'fixtures', 'i-bem.bemhtml'),
    ometajsPath = require.resolve('bemhtml-compat/node_modules/ometajs'),
    ometaBemhtmlPath  = require.resolve('bemhtml-compat/lib/ometa/bemhtml.ometajs'),
    ometajsContents = fs.readFileSync(ometajsPath, 'utf-8'),
    ometaBemhtmlContents = fs.readFileSync(ometaBemhtmlPath, 'utf-8');

describe('bemhtml-old', function () {
    afterEach(function () {
        mock.restore();
    });

    it('must compile BEMHTML file', function () {
        var templates = ['block("bla").tag()("a")'],
            bemjson = { block: 'bla' },
            html = '<a class="bla"></a>';

        return assert(bemjson, html, templates);
    });

    it('must support old syntax', function () {
        var templates = ['block bla, tag: "a"'],
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

    scheme[ometajsPath] = ometajsContents;
    scheme[ometaBemhtmlPath] = ometaBemhtmlContents;

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
