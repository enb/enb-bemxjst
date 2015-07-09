var mock = require('mock-require'),
    ometajsPath = require.resolve('bemhtml-compat/node_modules/ometajs'),
    bemhtmlPath  = require.resolve('bemhtml-compat/lib/ometa/bemhtml.ometajs');

mock(require.resolve(ometajsPath), require(ometajsPath));
mock(require.resolve(bemhtmlPath), require(bemhtmlPath));

require('./job-queue-stub');
