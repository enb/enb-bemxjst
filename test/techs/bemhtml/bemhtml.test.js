var fs = require('fs'),
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

    describe('handle template errors', function () {
        it('must return rejected promise for template with syntax errors (development mode)', function () {
            var templates = ['block("bla")tag()("a")'];

            return build(templates)
                .fail(function (error) {
                    error.message.must.be.include('Unexpected identifier');
                });
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
