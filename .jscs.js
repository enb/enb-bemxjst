var config = require('enb-validate-code/jscs');

config.excludeFiles = [
    'node_modules',
    'examples/*/.enb/tmp',
    'examples/*/page'
]

module.exports = config;
