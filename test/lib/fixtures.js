var path = require('path'),
    fs = require('fs'),
    fixturesDirname = path.join(__dirname, '..', 'fixtures'),
    blocksDirname = path.join(fixturesDirname, 'blocks'),
    referencesDirname = path.join(fixturesDirname, 'references');

function loadBlocks(names) {
    var blocks = {};

    names.forEach(function (name) {
        blocks[name] = fs.readFileSync(path.join(blocksDirname, name), { encoding: 'utf-8' });
    });

    return blocks;
}

function loadReferences(names) {
    var blocks = {};

    names.forEach(function (name) {
        var filename = path.join(referencesDirname, name),
            ext = path.extname(name);

        if (ext === '.json') {
            blocks[name] = require(filename);
        } else if (ext === '.html') {
            blocks[name] = fs.readFileSync(filename, { encoding: 'utf-8' }).replace('\n', '');
        }
    });

    return blocks;
}

exports.blocks = loadBlocks;
exports.references = loadReferences;
