var path = require('path'),
    vow = require('vow'),
    ometajs = require('bemhtml-compat/node_modules/ometajs'),
    bemhtml = require('bemhtml-compat/lib/ometa/bemhtml.ometajs'),
    sibling = require('./mock-sibling'),

    root = path.join(__dirname, '..', '..'),
    bemcompatId = path.join(root, 'node_modules', 'bemhtml-compat', 'lib', 'compat.js'),
    bemtreeId = path.join(root, 'bundle', 'bundle.bemtree.js'),
    bemxjstId = path.join(root, 'techs', 'bem-xjst.js'),

    Module = require('module'),
    originalLoader = Module._load,

    safe = true;

Module._load = function (request, parent) {
    if (parent.id === bemxjstId && request === 'sibling') {
        return sibling;
    }

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
