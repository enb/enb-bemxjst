var fs = require('fs'),
    vow = require('vow'),
    safeEval = require('node-eval');

module.exports = function (filename) {
    var sources = fs.readFileSync(filename, 'utf-8');

    return vow.resolve(safeEval(sources));
};
