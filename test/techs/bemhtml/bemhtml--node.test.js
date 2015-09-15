var EOL = require('os').EOL,
    fs = require('fs'),
    mock = require('mock-fs'),
    clearRequire = require('clear-require'),
    MockNode = require('mock-enb/lib/mock-node'),
    Tech = require('../../../techs/bemhtml'),
    loadDirSync = require('mock-enb/utils/dir-utils').loadDirSync,
    FileList = require('enb/lib/file-list');

describe('bemhtml --node', function () {
    afterEach(function () {
        mock.restore();
    });

    it('must compile BEMHTML file', function () {
        var templates = ['block("bla").tag()("a")'],
            bemjson = { block: 'bla' },
            html = '<a class="bla"></a>';

        return build(templates)
            .then(function (res) {
                res.BEMHTML.apply(bemjson).must.be(html);
            });
    });

    it('must build block with custom exportName', function () {
        var templates = ['block("bla").tag()("a")'],
            bemjson = { block: 'bla' },
            html = '<a class="bla"></a>',
            options = { exportName: 'BH' };

        return build(templates, options)
            .then(function (res) {
                res.BH.apply(bemjson).must.be(html);
            });
    });

    describe('requires', function () {
        it('must get dependency from global scope', function () {
            var templates = [
                    'block("block").content()(function(){ return this.require("text").text; })'
                ],
                bemjson = { block: 'block' },
                html = '<div class="block">Hello world!</div>',
                options = {
                    requires: {
                        text: {
                            globals: 'text'
                        }
                    }
                },
                lib = 'this.text = { text: "Hello world!" };';

            return build(templates, options, lib)
                .then(function (res) {
                    res.BEMHTML.apply(bemjson).must.equal(html);
                });
        });

        it('must get dependency from global scope using dot-delimited key', function () {
            var templates = [
                    'block("block").content()(function(){ return this.require("text"); })'
                ],
                bemjson = { block: 'block' },
                html = '<div class="block">Hello world!</div>',
                options = {
                    requires: {
                        text: {
                            globals: 'text.text'
                        }
                    }
                },
                lib = 'this.text = { text: "Hello world!" };';

            return build(templates, options, lib)
                .then(function (res) {
                    res.BEMHTML.apply(bemjson).must.equal(html);
                });
        });

        it('must require module from CommonJS', function () {
            var templates = [
                    [
                        'block("block")(',
                        '    content()(function() {',
                        '       var fake = this.require("fake");',
                        '       return fake.getText();',
                        '    })',
                        ')'
                    ].join(EOL)
                ],
                bemjson = { block: 'block' },
                html = '<div class="block">^_^</div>',
                options = {
                    requires: {
                        fake: {
                            commonJS: 'fake'
                        }
                    }
                };

            return build(templates, options)
                .then(function (res) {
                    res.BEMHTML.apply(bemjson).must.equal(html);
                });
        });
    });
});

function build(templates, options, lib) {
    options || (options = {});
    lib || (lib = '');

    var scheme = {
            blocks: {},
            bundle: {},
            // jscs:disable
            node_modules: {
                fake: {
                    'index.js': 'module.exports = { getText: function () { return "^_^"; } };'
                }
            }
            // jscs:enable
        },
        bundle, fileList;

    templates && templates.forEach(function (item, i) {
        scheme.blocks['block-' + i + '.bemhtml.js'] = item;
    });

    mock(scheme);

    bundle = new MockNode('bundle');
    fileList = new FileList();
    fileList.addFiles(loadDirSync('blocks'));
    bundle.provideTechData('?.files', fileList);

    return bundle.runTech(Tech, options)
        .spread(function () {
            var filename = bundle.resolvePath(bundle.unmaskTargetName(options.target || '?.bemhtml.js')),
                contents = [
                    lib,
                    fs.readFileSync(filename, 'utf-8')
                ].join(EOL);

            fs.writeFileSync(filename, contents);
            clearRequire(filename);
            return require(filename);
        });
}
