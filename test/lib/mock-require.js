var Module = require('module');
var path = require('path');
var vow = require('vow');
var ometajs = require('bemhtml-compat/node_modules/ometajs');
var bemhtml = require('bemhtml-compat/lib/ometa/bemhtml.ometajs');
var originalLoader = Module._load;
var bemcompatId = path.join(__dirname, '..', '..', 'node_modules', 'bemhtml-compat', 'lib', 'compat.js');
var bemtreeId = path.join(__dirname, '..', '..', 'bundle', 'bundle.bemtree.js');
var safe = true;

Module._load = function (request, parent) {
    if (!safe) {
        if (parent.id === bemtreeId &&request === 'vow') {
            return vow;
        }

        if (parent.id === bemcompatId) {
            if (request === 'ometajs') {
                return ometajs;
            }

            if (request === './ometa/bemhtml') {
                return bemhtml;
            }
        }
    }

    return originalLoader.apply(this, arguments);
};

function start() {
    safe = false;
}

function restore() {
    safe = true;
}

exports.start = start;
exports.restore = restore;
