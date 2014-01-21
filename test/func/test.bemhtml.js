var fs = require('fs');
var path = require('path');
var fixturesPath = path.join(__dirname, '..', 'fixtures', 'bemhtml');
var devBemhtmlPath = path.join(fixturesPath, 'page', 'page.dev.bemhtml.js');
var prodBemhtmlPath = path.join(fixturesPath, 'page', 'page.prod.bemhtml.js');
var view = require(path.join(fixturesPath, 'data', 'view.json'));
var html = fs.readFileSync(path.join(fixturesPath, 'result', 'page.html'), 'utf8');

require('must');

describe('functional', function () {
    describe('bemhtml', function () {
        it('must build simple page in dev mode', function () {
            var bemhtml = require(devBemhtmlPath).BEMHTML;

            bemhtml.apply(view).must.equal(html);
        });

        it('must build simple page in production mode', function () {
            var bemhtml = require(prodBemhtmlPath).BEMHTML;

            bemhtml.apply(view).must.equal(html);
        });

        it('must build different code by mode', function () {
            var devStat = fs.statSync(devBemhtmlPath);
            var prodStat = fs.statSync(prodBemhtmlPath);

            devStat.size.must.be.above(prodStat.size);
        });
    });
});
