var path = require('path'),
    vow = require('vow'),
    ometajs = require('bemhtml-compat/node_modules/ometajs'),
    bemhtml = require('bemhtml-compat/lib/ometa/bemhtml.ometajs'),
    bemcompatId = path.join(__dirname, '..', '..', 'node_modules', 'bemhtml-compat', 'lib', 'compat.js'),
    bemtreeId = path.join(__dirname, '..', '..', 'bundle', 'bundle.bemtree.js'),

    Module = require('module'),
    originalLoader = Module._load,

    safe = true;

Module._load = function (request, parent) {
    if (!safe) {
        if (parent.id === bemtreeId && request === 'vow') {
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
