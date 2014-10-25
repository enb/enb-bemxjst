var path = require('path'),
    fs = require('fs'),
    fixturesDirname = path.join(__dirname, '..', 'fixtures'),
    blocksDirname = path.join(fixturesDirname, 'blocks'),
    bundlesDirname = path.join(fixturesDirname, 'bundles'),
    referencesDirname = path.join(fixturesDirname, 'references');

function loadBlocks(names) {
    var blocks = {};

    names.forEach(function (name) {
        blocks[name] = fs.readFileSync(path.join(blocksDirname, name), { encoding: 'utf-8' });
    });

    return blocks;
}

function loadBundles(names) {
    var bundles = {};

    names.forEach(function (name) {
        bundles[name] = fs.readFileSync(path.join(bundlesDirname, name), { encoding: 'utf-8' });
    });

    return bundles;
}

function loadReferences(names) {
    var references = {};

    names.forEach(function (name) {
        var filename = path.join(referencesDirname, name),
            ext = path.extname(name);

        if (ext === '.json') {
            references[name] = require(filename);
        } else if (ext === '.html') {
            references[name] = fs.readFileSync(filename, { encoding: 'utf-8' }).replace('\n', '');
        }
    });

    return references;
}

exports.blocks = loadBlocks;
exports.bundles = loadBundles;
exports.references = loadReferences;
