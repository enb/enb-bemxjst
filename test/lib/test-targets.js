var path = require('path');
var MakePlatform = require('enb/lib/make');
var Logger = require('enb/lib/logger');
var makePlatform = new MakePlatform();
var logger = new Logger();
var fixturesAbsolutePath = path.join(__dirname, '..', '..', 'examples');

logger.setEnabled(false);

function TestTargets(cdir, targets) {
    this._cdir = path.join(fixturesAbsolutePath, cdir);
    this._targets = targets;
}

TestTargets.prototype.build = function () {
    var targets = this._targets;

    return makePlatform.init(this._cdir)
        .then(function () {
            makePlatform.loadCache();
            makePlatform.setLogger(logger);
            makePlatform.buildTargets(targets);
        })
        .then(function () {
            makePlatform.saveCache();
            makePlatform.destruct();
        });
};

exports.TestTargets = TestTargets;
