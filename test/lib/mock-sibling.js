var vow = require('vow');

exports.declare = function (obj) {
    return {
        fork: function () {
            return {
                process: function () {
                    return vow.when(obj.process.apply(obj, arguments));
                },
                dispose: function () {}
            };
        }
    };
};
