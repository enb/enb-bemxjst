var proxyquire = require('proxyquire'),
    asyncRequire = require('./async-require'),
    stub = {
        'enb-require-or-eval': asyncRequire,
        'enb-async-require': asyncRequire,
        'clear-require': function () {}
    };

module.exports = {
    bemhtml: proxyquire('../techs/bemhtml', stub),
    bemtree: proxyquire('../techs/bemtree', stub),
    bemjsonToHtml: proxyquire('../techs/bemjson-to-html', stub)
};
