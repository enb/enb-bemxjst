var path = require('path');
var fs = require('fs');
var EOL = require('os').EOL;
var babel = require('babel-core');
var babelOptions = {
    presets: ['es2015'],
    compact: false
};

// Tech extends BEMHTML tech adding es2015 transpiling (using babel)
module.exports = require('./bemhtml').buildFlow()
    .name('bemhtml-es2015')
    .methods({
        _processSources: function (sources) {
            return sources.map(function (source) {
                var filename = source.path,
                    contents = source.contents,
                    processedCode = '';

                // Partial copy of https://github.com/DimitryDushkin/enb-es2015/blob/master/techs/es2015.js
                if (
                    filename.indexOf('/libs/') > -1
                    // symbolic links leads to libs, so do not compile them
                    || fs.lstatSync(filename).isSymbolicLink()
                ) {
                    processedCode = contents;
                } else {
                    processedCode = babel.transform(contents, babelOptions).code;
                }

                return {
                    path: filename,
                    contents: [
                        '/* begin: ' + filename + ' */',
                        processedCode,
                        '/* end: ' + filename + ' */'
                    ].join(EOL)
                };
            }, this);
        },
    })
    .createTech();
