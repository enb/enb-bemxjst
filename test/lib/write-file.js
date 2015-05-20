var fs = require('fs'),
    vow = require('vow');

// Нужно для того, чтобы mtime записанного файла гарантированно отличался от ранее созданных
module.exports = function () {
    var defer = vow.defer(),
        args = arguments;

    setTimeout(function () {
        fs.writeFileSync.apply(fs, args);
        defer.resolve();
    }, 10);

    return defer.promise();
};
