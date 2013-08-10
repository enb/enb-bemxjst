var fs = require('fs');

require('chai').should();

describe('functional', function() {
    describe('bemhtml', function() {
        it('should builds simple page', function() {
            var bemhtml = require('../fixtures/bemhtml/page/page.bemhtml').BEMHTML,
                view    = require('../fixtures/bemhtml/data/view.json'),
                html    = fs.readFileSync('./test/fixtures/bemhtml/result/page.html', 'utf8');

            bemhtml.apply(view).should.equal(html);
        });
    });
});
