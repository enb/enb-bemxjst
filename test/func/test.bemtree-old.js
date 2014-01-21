var fs = require('fs');
var path = require('path');
var fixturesPath = path.join(__dirname, '..', 'fixtures', 'bemtree-old');
var devBemtreePath = path.join(fixturesPath, 'page', 'page.dev.bemtree.js');
var prodBemtreePath = path.join(fixturesPath, 'page', 'page.prod.bemtree.js');
var data = require(path.join(fixturesPath, 'data', 'data.json'));
var view = require(path.join(fixturesPath, 'result', 'view.json'));

describe('functional', function () {
    describe('bemtree-old', function () {
        it('must build simple view of page in dev mode', function (done) {
            var bemtree = require(devBemtreePath).BEMTREE;

            bemtree.apply(data).then(function (res) {
                res.must.eql(view);
                done();
            });
        });

        it('must build simple view of page in production mode', function (done) {
            var bemtree = require(prodBemtreePath).BEMTREE;

            bemtree.apply(data).then(function (res) {
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
