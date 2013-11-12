require('chai').should();

describe('functional', function() {
    describe('bemtree', function() {
        it('should builds simple view of page in dev mode', function() {
            var bemtree = require('../fixtures/bemtree/page/page.dev.bemtree').BEMTREE,
                data    = require('../fixtures/bemtree/data/data.json'),
                view    = require('../fixtures/bemtree/result/view.json');

            bemtree.apply(data).then(function(res) {
                JSON.stringify(res).should.equal(JSON.stringify(view));
            }).done();
        });

        it('should builds simple view of page in production mode', function() {
            var bemtree = require('../fixtures/bemtree/page/page.prod.bemtree').BEMTREE,
                data    = require('../fixtures/bemtree/data/data.json'),
                view    = require('../fixtures/bemtree/result/view.json');

            bemtree.apply(data).then(function(res) {
                JSON.stringify(res).should.equal(JSON.stringify(view));
            }).done();
        });
    });
});
