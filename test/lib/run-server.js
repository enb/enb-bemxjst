var http = require('http'),
    promisify = require('vow-node').promisify,
    serveStatic = require('serve-static'),
    finalhandler = require('finalhandler'),
    runPhantom = require('./run-phantom');

module.exports = function (port) {
    var serve = serveStatic(process.cwd(), { index: false }),
        server = http.createServer(function (req, res) {
            var done = finalhandler(req, res);

            serve(req, res, done);
        }),
        listen = promisify(server.listen.bind(server));

    return listen(port)
        .then(function () {
            return runPhantom('http://localhost:' + port + '/index.html');
        })
        .then(function () {
            server.close();
        })
        .fail(function (err) {
            server.close();
            throw err;
        });
};
