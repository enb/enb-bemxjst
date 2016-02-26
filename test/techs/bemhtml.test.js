var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    MockNode = require('mock-enb/lib/mock-node'),
    Tech = require('../../techs/bemhtml'),
    loadDirSync = require('mock-enb/utils/dir-utils').loadDirSync,
    FileList = require('enb/lib/file-list'),
    bundlePath = path.resolve('lib/bundle.js');

describe('bemhtml', function () {
    before(function () {
        var JobQueueStub = require('mock-enb/lib/job-queue-stub');

        // Использование mock-fs не позволяет подключить bemxjst-processor в рантайме
        // https://github.com/tschaub/mock-fs/issues/12
        // поэтому подключаем его перед инициализацией mock-fs
        JobQueueStub.prototype.processor = require('../../lib/bemhtml-processor');
    });

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

    it('must keep base templates if there is no templates and forceBaseTemplates option is true', function () {
        var templates = [];

        return build(templates, { forceBaseTemplates: true })
            .spread(function (res) {
                var bemjson = { block: 'block' },
                    html = '<div class="block"></div>';

                res.BEMHTML.apply(bemjson).must.be(html);
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

    describe('base templates', function () {
        it('must ignore templates in `i-bem`', function () {
            var blocks = {
                'i-bem.bemhtml.js': 'block("block").tag()("a")'
            };

            return build(blocks)
                .spread(function (res) {
                    var bemjson = { block: 'block' },
                        html = '<div class="block"></div>';

                    res.BEMHTML.apply(bemjson).must.be(html);
                });
        });

        it('must ignore templates in `i-bem__html`', function () {
            var blocks = {
                'i-bem__html.bemhtml': 'block("block").tag()("a")'
            };

            return build(blocks, { sourceSuffixes: ['bemhtml.js', 'bemhtml'] })
                .spread(function (res) {
                    var bemjson = { block: 'block' },
                        html = '<div class="block"></div>';

                    res.BEMHTML.apply(bemjson).must.be(html);
                });
        });
    });

    describe('naming', function () {
        it('must use origin naming', function () {
            var blocks = {
                'block.bemhtml.js': 'block("block").tag()("div")'
            };

            return build(blocks)
                .spread(function (res) {
                    var bemjson = { block: 'block', elem: 'elem', elemMods: { mod: true } },
                        html = '<div class="block__elem block__elem_mod"></div>';

                    res.BEMHTML.apply(bemjson).must.be(html);
                });
        });

        it('must support custom naming', function () {
            var blocks = {
                'block.bemhtml.js': 'block("block").tag()("div")'
            };

            return build(blocks, { naming: { elem: '__', mod: '--' } })
                .spread(function (res) {
                    var bemjson = { block: 'block', elem: 'elem', elemMods: { mod: true } },
                        html = '<div class="block__elem block__elem--mod"></div>';

                    res.BEMHTML.apply(bemjson).must.be(html);
                });
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
        it('must throw syntax error', function () {
            var templates = ['block("bla")tag()("a")'];

            return build(templates)
                .fail(function (error) {
                    error.message.must.be.include('Unexpected identifier');
                });
        });

        it('must throw predicate error', function () {
            var templates = ['block("bla").tag("a")'];

            return build(templates)
                .fail(function (error) {
                    error.message.must.be.include('Predicate should not have arguments');
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

    // hack for mock-fs
    scheme[bundlePath] = '';

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
