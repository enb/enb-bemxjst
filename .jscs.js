var config = require('enb-validate-code/jscs');

config.excludeFiles = [
    'node_modules',
    'examples/libs',
    'examples/*/.enb/tmp',
    'examples/*/page'
];

module.exports = config;
