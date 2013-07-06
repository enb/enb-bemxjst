var fs = require('fs');

require('chai').should();

describe('functional', function() {
    describe('bemhtml', function() {
        it('build simple page', function() {
            var bemhtml = require('../fixtures/bemhtml/page/page.bemhtml').BEMHTML,
                bemjson = require('../fixtures/bemhtml/data/page.json'),
                html    = fs.readFileSync('./test/fixtures/bemhtml/result/page.html', 'utf8');

            bemhtml.apply(bemjson).should.equal(html);
        });
    });
});
