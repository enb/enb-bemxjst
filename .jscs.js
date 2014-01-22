var config = require('enb-validate-code/jscs');

config.excludeFiles = [
    'node_modules',
    'test/fixtures/*/.enb/tmp',
    'test/fixtures/*/page'
]

module.exports = config;
