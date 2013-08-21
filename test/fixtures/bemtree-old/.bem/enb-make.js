var ENB_BEMXJST = '../../../../';

module.exports = function(config) {
    config.node('page', function(nodeConfig) {
        nodeConfig.addTechs([
            [ require('enb/techs/levels'), { levels: getLevels(config) } ],
            [ require('enb/techs/file-provider'), { target: '?.bemdecl.js' } ],
            require('enb/techs/files'),
            require('enb/techs/deps-old'),
            [ require(ENB_BEMXJST + 'techs/bemtree-old'), { devMode: true } ]
        ]);
        nodeConfig.addTargets([
            '?.bemtree.js'
        ]);
    });

};

function getLevels(config) {
    return [
        'blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
