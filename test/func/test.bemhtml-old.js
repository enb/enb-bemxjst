var fs = require('fs');

require('chai').should();

describe('functional', function() {
    describe('bemhtml-old', function() {
        it('build simple page', function() {
            var bemhtml = require('../fixtures/bemhtml-old/page/page.bemhtml').BEMHTML,
                bemjson = require('../fixtures/bemhtml-old/data/page.json'),
                html    = fs.readFileSync('./test/fixtures/bemhtml-old/result/page.html', 'utf8');

            bemhtml.apply(bemjson).should.equal(html);
        });
    });
});
