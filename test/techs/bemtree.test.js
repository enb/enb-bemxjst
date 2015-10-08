var fs = require('fs'),
    path = require('path'),
    vow = require('vow'),
    mock = require('mock-fs'),
    clearRequire = require('clear-require'),
    MockNode = require('mock-enb/lib/mock-node'),
    Tech = require('../../techs/bemtree'),
    FileList = require('enb/lib/file-list'),
    fixturesDirname = path.join(__dirname, '..', 'fixtures', 'bemtree'),
    vowCode = require('../../lib/vow-code'),
    files = {
        'i-bem.bemtree.js': {
            path: path.join(fixturesDirname, 'i-bem.bemtree.js')
        },
        'i-start.bemtree.js': {
            path: path.join(fixturesDirname, 'i-start.bemtree.js')
        },
        'data.bemtree.js': {
            path: path.join(fixturesDirname, 'data.bemtree.js')
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
    },
    EOL = require('os').EOL;

Object.keys(files).forEach(function (name) {
    var file = files[name];

    file.contents = fs.readFileSync(file.path, 'utf-8');
});

describe('bemtree', function () {
    var templates = [
            files['i-start.bemtree.js'].contents,
            files['data.bemtree.js'].contents
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

    it('must generate mock if there is no templates', function () {
        return build([])
            .spread(function (res) {
                return res.BEMTREE.apply(data)
                    .then(function (res) {
                        res.must.eql({});
                    });
            });
    });

    describe('vow', function () {
        it('must compile BEMTREE file without `vow` if includeVow:false', function () {
            return build(templates, { includeVow: false })
                .spread(function (res) {
                    return res.BEMTREE.apply(data);
                })
                .fail(function (error) {
                    error.message.must.be.equal('Vow is not defined');
                });
        });

        it('must provide `vow` to templates if requires `vow`', function () {
            return build(templates, {
                    includeVow: false,
                    requires: {
                        vow: { globals: 'vow' }
                    }
                }, vowCode + 'this.vow = Vow;')
                .spread(function (res) {
                    return res.BEMTREE.apply(data)
                        .then(function (res) {
                            res.must.eql(expect);
                        });
                });
        });

        it('must provide `vow` to templates if requires `Vow`', function () {
            return build(templates, {
                    includeVow: false,
                    requires: {
                        Vow: { globals: 'vow' }
                    }
                }, vowCode + 'this.vow = Vow;')
                .spread(function (res) {
                    return res.BEMTREE.apply(data)
                        .then(function (res) {
                            res.must.eql(expect);
                        });
                });
        });
    });

    describe('suffixes', function () {
        var jsTemplate = [
                'block("b-data").match(this.data && this.data.title)(',
                '    content()(function () {',
                '        return "bemtree.js";',
                '    })',
                ')'
            ].join(EOL),
            template = [
                'block("b-data").match(this.data && this.data.title)(',
                '    content()(function () {',
                '        return "bemtree";',
                '    })',
                ')'
            ].join(EOL);

        it('must use `bemtree.js` suffix', function () {
            var blocks = {
                'base.bemtree.js': files['i-bem.bemtree.js'].contents,
                'i-start.bemtree.js': files['i-start.bemtree.js'].contents,
                'data.bemtree.js': jsTemplate,
                'data.bemtree': template
            },
            expect = {
                block: 'b-data',
                mods: {},
                content: 'bemtree.js'
            };

            return build(blocks)
                .spread(function (res) {
                    return res.BEMTREE.apply(data)
                        .then(function (res) {
                            res.must.eql(expect);
                        });
                });
        });

        it('must use `bemtree` suffix if not `bemtree.js`', function () {
            var blocks = {
                    'base.bemtree.js': files['i-bem.bemtree.js'].contents,
                    'i-start.bemtree.js': files['i-start.bemtree.js'].contents,
                    'data.bemtree': template
                },
                expect = {
                    block: 'b-data',
                    mods: {},
                    content: 'bemtree'
                };

            return build(blocks)
                .spread(function (res) {
                    return res.BEMTREE.apply(data)
                        .then(function (res) {
                            res.must.eql(expect);
                        });
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
            var blocks = {
                'i-bem.bemtree.js': files['i-bem.bemtree.js'].contents,
                'i-start.bemtree.js': files['i-start.bemtree.js'].contents,
                'b-data.bemtree': files['b-data.bemtree'].contents
            };

            return build(blocks, { compat: true })
                .spread(function (res) {
                    return res.BEMTREE.apply(data)
                        .then(function (res) {
                            res.must.eql(expect);
                        });
                });
        });

        it('must not support old syntax for files with `.js` extension', function () {
            var blocks = {
                    'i-bem.bemtree.js': files['i-bem.bemtree.js'].contents,
                    'i-start.bemtree.js': files['i-start.bemtree.js'].contents,
                    'b-data.bemtree.js': files['b-data.bemtree'].contents
                },
                options = { compat: true };

            return build(blocks, options)
                .fail(function (err) {
                    err.must.a(Error);
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

    it('should throw valid error if base template is missed (for production mode)', function () {
        var blocks = {
                'i-start.bemtree.js': files['i-start.bemtree.js'].contents,
                'data.bemtree.js': [
                    'block("b-data").match(this.data && this.data.title)(',
                    '    content()(function () {',
                    '        return "bemtree";',
                    '    })',
                    ')'
                ].join(EOL)
            };

        return build(blocks, { devMode: false })
            .spread(function (res) {
                return res.BEMTREE.apply(data);
            })
            .fail(function (error) {
                error.message.must.be.equal('Seems like you have no base templates from i-bem.bemtree');
            });
    });

    it('should throw valid error if base template is missed (for development mode)', function () {
        var blocks = {
            'i-start.bemtree.js': files['i-start.bemtree.js'].contents,
            'data.bemtree.js': [
                'block("b-data").match(this.data && this.data.title)(',
                '    content()(function () {',
                '        return "bemtree";',
                '    })',
                ')'
            ].join(EOL)
        };

        return build(blocks, { devMode: true })
            .spread(function (res) {
                return res.BEMTREE.apply(data);
            })
            .fail(function (error) {
                error.message.must.be.equal('Seems like you have no base templates from i-bem.bemtree');
            });
    });
});

function build(templates, options, lib) {
    templates || (templates = []);
    options || (options = {});

    var scheme = {
            blocks: {},
            bundle: {}
        },
        bundle, fileList;

    if (Array.isArray(templates)) {
        if (templates.length) {
            scheme.blocks['base.bemtree.js'] = files['i-bem.bemtree.js'].contents;

            templates.forEach(function (item, i) {
                scheme.blocks['block-' + i + '.bemtree.js'] = item;
            });
        }
    } else {
        scheme.blocks = templates;
    }

    scheme[files['ometajs'].path] = files['ometajs'].contents;
    scheme[files['bemhtml.ometajs'].path] = files['bemhtml.ometajs'].contents;

    mock(scheme);

    bundle = new MockNode('bundle');
    fileList = new FileList();
    fileList.loadFromDirSync('blocks');
    bundle.provideTechData('?.files', fileList);

    return bundle.runTech(Tech, options)
        .then(function () {
            var filename = bundle.resolvePath(bundle.unmaskTargetName(options.target || '?.bemtree.js')),
                contents = [
                    lib,
                    fs.readFileSync(filename, 'utf-8')
                ].join(EOL);

            fs.writeFileSync(filename, contents);
            clearRequire(filename);
            return [require(filename), contents];
        });
}
