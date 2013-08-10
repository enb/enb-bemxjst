var fs = require('fs');

require('chai').should();

describe('functional', function() {
    describe('bemhtml-old', function() {
        it('should builds simple page', function() {
            var bemhtml = require('../fixtures/bemhtml-old/page/page.bemhtml').BEMHTML,
                view    = require('../fixtures/bemhtml-old/data/view.json'),
                html    = fs.readFileSync('./test/fixtures/bemhtml-old/result/page.html', 'utf8');

            bemhtml.apply(view).should.equal(html);
        });
    });
});
