var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var glob = require('glob');
var async = require('async');

module.exports = cleanUpDirectory;


function cleanUpDirectory (dirname, callback) {
    isDirectoryExists(dirname, function (err) {
        if (err) {
            callback(err);
            return;
        }

        listInnerFilenames(dirname, function (err, filenames) {
            if (err) {
                callback(err);
                return;
            }

            async.map(filenames, rimraf, callback);
        });
    });
}

function isDirectoryExists(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (!exists) {
            callback(Error(dirname + " is not exists."));
            return;
        }

        fs.stat(dirname, function (err, stats) {
            if (err) {
                callback(err);
                return;
            }

            if (!stats.isDirectory()) {
                callback(Error(dirname + " is not directory."));
                return;
            }

            callback();
        });
    });
}

function listInnerFilenames(dirname, callback) {
    var pattern = path.join(dirname, "/*");
    var options = { dot: true };

    glob(pattern, options, callback);
}