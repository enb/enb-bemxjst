var ENB_BEMXJST = '../../../';

module.exports = function (config) {
    config.node('page', function (nodeConfig) {
        nodeConfig.addTechs([
            [ require('enb/techs/levels'), { levels: getLevels(config) } ],
            [ require('enb/techs/file-provider'), { target: '?.bemdecl.js' } ],
            require('enb/techs/files'),
            require('enb/techs/deps'),
            [ require(ENB_BEMXJST + 'techs/bemhtml-old'), { devMode: true, target: '?.dev.bemhtml.js' } ],
            [ require(ENB_BEMXJST + 'techs/bemhtml-old'), { devMode: false, target: '?.prod.bemhtml.js' } ]
        ]);
        nodeConfig.addTargets([
            '?.dev.bemhtml.js', '?.prod.bemhtml.js'
        ]);
    });

};

function getLevels (config) {
    return [
        { path: '../bower_components/bem-core/common.blocks', check: false },
        'blocks'
    ].map(function (level) {
        return config.resolvePath(level);
    });
}
