var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    MockNode = require('mock-enb/lib/mock-node'),
    Tech = require('../../techs/bemtree'),
    loadDirSync = require('mock-enb/utils/dir-utils').loadDirSync,
    FileList = require('enb/lib/file-list'),
    bundlePath = path.resolve('lib/bundle.js');

describe('bemtree', function () {
    before(function () {
        var JobQueueStub = require('mock-enb/lib/job-queue-stub');

        // Использование mock-fs не позволяет подключить bemxjst-processor в рантайме
        // https://github.com/tschaub/mock-fs/issues/12
        // поэтому подключаем его перед инициализацией mock-fs
        JobQueueStub.prototype.processor = require('../../lib/bemtree-processor');
    });

    afterEach(function () {
        mock.restore();
    });

    it('must generate mock if there is no templates', function () {
        var templates = [];

        return build(templates)
            .spread(function (res) {
                var bemjson = { block: 'block' };

                res.BEMTREE.apply(bemjson).must.eql(bemjson);
            });
    });

    it('must keep base templates if there is no templates and forceBaseTemplates option is true', function () {
        var templates = [];

        return build(templates, { forceBaseTemplates: true })
            .spread(function (res) {
                var data = { block: 'block' },
                    BEMTREE = res.BEMTREE;

                /* eslint-disable */
                BEMTREE.compile(function () {
                    block('block').content()('yay');
                });
                /*eslint-enable */

                BEMTREE.apply(data).must.eql({ block: 'block', content: 'yay' });
            });
    });

    it('must use `bemtree.js` suffix', function () {
        var blocks = {
            'block.bemtree.js': 'block("block").content()("yay");',
            'block.bemtree': 'block("block").content()("why");'
        };

        return build(blocks)
            .spread(function (res) {
                var data = { block: 'block' },
                    bemjson = { block: 'block', content: 'yay' };

                res.BEMTREE.apply(data).must.eql(bemjson);
            });
    });

    describe('base templates', function () {
        it('must ignore templates in `i-bem`', function () {
            var blocks = {
                'i-bem.bemtree.js': 'block("block").content()("why")'
            };

            return build(blocks)
                .spread(function (res) {
                    var data = { block: 'block' };

                    res.BEMTREE.apply(data).must.eql(data);
                });
        });

        it('must ignore templates in `i-bemtree` file', function () {
            var blocks = {
                'i-bem.bemtree': 'block("block").content()("why")'
            };

            return build(blocks, { sourceSuffixes: ['bemtree.js', 'bemtree'] })
                .spread(function (res) {
                    var data = { block: 'block' };

                    res.BEMTREE.apply(data).must.eql(data);
                });
        });
    });

    describe('compat', function () {
        it('must throw error if old syntax', function () {
            var templates = ['block bla, content: "yey"'];

            return build(templates)
                .fail(function (err) {
                    err.must.a(Error);
                });
        });

        it('must not support old syntax for files with `.js` extension', function () {
            var blocks = {
                    'block.bemhtml.js': 'block bla, content: "yey"'
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
            var templates = ['block("bla")content()("yey")'];

            return build(templates)
                .fail(function (error) {
                    error.message.must.be.include('Unexpected identifier');
                });
        });

        it('must throw predicate error', function () {
            var templates = ['block("bla").content("yey")'];

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
                scheme.blocks['block-' + i + '.bemtree.js'] = item;
            });
        }
    } else {
        scheme.blocks = templates;
    }

    if (templates.length) {
        templates.forEach(function (item, i) {
            scheme.blocks['block-' + i + '.bemtree.js'] = item;
        });
    }

    mock(scheme);

    bundle = new MockNode('bundle');
    fileList = new FileList();
    fileList.addFiles(loadDirSync('blocks'));
    bundle.provideTechData('?.files', fileList);

    return bundle.runTechAndRequire(Tech, options)
        .spread(function (res) {
            var filename = bundle.resolvePath(bundle.unmaskTargetName(options.target || '?.bemtree.js')),
                str = fs.readFileSync(filename, 'utf-8');

            return [res, str];
        });
}
