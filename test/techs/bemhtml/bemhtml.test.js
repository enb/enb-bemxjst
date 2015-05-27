var fs = require('fs'),
    path = require('path'),
    vow = require('vow'),
    mock = require('mock-fs'),
    TestNode = require('enb/lib/test/mocks/test-node'),
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

describe('bemhtml', function () {
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
            html = '<a class="bla"></a>',
            options = { compat: true };

        return assert(bemjson, html, templates, options);
    });

    describe('mode', function () {
        it('must build block in development mode', function () {
            var templates = ['block("bla").tag()("a")'],
                bemjson = { block: 'bla' },
                html = '<a class="bla"></a>',
                options = { devMode: true };

            return assert(bemjson, html, templates, options);
        });

        it('must build block in production mode', function () {
            var templates = ['block("bla").tag()("a")'],
                bemjson = { block: 'bla' },
                html = '<a class="bla"></a>',
                options = { devMode: false };

            return assert(bemjson, html, templates, options);
        });

        it('must build different code by mode', function () {
            var scheme = {
                    blocks: {
                        'base.bemhtml': files['i-bem.bemhtml'].contents,
                        'bla.bemhtml': 'block("bla").tag()("a")'
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

    it('must build block with custom exportName', function () {
        var scheme = {
                blocks: {
                    'base.bemhtml': files['i-bem.bemhtml'].contents,
                    'bla.bemhtml': 'block("bla").tag()("a")'
                },
                bundle: {}
            },
            bundle, fileList;

        mock(scheme);

        bundle = new TestNode('bundle');
        fileList = new FileList();
        fileList.loadFromDirSync('blocks');
        bundle.provideTechData('?.files', fileList);

        return bundle.runTechAndRequire(Tech, { exportName: 'BH' })
            .spread(function (bemhtml) {
                bemhtml.BH.apply({ block: 'bla' }).must.be('<a class="bla"></a>');
            });
    });
});

function assert(bemjson, html, templates, options) {
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

    bundle = new TestNode('bundle');
    fileList = new FileList();
    fileList.loadFromDirSync('blocks');
    bundle.provideTechData('?.files', fileList);

    return bundle.runTechAndRequire(Tech, options)
        .spread(function (bemhtml) {
            bemhtml.BEMHTML.apply(bemjson).must.be(html);
        });
}
