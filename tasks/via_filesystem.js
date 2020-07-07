/*
 * grunt-via-filesystem
 *
 */

'use strict';

module.exports = function(grunt) {

    var fs = require('fs');
    var path = require('path');
    var viaEnvironment = require('via-environment');

    /**
     * Creates symbolic link
     *
     * @param {String} srcPath
     * @param {String} destPath
     * @returns {null}
     */
    function createSymbolicLink(srcPath, destPath) {
        if (!grunt.file.exists(srcPath) && !grunt.file.isLink(srcPath)) {
            grunt.log.error().error('Symbolic link source directory does not exist: ' + srcPath.red);
            return;
        }

        if (!grunt.file.exists(destPath)) {
            grunt.log.write(destPath.cyan + ' -> ' + srcPath.cyan + '... ');
            fs.symlinkSync(srcPath, destPath);
            grunt.log.ok();
        } else {
            grunt.log.writeln('Destination path already exists: ' + destPath.cyan);
        }

    }

    /**
     * Creates directory and optionally set permissions
     *
     * @param {String} path
     * @param {String} permissions octal
     * @returns {null}
     */
    function createDirectory(path, permissions) {

        if (grunt.file.exists(path)) {
            grunt.log.writeln(path.cyan + ' already exists.');
        } else {
            grunt.log.write(path.cyan + '... ');
            grunt.file.mkdir(path);
            grunt.log.ok();
        }

        if (permissions !== undefined) {
            var fileStats = fs.statSync(path);
            var processUID = process.getuid();

            if (processUID != fileStats.uid) {
                grunt.log.writeln("Current user (uid: " + processUID.toString().cyan + ") is not the owner of '" + path.cyan + "' (uid: " + fileStats.uid.toString().cyan + "). Skipping chmod." );
            } else {
                grunt.log.write('Setting permissions (' + permissions.cyan + '): ' + path.cyan + '... ');
                fs.chmodSync(path, permissions);
                grunt.log.ok();
            }
        }
    }

    grunt.registerTask('via_filesystem', 'Grunt plugin for setting up a project filesystem at Via Studio.', function() {

        //detect environment
        var env = (typeof grunt.forceEnvironment === 'undefined') ? viaEnvironment.getEnvironment() : grunt.forceEnvironment;

        console.log(env);

        //setup config
        var defaultConfig = grunt.config.get('via_filesystem').default;
        var envConfig = grunt.config.get('via_filesystem')[env];

        if (envConfig === undefined) {
            grunt.fail.fatal('No configuration defined for this environment: ' + env);
        }

        var symLinks = (typeof envConfig.symLinks === "undefined") ? defaultConfig.symLinks : envConfig.symLinks;
        var dirs = (typeof envConfig.dirs === "undefined") ? defaultConfig.dirs : envConfig.dirs;

        //create symlinks
        if (symLinks !== undefined && symLinks instanceof Array) {
            grunt.log.subhead("Creating Symbolic Links...");
            symLinks.forEach(function(symLink) {
                createSymbolicLink(symLink.src, symLink.dest);
            });
        } else {
            grunt.log.writeln("No symbolic links defined.");
        }

        //create dirs
        if (dirs !== undefined && dirs instanceof Array) {
            grunt.log.subhead("Creating Directories...");
            dirs.forEach(function(dir) {
                createDirectory(dir.path, dir.permissions);
            });
        } else {
            grunt.log.writeln("No directories defined.");
        }


    });

};
