var fs = require('fs'),
    path = require('path'),
    assert = require('assert'),
    vm = require('vm'),
    vow = require('vow'),
    mock = require('mock-fs'),
    TestNode = require('enb/lib/test/mocks/test-node'),
    Tech = require('../../techs/bemtree'),
    FileList = require('enb/lib/file-list'),
    fixturesDirname = path.join(__dirname, '..', 'fixtures', 'bemtree'),
    files = {
        'i-bem.bemtree': {
            path: path.join(fixturesDirname, 'i-bem.bemtree')
        },
        'i-start.bemtree': {
            path: path.join(fixturesDirname, 'i-start.bemtree')
        },
        'data.bemtree': {
            path: path.join(fixturesDirname, 'data.bemtree')
        },
        'b-data.bemtree': {
            path: path.join(fixturesDirname, 'b-data.bemtree')
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

describe('bemtree', function () {
    var templates = [
            files['i-start.bemtree'].contents,
            files['data.bemtree'].contents
        ],
        data = {
            bundleName: 'page',
            title: 'Some text'
        },
        expect = {
            block: 'b-data',
            mods: {},
            content: 'Some text'
        };

    afterEach(function () {
        mock.restore();
    });

    it('must compile BEMTREE file', function () {
        return build(templates)
            .spread(function (res) {
                return res.BEMTREE.apply(data)
                    .then(function (res) {
                        res.must.eql(expect);
                    });
            });
    });

    it('must compile BEMTREE file without `vow` if includeVow:false', function () {
        return build(templates, { includeVow: false })
            .spread(function (res, src) {
                var sandbox = {
                    Vow: vow
                };

                vm.runInNewContext(src, sandbox);

                return sandbox.BEMTREE.apply(data)
                    .then(function (res) {
                        assert.deepEqual(res, expect);
                    });
            });
    });

    describe('compat', function () {
        it('must throw error if old syntax', function () {
            return build(templates)
                .fail(function (err) {
                    err.must.a(Error);
                });
        });

        it('must support old syntax if compat:true', function () {
            var templates = [
                files['i-start.bemtree'].contents,
                files['b-data.bemtree'].contents
            ];

            return build(templates, { compat: true })
                .spread(function (res) {
                    return res.BEMTREE.apply(data)
                        .then(function (res) {
                            res.must.eql(expect);
                        });
                });
        });
    });

    it('must build block with custom exportName', function () {
        return build(templates, { exportName: 'BEMBUSH' })
            .spread(function (res) {
                return res.BEMBUSH.apply(data)
                    .then(function (res) {
                        res.must.eql(expect);
                    });
            });
    });

    describe('mode', function () {
        it('must build block in development mode', function () {
            return build(templates, { devMode: true })
                .spread(function (res) {
                    return res.BEMTREE.apply(data)
                        .then(function (res) {
                            res.must.eql(expect);
                        });
                });
        });

        it('must build block in production mode', function () {
            return build(templates, { devMode: false })
                .spread(function (res) {
                    return res.BEMTREE.apply(data)
                        .then(function (res) {
                            res.must.eql(expect);
                        });
                });
        });

        it('must build different code by mode', function () {
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
});

function build(templates, options) {
    options || (options = {});

    var scheme = {
            // Файлы должны собираться в нужной последовательности
            blocks: {
                '00-i-bem.bemtree': files['i-bem.bemtree'].contents
            },
            bundle: {}
        },
        bundle, fileList;

    templates && templates.forEach(function (item, i) {
        scheme.blocks['block-' + i + '.bemtree'] = item;
    });

    scheme[files['ometajs'].path] = files['ometajs'].contents;
    scheme[files['bemhtml.ometajs'].path] = files['bemhtml.ometajs'].contents;

    mock(scheme);

    bundle = new TestNode('bundle');
    fileList = new FileList();
    fileList.loadFromDirSync('blocks');
    bundle.provideTechData('?.files', fileList);

    return bundle.runTechAndRequire(Tech, options)
        .spread(function (res) {
            var filename = bundle.resolvePath(bundle.unmaskTargetName(options.target || '?.bemtree.js')),
                str = fs.readFileSync(filename, 'utf-8');

            return [res, str];
        });
}
