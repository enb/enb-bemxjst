var path = require('path');
var fs = require('fs');
var TestTargets = require('../lib/test-targets').TestTargets;
var targets = new TestTargets('bemhtml', [
    'page/page.dev.bemhtml.js',
    'page/page.prod.bemhtml.js'
]);
var devBemhtmlPath = path.resolve(__dirname, '../../examples/bemhtml/page/page.dev.bemhtml.js');
var prodBemhtmlPath = path.resolve(__dirname, '../../examples/bemhtml/page/page.prod.bemhtml.js');
var view = require('../../examples/bemhtml/data/view.json');
var html = fs.readFileSync('./examples/bemhtml/result/page.html', 'utf8');

describe('bemhtml', function () {
    beforeEach(function (done) {
        return targets.build()
            .then(function () {
                done();
            });
    });

    describe('page', function () {
        it('must build simple page in dev mode', function () {
            var BEMHTML = require(devBemhtmlPath).BEMHTML;

            BEMHTML.apply(view).must.equal(html);
        });

        it('must build simple page in production mode', function () {
            var BEMHTML = require(prodBemhtmlPath).BEMHTML;

            BEMHTML.apply(view).must.equal(html);
        });

        it('must build different code by mode', function () {
            var devStat = fs.statSync(devBemhtmlPath);
            var prodStat = fs.statSync(prodBemhtmlPath);

            devStat.size.must.be.above(prodStat.size);
        });
    });
});
