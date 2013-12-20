var fs = require('fs'),
    path = require('path'),
    fixturesPath = path.join(__dirname, '..', 'fixtures', 'bemhtml-old'),
    devBemhtmlPath = path.join(fixturesPath, 'page', 'page.dev.bemhtml.js'),
    prodBemhtmlPath = path.join(fixturesPath, 'page', 'page.prod.bemhtml.js'),
    view = require(path.join(fixturesPath, 'data', 'view.json')),
    html = fs.readFileSync(path.join(fixturesPath, 'result', 'page.html'), 'utf8');

require('chai').should();

describe('functional', function() {
    describe('bemhtml-old', function() {
        it('should build simple page in dev mode', function() {
            var bemhtml = require(devBemhtmlPath).BEMHTML;

            bemhtml.apply(view).should.equal(html);
        });

        it('should build simple page in production mode', function() {
            var bemhtml = require(prodBemhtmlPath).BEMHTML;

            bemhtml.apply(view).should.equal(html);
        });

        it('should build different code by mode', function() {
            var devStat = fs.statSync(devBemhtmlPath),
                prodStat = fs.statSync(prodBemhtmlPath);

            devStat.size.should.be.above(prodStat.size);
        });
    });
});
