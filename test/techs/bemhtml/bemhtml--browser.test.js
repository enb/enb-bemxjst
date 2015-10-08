var fs = require('fs'),
    path = require('path'),
    mock = require('mock-fs'),
    MockNode = require('mock-enb/lib/mock-node'),
    FileList = require('enb/lib/file-list'),
    loadDirSync = require('mock-enb/utils/dir-utils').loadDirSync,
    Tech = require('../../../techs/bemhtml'),
    bemhtmlCoreFilename = path.join(__dirname, '..', '..', 'fixtures', 'i-bem.bemhtml'),
    htmlFilename = path.join(__dirname, '..', '..', 'fixtures', 'bemhtml', 'browser.html'),
    mochaFilename = require.resolve('mocha/mocha.js'),
    chaiFilename = require.resolve('chai/chai.js'),
    runServer = require('../../lib/run-server'),
    EOL = require('os').EOL;

describe('bemhtml --browser', function () {
    afterEach(function () {
        mock.restore();
    });

    it('compiled files should works on client-side', function () {
        var test = generateTest({ block: 'bla' }, '<a class="bla"></a>');

        return runTest(test);
    });

    it('must build block with custom exportName', function () {
        var test = generateTest({ block: 'bla' }, '<a class="bla"></a>', 'BH'),
            options = { exportName: 'BH' };

        return runTest(test, options);
    });

    it('must get dependency from global scope', function () {
        var test = generateTest({ block: 'block' }, '<div class="block">^_^</div>'),
            options = {
                requires: {
                    depend: {
                        globals: 'depend'
                    }
                }
            },
            template = 'block("block").content()(function(){ return this.require("depend"); });',
            lib = 'var depend = "^_^";';

        return runTest(test, options, template, lib);
    });

    it('must get dependency from global scope using dot-delimited key', function () {
        var test = generateTest({ block: 'block' }, '<div class="block">^_^</div>'),
            options = {
                requires: {
                    depend: {
                        globals: 'depend.key'
                    }
                }
            },
            template = 'block("block").content()(function(){ return this.require("depend"); });',
            lib = 'var depend = {key: "^_^"};';

        return runTest(test, options, template, lib);
    });

    it('must require module from CommonJS', function () {
        var test = generateTest({ block: 'block' }, '<div class="block">^_^</div>'),
            options = {
                requires: {
                    fake: {
                        commonJS: 'fake'
                    }
                }
            },
            template = [
                'block("block")(',
                '    content()(function() {',
                '       var fake = this.require("fake");',
                '       return fake.getText();',
                '    })',
                ')'
            ].join(EOL);

        return runTest(test, options, template);
    });

    it('must get dependency from global scope if it also is presented in CommonJS', function () {
        var test = generateTest({ block: 'block' }, '<div class="block">globals</div>'),
            options = {
                requires: {
                    depend: {
                        globals: 'depend',
                        commonJS: 'depend'
                    }
                }
            },
            template = [
                'block("block")(',
                '    content()(function() {',
                '       return this.require("depend");',
                '    })',
                ')'
            ].join(EOL),
            lib = 'var depend = "globals";';

        return runTest(test, options, template, lib);
    });
});

function runTest(testContent, options, template, lib) {
    var bundle,
        fileList,

        scheme = {
            blocks: {
                'base.bemhtml': fs.readFileSync(bemhtmlCoreFilename, 'utf-8'),
                'bla.bemhtml': template || 'block("bla").tag()("a")'
            },
            bundle: {},
            // jscs:disable
            node_modules: {
                fake: {
                    'index.js': 'module.exports = { getText: function () { return "^_^"; } };'
                },
                depend: {
                    'index.js': 'module.exports = "CommonJS";'
                }
            },
            // jscs:enable
            'index.html': fs.readFileSync(htmlFilename, 'utf-8'),
            'test.js': testContent,
            'mocha.js': fs.readFileSync(mochaFilename, 'utf-8'),
            'chai.js': fs.readFileSync(chaiFilename, 'utf-8'),
            'some-lib.js': lib || ''
        };

    mock(scheme);

    bundle = new MockNode('bundle');
    fileList = new FileList();
    fileList.addFiles(loadDirSync('blocks'));
    bundle.provideTechData('?.files', fileList);

    return bundle.runTech(Tech, options)
        .then(function () {
            return runServer(3000);
        });
}

function generateTest(json, expected, exportName) {
    expected = expected.replace(/'/g, '\\\'');
    exportName = exportName || 'BEMHTML';

    return [
        'chai.should();',
        'it("autogenerated test", function () {',
            exportName + '.apply(' + JSON.stringify(json) + ').should.equal(\'' + expected + '\');',
        '})'
    ].join('\n');
}
