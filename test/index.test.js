var assert = require('power-assert');
var cleanup = require("../");

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var temp = require('temp');


var files = [
    "1.txt",
    "2.txt",
    "3.txt",
    "foo/4.txt",
    "foo/5.txt",
    "foo/bar/6.txt",
    "foo/bar/7.txt",
    "foo/baz/8.txt",
    "foo/baz/qux/9.txt",
    "foo/baz/qux/10.txt",

    ".101",
    ".102",
    ".a/102",
    ".a/.103",
    ".a/.b/104",
    ".a/.b/.105",
    ".a/c/106",
    ".a/c/d/107"
];



describe("cleanupdir", function () {
    var testDir = temp.mkdirSync("cleanupdir_");
    var filenames = [];

    before(function (done) {
        files.forEach(function (file) {
            var filename = path.join(testDir, file);
            var dirname = path.dirname(filename);

            mkdirp.sync(dirname);
            fs.writeFileSync(filename, "ok");

            if (!fs.existsSync(filename)) {
                throw Error("failed to create a test file " + filename);
            }

            filenames.push(filename);
        });

        cleanup(testDir, done);
    });

    after(function () {
        if (fs.existsSync(testDir)) {
            rimraf.sync(testDir);
        }
    });

    it("should remove all files/directory in " + testDir, function () {
        filenames.forEach(function (filename) {
            assert.ok(!fs.existsSync(filename));
        });
    });

    it("should not remove a directory " + testDir, function () {
        assert.ok(fs.existsSync(testDir));
    });
});

describe("cleanupdir error", function () {
    var testDir = temp.mkdirSync("cleanupdir_");

    after(function () {
        if (fs.existsSync(testDir)) {
            rimraf.sync(testDir);
        }
    });

    it("should raise error if not exists directory", function (done) {
        var dirname = path.join(testDir, "not_exists");

        cleanup(dirname, function (err) {
            assert.ifError(!err);
            done();
        });
    });

    it("should raise error if target path is not directory", function (done) {
        var filename = path.join(testDir, "file");

        fs.writeFileSync(filename, "ok");

        cleanup(filename, function (err) {
            assert.ifError(!err);
            done();
        });
    });
});