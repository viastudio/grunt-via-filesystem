'use strict';

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.via_filesystem = {
    setUp: function(done) {
        grunt.file.mkdir('tmp');
        done();
    },
    test_default: function(test) {

        var config =  {
                default: {
                    symLinks: [
                        {
                            src: 'test/fixtures/symlink1',
                            dest: 'tmp/symlink1'
                        },
                        {
                            src: 'test/fixtures/symlink2',
                            dest: 'tmp/symlink2'
                        },
                        {
                            src: 'path/to/nowhere',
                            dest: 'tmp/brokensymlink'
                        }
                    ],
                    dirs: [
                        {
                            path: 'tmp/dir1',
                            permissions: '0777'
                        }
                    ]
                },
                dev: {

                }
            };

        test.equal(true, grunt.file.exists(config.default.symLinks[0].src), 'Symlink source should exist.');
        test.equal(false, grunt.file.exists(config.default.symLinks[0].dest), 'Symlink destination should not exist.');

        test.equal(true, grunt.file.exists(config.default.symLinks[1].src), 'Symlink source should exist.');
        test.equal(false, grunt.file.exists(config.default.symLinks[1].dest), 'Symlink destination should not exist.');

        test.equal(false, grunt.file.exists(config.default.symLinks[2].src), 'Symlink source should not exist.');
        test.equal(false, grunt.file.exists(config.default.symLinks[2].src), 'Symlink destination should not exist.');

        test.equal(false, grunt.file.exists(config.default.dirs[0].path), 'New dir should not exist yet.');

        //run grunt
        grunt.forceEnvironment = 'dev';
        grunt.initConfig({
            via_filesystem: config
        });
        grunt.loadTasks('tasks');
        grunt.task.run('via_filesystem');

        //TODO figure out async issue


        test.done();
    }
};
