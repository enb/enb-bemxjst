var vow = require('vow'),
    exec = require('child_process').exec,
    phantomjsPath = require('phantomjs').path,
    mochaPhantomjsScriptPath = require.resolve('mocha-phantomjs'),
    reporter = 'json';

module.exports = function (page) {
    var defer = vow.defer();

    exec([phantomjsPath, mochaPhantomjsScriptPath, page, reporter].join(' '),
        function (err, stdout) {
            if (err) {
                try {
                    var json = JSON.parse(stdout),
                        errors = json.tests.filter(function (test) {
                            return test.err;
                        }),
                        testError = errors[0].err;

                    if (testError) {
                        var stack = testError.stack;
                        testError = new Error(testError.message);
                        testError.stack = stack;
                    } else {
                        testError = err;
                    }

                    defer.reject(testError);
                } catch (e) {
                    defer.reject(err);
                }
            } else {
                defer.resolve();
            }
        }
    );

    return defer.promise();
};
