var fs = require('fs'),
    vow = require('vow'),
    mock = require('mock-fs'),
    MockNode = require('mock-enb/lib/mock-node'),
    Tech = require('../../../techs/bemhtml'),
    loadDirSync = require('mock-enb/utils/dir-utils').loadDirSync,
    FileList = require('enb/lib/file-list');

describe('bemhtml', function () {
    afterEach(function () {
        mock.restore();
    });

    it('must generate mock if there is no templates', function () {
        var templates = [];

        return build(templates)
            .spread(function (res) {
                var bemjson = { block: 'block' };

                res.BEMHTML.apply(bemjson).must.be('');
            });
    });

    it('must use `bemhtml.js` suffix', function () {
        var blocks = {
            'block.bemhtml.js': 'block("block").tag()("a")',
            'block.bemhtml': 'block("block").tag()("span")'
        };

        return build(blocks)
            .spread(function (res) {
                var bemjson = { block: 'block' },
                    html = '<a class="block"></a>';

                res.BEMHTML.apply(bemjson).must.be(html);
            });
    });

    describe('compat', function () {
        it('must throw error if old syntax', function () {
            var templates = ['block bla, tag: "a"'];

            return build(templates)
                .fail(function (err) {
                    err.must.a(Error);
                });
        });

        it('must not support old syntax for files with `.js` extension', function () {
            var blocks = {
                    'block.bemhtml.js': 'block bla, tag: "a"'
                },
                options = { compat: true };

            return build(blocks, options)
                .fail(function (err) {
                    err.must.a(Error);
                });
        });
    });

    describe('mode', function () {
        it('must build block in development mode', function () {
            var templates = ['block("bla").tag()("a")'],
                bemjson = { block: 'bla' },
                html = '<a class="bla"></a>',
                options = { devMode: true };

            return build(templates, options)
                .spread(function (res) {
                    res.BEMHTML.apply(bemjson).must.be(html);
                });
        });

        it('must build block in production mode', function () {
            var templates = ['block("bla").tag()("a")'],
                bemjson = { block: 'bla' },
                html = '<a class="bla"></a>',
                options = { devMode: false };

            return build(templates, options)
                .spread(function (res) {
                    res.BEMHTML.apply(bemjson).must.be(html);
                });
        });

        it('must build different code by mode', function () {
            var templates = ['block("bla").tag()("a")'];

            return vow.all([
                build(templates, { target: 'dev.bemhtml.js', devMode: true }),
                build(templates, { target: 'prod.bemhtml.js', devMode: false })
            ]).spread(function (dev, prod) {
                var devSource = dev[1].toString(),
                    prodSource = prod[1].toString();

                devSource.must.not.be.equal(prodSource);
            });
        });
    });

    describe('handle template errors', function () {
        it('must return rejected promise for template with syntax errors (development mode)', function () {
            var templates = ['block("bla")tag()("a")'],
                options = { devMode: true };

            return build(templates, options)
                .fail(function (error) {
                    error.message.must.be.include('Unexpected identifier');
                });
        });

        it('must return rejected promise for template with syntax errors (production mode)', function () {
            var templates = ['block("bla")tag()("a")'],
                options = { devMode: false };

            return build(templates, options)
                .fail(function (error) {
                    error.message.must.be.include('Unexpected identifier');
                });
        });
    });

    it('should throw valid error if base template is missed (for development mode)', function () {
        var blocks = {
            'block.bemhtml.js': 'block("block").tag()("a")'
        };

        return build(blocks, { devMode: true })
            .spread(function (res) {
                var bemjson = { block: 'block' };
                return res.BEMHTML.apply(bemjson);
            })
            .fail(function (error) {
                error.message.must.be.equal('Seems like you have no base templates from i-bem.bemhtml');
            });
    });

    it('should throw valid error if base template is missed (for production mode)', function () {
        var blocks = {
            'block.bemhtml.js': 'block("block").tag()("a")'
        };

        return build(blocks, { devMode: false })
            .spread(function (res) {
                var bemjson = { block: 'block' };
                return res.BEMHTML.apply(bemjson);
            })
            .fail(function (error) {
                error.message.must.be.equal('Seems like you have no base templates from i-bem.bemhtml');
            });
    });
});

function build(templates, options) {
    templates || (templates = []);
    options || (options = {});

    var scheme = {
            blocks: {},
            bundle: {}
        },
        bundle, fileList;

    if (Array.isArray(templates)) {
        if (templates.length) {
            templates.forEach(function (item, i) {
                scheme.blocks['block-' + i + '.bemhtml.js'] = item;
            });
        }
    } else {
        scheme.blocks = templates;
    }

    if (templates.length) {
        templates.forEach(function (item, i) {
            scheme.blocks['block-' + i + '.bemhtml.js'] = item;
        });
    }

    mock(scheme);

    bundle = new MockNode('bundle');
    fileList = new FileList();
    fileList.addFiles(loadDirSync('blocks'));
    bundle.provideTechData('?.files', fileList);

    return bundle.runTechAndRequire(Tech, options)
        .spread(function (res) {
            var filename = bundle.resolvePath(bundle.unmaskTargetName(options.target || '?.bemhtml.js')),
                str = fs.readFileSync(filename, 'utf-8');

            return [res, str];
        });
}
