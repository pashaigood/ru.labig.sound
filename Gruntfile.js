'use strict';
var formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra');

module.exports = function (grunt) {
    // Add require for connect-modewrite
    var modRewrite = require('connect-modrewrite');

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings
        bowerApp: {
            // configurable app path
            app: require('./bower.json').appPath || 'app'
        },

        lmd: {
            dist: {
                projectRoot: '<%= bowerApp.app %>',
                build: 'index'
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            code: {
                files: [
                    '.tmp/js/**/*.js',
                    '<%= bowerApp.app %>/index.js'
                ],
                options: {
                    livereload: true
                }
            },
            js: {
//                files: ['<%= bowerApp.app %>/js/{,*/}*.js'],
                files: ['<%= bowerApp.app %>/js/**/*.js'],
                tasks: ['lmd:dist'],
                options: {
                    spawn : false
//                    livereload: true
                }
            },
            styles: {
                files: ['<%= bowerApp.app %>/css/{,*/}*.css'],
                options: {
                    livereload: true
                }
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= bowerApp.app %>/{,*/}*.html',
                    '<%= bowerApp.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729,
                base: '<%= bowerApp.app %>',

//                middleware: function(connect, options, middlewares) {
//                    console.log('middle');
//                    // inject a custom middleware into the array of default middlewares
//                    middlewares.unshift(function(req, res, next) {
//                        if (req.url !== '/test') return next();
//
//                        res.end('Hello, world from port #' + options.port + '!');
//                    });
//
//                    return middlewares;
//                }
            },
            livereload: {
                options: {
                    open: 'http://localhost:<%= connect.options.port %>',
                    base: [
                        '.tmp',
                        '<%= bowerApp.app %>'
                    ],
                    // MODIFIED: Add this middleware configuration
                    middleware: function (connect, options) {
                        var middlewares = [];

                        middlewares.unshift(function (req, res, next) {
                            if (req.url !== '/test') return next();

                            var form = new formidable.IncomingForm();
                            form.parse(req, function (err, fields, files) {
                                res.writeHead(200, {'content-type': 'text/plain'});
                                res.write('received upload:\n\n');
                                res.end(util.inspect({fields: fields, files: files}));
                            });

//                            return;
                            form.on('end', function (fields, files) {
                                /* Temporary location of our uploaded file */
                                var temp_path = this.openedFiles[0].path;
                                /* The file name of the uploaded file */
                                var file_name = this.openedFiles[0].name;
                                /* Location where we want to copy the uploaded file */
                                var new_location = 'app/files/';

                                fs.copy(temp_path, new_location + file_name, function (err) {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        console.log("success!")
                                    }
                                });
                            });
                        });

//                        middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]'])); //Matches everything that does not contain a '.' (period)
                        options.base.forEach(function (base) {
                            middlewares.push(connect.static(base));
                        });
                        return middlewares;
                    }
                }
            }

        },
        // Automatically inject Bower components into the app
        bowerInstall: {
            app: {
                src: ['<%= bowerApp.app %>/index.html'],
                ignorePath: '<%= bowerApp.app %>/'
            }
        },
        // Upload bower component
        shell: {
            bowerRegister: {
                command: 'bower register ' + require('./bower.json').name + ' ' + require('./bower.json').repository.url
            }
        }
    });
    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-bower-install');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-lmd');

    // Register new tasks
    grunt.registerTask('serve', ['bowerInstall', 'connect', 'lmd', 'watch']);
    grunt.registerTask('publish', ['shell:bowerRegister']);
}