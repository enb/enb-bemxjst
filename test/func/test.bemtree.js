var fs = require('fs'),
    path = require('path'),
    fixturesPath = path.join(__dirname, '..', 'fixtures', 'bemtree'),
    devBemtreePath = path.join(fixturesPath, 'page', 'page.dev.bemtree.js'),
    prodBemtreePath = path.join(fixturesPath, 'page', 'page.prod.bemtree.js'),
    data = require(path.join(fixturesPath, 'data', 'data.json')),
    view = require(path.join(fixturesPath, 'result', 'view.json'));

require('must');

describe('functional', function() {
    describe('bemtree', function() {
        it('must build simple view of page in dev mode', function(done) {
            var bemtree = require(devBemtreePath).BEMTREE;

            bemtree.apply(data).then(function(res) {
                res.must.eql(view);
                done();
            });
        });

        it('must build simple view of page in production mode', function(done) {
            var bemtree = require(prodBemtreePath).BEMTREE;

            bemtree.apply(data).then(function(res) {
                res.must.eql(view);
                done();
            });
        });

        it('must build different code by mode', function() {
            var devStat = fs.statSync(devBemtreePath),
                prodStat = fs.statSync(prodBemtreePath);

            devStat.size.must.be.above(prodStat.size);
        });
    });
});
