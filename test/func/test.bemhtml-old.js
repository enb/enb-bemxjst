var fs = require('fs');

require('chai').should();

describe('functional', function() {
    describe('bemhtml-old', function() {
        it('should builds simple page in dev mode', function() {
            var bemhtml = require('../fixtures/bemhtml-old/page/page.dev.bemhtml').BEMHTML,
                view    = require('../fixtures/bemhtml-old/data/view.json'),
                html    = fs.readFileSync('./test/fixtures/bemhtml-old/result/page.html', 'utf8');

            bemhtml.apply(view).should.equal(html);
        });

        it('should builds simple page in production mode', function() {
            var bemhtml = require('../fixtures/bemhtml-old/page/page.prod.bemhtml').BEMHTML,
                view    = require('../fixtures/bemhtml-old/data/view.json'),
                html    = fs.readFileSync('./test/fixtures/bemhtml-old/result/page.html', 'utf8');

            bemhtml.apply(view).should.equal(html);
        });
    });
});
