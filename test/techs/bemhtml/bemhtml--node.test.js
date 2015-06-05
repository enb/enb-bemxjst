var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    MockNode = require('mock-enb/lib/mock-node'),
    Tech = require('../../../techs/bemhtml'),
    FileList = require('enb/lib/file-list'),
    files = {
        'i-bem.bemhtml': {
            path: path.join(__dirname, '..', '..', 'fixtures', 'i-bem.bemhtml')
        },
        ometajs: {
            path: require.resolve('bemhtml-compat/node_modules/ometajs')
        },
        'bemhtml.ometajs': {
            path: require.resolve('bemhtml-compat/lib/ometa/bemhtml.ometajs')
        }
    };

Object.keys(files).forEach(function (name) {
    var file = files[name];

    file.contents = fs.readFileSync(file.path, 'utf-8');
});

describe('bemhtml --node', function () {
    afterEach(function () {
        mock.restore();
    });

    it('must compile BEMHTML file', function () {
        var templates = ['block("bla").tag()("a")'],
            bemjson = { block: 'bla' },
            html = '<a class="bla"></a>';

        return build(templates)
            .spread(function (res) {
                res.BEMHTML.apply(bemjson).must.be(html);
            });
    });

    it('must build block with custom exportName', function () {
        var templates = ['block("bla").tag()("a")'],
            bemjson = { block: 'bla' },
            html = '<a class="bla"></a>',
            options = { exportName: 'BH' };

        return build(templates, options)
            .spread(function (res) {
                res.BH.apply(bemjson).must.be(html);
            });
    });
});

function build(templates, options) {
    options || (options = {});

    var scheme = {
            blocks: {
                'base.bemhtml': files['i-bem.bemhtml'].contents
            },
            bundle: {}
        },
        bundle, fileList;

    templates && templates.forEach(function (item, i) {
        scheme.blocks['block-' + i + '.bemhtml'] = item;
    });

    scheme[files['ometajs'].path] = files['ometajs'].contents;
    scheme[files['bemhtml.ometajs'].path] = files['bemhtml.ometajs'].contents;

    mock(scheme);

    bundle = new MockNode('bundle');
    fileList = new FileList();
    fileList.loadFromDirSync('blocks');
    bundle.provideTechData('?.files', fileList);

    return bundle.runTechAndRequire(Tech, options)
        .spread(function (res) {
            var filename = bundle.resolvePath(bundle.unmaskTargetName(options.target || '?.bemhtml.js')),
                str = fs.readFileSync(filename, 'utf-8');

            return [res, str];
        });
}
