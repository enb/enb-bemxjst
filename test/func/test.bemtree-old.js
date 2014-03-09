var path = require('path');
var fs = require('fs');
var TestTargets = require('../lib/test-targets').TestTargets;
var targets = new TestTargets('bemtree-old', [
    'page/page.dev.bemtree.js',
    'page/page.prod.bemtree.js'
]);
var devBemtreePath = path.resolve(__dirname, '../../examples/bemtree-old/page/page.dev.bemtree.js');
var prodBemtreePath = path.resolve(__dirname, '../../examples/bemtree-old/page/page.prod.bemtree.js');
var data = require('../../examples/bemtree-old/data/data.json');
var view = require('../../examples/bemtree-old/result/view.json');

describe('bemtree-old', function () {
    beforeEach(function (done) {
        return targets.build()
            .then(function () {
                done();
            });
    });

    describe('page', function () {
        it('must build simple view of page in dev mode', function (done) {
            var BEMTREE = require(devBemtreePath).BEMTREE;

            BEMTREE.apply(data).then(function (res) {
                res.must.eql(view);
                done();
            });
        });

        it('must build simple view of page in production mode', function (done) {
            var BEMTREE = require(prodBemtreePath).BEMTREE;

            BEMTREE.apply(data).then(function (res) {
                res.must.eql(view);
                done();
            });
        });

        it('must build different code by mode', function () {
            var devStat = fs.statSync(devBemtreePath);
            var prodStat = fs.statSync(prodBemtreePath);

            devStat.size.must.be.above(prodStat.size);
        });
    });
});
