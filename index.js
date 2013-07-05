module.exports = process.env.ENB_BEMXJST_COVERAGE ?
    require('./lib-cov/hello-world') :
    require('./lib/hello-world');
