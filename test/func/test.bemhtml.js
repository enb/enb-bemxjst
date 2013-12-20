var fs = require('fs');

require('chai').should();

describe('functional', function() {
    describe('bemhtml', function() {
        it('should builds simple page in dev mode', function() {
            var bemhtml = require('../fixtures/bemhtml/page/page.dev.bemhtml').BEMHTML,
                view    = require('../fixtures/bemhtml/data/view.json'),
                html    = fs.readFileSync('./test/fixtures/bemhtml/result/page.html', 'utf8');

            bemhtml.apply(view).should.equal(html);
        });

        it('should builds simple page in production mode', function() {
            var bemhtml = require('../fixtures/bemhtml/page/page.prod.bemhtml').BEMHTML,
                view    = require('../fixtures/bemhtml/data/view.json'),
                html    = fs.readFileSync('./test/fixtures/bemhtml/result/page.html', 'utf8');

            bemhtml.apply(view).should.equal(html);
        });

        it('should build different code by mode', function() {
            var devStat = fs.statSync('./test/fixtures/bemhtml/page/page.dev.bemhtml.js'),
                prodStat = fs.statSync('./test/fixtures/bemhtml/page/page.prod.bemhtml.js');

            devStat.size.should.be.above(prodStat.size);
        });
    });
});
