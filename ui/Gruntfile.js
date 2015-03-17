// Generated on 2015-02-24 using generator-angular-fullstack 2.0.13
'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically, when needed
    require('jit-grunt')(grunt, {
        express: 'grunt-express-server',
        useminPrepare: 'grunt-usemin',
        ngtemplates: 'grunt-angular-templates',
        cdnify: 'grunt-google-cdn',
        protractor: 'grunt-protractor-runner',
        injector: 'grunt-asset-injector',
        buildcontrol: 'grunt-build-control'
    });

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        pkg: grunt.file.readJSON('package.json'),
        quickbase: {
            // configurable paths
            client: {
                root: require('./bower.json').appPath || 'client',
                components: '<%= quickbase.client.root %>/{common_components,quickbase}',
                assets: '<%= quickbase.client.root %>/quickbase/assets'
            },
            dist: 'dist'
        },
        express: {
            options: {
                port: 9000,
                sslPort: 9443,
                host: process.env.HOST || 'localhost'
            },
            dev: {
                options: {
                    script: 'server/app.js',
                    debug: true
                }
            },
            prod: {
                options: {
                    script: 'dist/server/app.js'
                }
            }
        },
        open: {
            server: {
                url: 'http://<%= express.options.host %>:<%= express.options.port %>'
            }
        },
        watch: {
            //  NOT AUTOMATICALLY INJECTING SCRIPTS
            //injectJS: {
            //    files: [
            //        '<%= quickbase.client.components %>/**/*.js',
            //        '<%= quickbase.client.components %>/**/*.spec.js',
            //        '!<%= quickbase.client.components %>/**/*.mock.js',
            //        '!<%= quickbase.client.components %>/*.modules.js'],
            //    tasks: ['injector:scripts']
            //},
            //  NOT AUTOMATICALLY INJECTING SCRIPTS
            //injectCss: {
            //    files: [
            //        '<%= quickbase.client.components %>/**/*.css',
            //        '<%= quickbase.client.assets %>/**/*.css'
            //    ],
            //    tasks: ['injector:css']
            //},
            //mochaTest: {
            //    files: ['server/**/*.spec.js'],
            //    tasks: ['env:test', 'mochaTest']
            //},
            //jsTest: {
            //    files: [
            //        '<%= quickbase.client.components %>/**/*.spec.js',
            //        '<%= quickbase.client.components %>/**/*.mock.js'
            //    ],
            //    tasks: ['newer:jshint:all', 'karma']
            //},
            //injectSass: {
            //    files: [
            //        '<%= quickbase.client.components %>/**/*.{scss,sass}',
            //        '<%= quickbase.client.assets %>/**/*.{scss,sass}'
            //    ],
            //    tasks: ['injector:sass']
            //},
            //sass: {
            //    files: [
            //        '<%= quickbase.client.components %>/**/*.{scss,sass}',
            //        '<%= quickbase.client.assets %>/**/*.{scss,sass}'
            //    ],
            //    tasks: ['sass','autoprefixer']
            //},
            //gruntfile: {
            //    files: ['Gruntfile.js']
            //},
            //livereload: {
            //    files: [
            //        '{.tmp,<%= quickbase.client.components %>}/**/*.css',
            //        '{.tmp,<%= quickbase.client.assets %>}/**/*.css',
            //        '{.tmp,<%= quickbase.client.components %>}/**/*.html',
            //        '{.tmp,<%= quickbase.client.components %>}/**/*.js',
            //        '!{.tmp,<%= quickbase.client.components %>}**/*.spec.js',
            //        '!{.tmp,<%= quickbase.client.components %>}/**/*.mock.js',
            //        '<%= quickbase.client.components %>/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}',
            //        '<%= quickbase.client.assets %>/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
            //    ],
            //    options: {
            //        livereload: true
            //    }
            //},
            //express: {
            //    files: [
            //        'server/**/*.{js,json}'
            ///    ],
            //    tasks: ['express:dev', 'wait'],
            //    options: {
            //        livereload: true,
            //        nospawn: true //Without this option specified express won't be reloaded
            //    }
            //},
            sass: {  //watch for changes to scss files to trigger compass compilation
                files: '<%= quickbase.client.root %>/**/*.scss',
                tasks: ['compass-compile']
            }
        },

        jscs: {
            client: {
                files:{
                    src:['<%= quickbase.client.root %>/**/*.js',
                    ]
                },
                options: {
                    config: "./.jscsrc",
                    "excludeFiles": ['<%= quickbase.client.root %>/bower_components/**/*.js',
                                    '<%= quickbase.client.root %>/**/*.spec.js'
                    ]
                }
            },
            server: {
                files: {
                    src:["server/**/*.js"]
                },
                options: {
                    config: "./.jscsrc",
                    "excludeFiles": ['server/**/*.spec.js'
                    ]
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '<%= quickbase.client.root %>/.jshintrc',
                reporter: require('jshint-stylish')
            },
            server: {
                options: {
                    jshintrc: 'server/.jshintrc'
                },
                src: [
                    'server/**/*.js',
                    '!server/**/*.spec.js'
                ]
            },
            serverTest: {
                options: {
                    jshintrc: 'server/.jshintrc-spec'
                },
                src: ['server/**/*.spec.js']
            },
            all: [
                '<%= quickbase.client.components %>/**/*.js',
                '!<%= quickbase.client.components %>/**/*.spec.js',
                '!<%= quickbase.client.components %>/**/*.mock.js'
            ],
            test: {
                src: [
                    '<%= quickbase.client.components %>/**/*.spec.js',
                    '<%= quickbase.client.components %>/**/*.mock.js'
                ]
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= quickbase.dist %>/*',
                        '!<%= quickbase.dist %>/.git*',
                        '!<%= quickbase.dist %>/.openshift',
                        '!<%= quickbase.dist %>/Procfile'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/',
                    src: '{,*/}*.css',
                    dest: '.tmp/'
                }]
            }
        },

        // Debugging with node inspector
        'node-inspector': {
            custom: {
                options: {
                    'web-host': 'localhost'
                }
            }
        },

        // Use nodemon to run server in debug mode with an initial breakpoint
        nodemon: {
            debug: {
                script: 'server/app.js',
                options: {
                    nodeArgs: ['--debug-brk'],
                    env: {
                        PORT: 9000
                    },
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });

                        // opens browser on initial server start
                        nodemon.on('config:update', function () {
                            setTimeout(function () {
                                require('open')('http://localhost:8080/debug?port=5858');
                            }, 500);
                        });
                    }
                }
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            target: {
                src: '<%= quickbase.client.root %>/*.index.html',
                ignorePath: '<%= quickbase.client.root %>/',
                exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/]
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= quickbase.dist %>/public/quickbase/{,*/}*.js',
                        '<%= quickbase.dist %>/public/quickbase/{,*/}*.css'

                        // compass is spriting our images and generating a file with a rev number...we'll just
                        // copy that file over without revving it.
                        //'<%= quickbase.dist %>/public/quickbase/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files.
        //
        // Creates configurations in memory so additional tasks can operate on them
        //
        // NOTE: the task scans the html files to identify what to process.  Format of tags is:
        //   <!-- build:<type>(alternate search path) <path> -->
        //       ...
        //   <!-- endbuild -->
        //
        //   For example:
        //   <!-- build:js quickbase/apps.common.js -->
        //      <script src="common_components/logger/log.js"></script>
        //   <!-- endbuild -->
        useminPrepare: {
            html: [
                '<%= quickbase.client.root %>/*.index.html'],         // look for entry point html files
            options: {
                dest: '<%= quickbase.dist %>/public'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        //
        usemin: {
            html: ['<%= quickbase.dist %>/public/{,*/}*.html'],
            css: ['<%= quickbase.dist %>/public/{,*/}*.css'],
            js: ['<%= quickbase.dist %>/public/{,*/}*.js'],
            options: {
                assetsDirs: [
                    '<%= quickbase.dist %>/public',
                    '<%= quickbase.dist %>/public/assets/images'
                ],
                // This is so we update image references in our ng-templates
                patterns: {
                    js: [
                        [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
                    ]
                }
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= quickbase.client.root %>/',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= quickbase.dist %>/public/assets/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= quickbase.client.root %>/',
                    src: '{,*/}*.svg',
                    dest: '<%= quickbase.dist %>/public/assets/images'
                }]
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat',
                    src: '*/**.js',
                    dest: '.tmp/concat'
                }]
            }
        },

        // Package all the html partials into a single javascript payload
        //
        // Each quickBase angular app (quickbase.realm, quickbase.qbapp, etc.) to have their own definition block
        ngtemplates: {
            'quickbase.realm': {
                cwd: '<%= quickbase.client.root %>',
                src: ['quickbase/realm/**/*.html'],     // look for all html files within the realm folder
                dest: '.tmp/realmTemplates.js',
                options: {
                    usemin: 'quickbase/realm.js'        // maps to reference in realm.index.html
                }
            },
            'quickbase.qbapp': {
                cwd: '<%= quickbase.client.root %>',
                src: ['quickbase/qbapp/**/*.html'],     // look for all html files within the app folder
                dest: '.tmp/appTemplates.js',
                options: {
                    usemin: 'quickbase/qbapp.js'        // maps to reference in app.index.html
                }
            },
            options: {
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }
            },
            tmp: {
                cwd: '.tmp',
                src: ['**/*.html'],
                dest: '.tmp/tmp-templates.js'
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= quickbase.dist %>/public/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= quickbase.client.root %>',
                    dest: '<%= quickbase.dist %>/public',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'bower_components/**/*',
                        'common_components/**/*',
                        '*.index.html'
                    ]
                }, {
                    flatten: true,
                    expand: true,
                    cwd: '<%= quickbase.client.assets %>',
                    dest: '<%= quickbase.dist %>/public/quickbase/assets',
                    src: ['**/images-*.*']
                }, {
               //     expand: true,
               //     cwd: '.tmp/images',
               //     dest: '<%= quickbase.dist %>/public/assets/images',
               ///     src: ['generated/*']
               // }, {
                    expand: true,
                    dest: '<%= quickbase.dist %>',
                    src: [
                        'package.json',
                        'server/**/*'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd: ['<%= quickbase.client.components %>/', '<%= quickbase.client.assets %>/'],
                dest: '.tmp/',
                src: ['**/*.css']
            }
        },

        buildcontrol: {
            options: {
                dir: 'dist',
                commit: true,
                push: true,
                connectCommits: false,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            heroku: {
                options: {
                    remote: 'heroku',
                    branch: 'master'
                }
            },
            openshift: {
                options: {
                    remote: 'openshift',
                    branch: 'master'
                }
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                //'sass'
                'compass:dev'
            ],
            test: [
                //'sass'
                'compass:dev'
            ],
            debug: {
                tasks: [
                    'nodemon',
                    'node-inspector'
                ],
                options: {
                    logConcurrentOutput: true
                }
            },
            dist: [
                //'sass',
                'compass:dist',
                'imagemin',
                'svgmin'
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['server/**/*.spec.js']
        },

        protractor: {
            options: {
                configFile: 'protractor.conf.js'
            },
            chrome: {
                options: {
                    args: {
                        browser: 'chrome'
                    }
                }
            }
        },

        env: {
            test: {
                NODE_ENV: 'test'
            },
            prod: {
                NODE_ENV: 'production'
            },
            local: {
                NODE_ENV: 'local'
            }
        },

        // Compiles Sass to CSS
        // TODO: should remove once compass task is ready...
        //sass: {
        //    server: {
        //        options: {
        //            style: 'compressed',
        //            compass: true
        //        },
        //        files: {
        //            '.tmp/app/app.css': [
        //                '<%= quickbase.client.components %>/**/*.scss'
        //            ]
        //        }
        //    }
        //},

        compass: {
            options: {
                config: 'config.rb'
            },
            dist: {
                options: {
                    environment: 'production'
                }
            },
            dev: {
                options: {
                    environment: 'development'
                }
            }
        },

        injector: {
            //options: {},
            // Inject application script files into index.html (doesn't include bower)
            // TODO: remove if not going to automatically inject script tags.. There are a few issues:
            // TODO:   -have to explicitly reference each app html file
            // TODO:   -will duplicate entry, as it does not check if tag is already declared
            // TODO:   -potentially could pull in more script files than necessary as source is quite broad
            //scripts: {
            //    options: {
            //        transform: function (filePath) {
            //            filePath = filePath.replace('/client/', '');
            //            filePath = filePath.replace('/.tmp/', '');
            //            return '<script src="' + filePath + '"></script>';
            //        },
            //        starttag: '<!-- injector:js -->',
            //        endtag: '<!-- endinjector -->'
            //    },
            //    files: {
            //        '<%= quickbase.client.root %>/realm.index.html': [
            //            '{.tmp,<%= quickbase.client.components %>}/realm/**/*.js',
            //            '!{.tmp,<%= quickbase.client.components %>}/realm/**/*.spec.js',
            //            '!{.tmp,<%= quickbase.client.components %>}/realm/**/*.mock.js'
            //        ]
            //    }
            //},

            // Inject ALL scss files under an application into app.scss
            //sass: {
            //    //  TODO: consider breaking out scss into one file per respective qbApps
            //    options: {
            //        transform: function (filePath) {
            //            filePath = filePath.replace('/client/quickbase/', '');
            //            filePath = filePath.replace('/client/common_components/', '');
            //            filePath = filePath.replace('/client/assets/', '');
            //            return '@import \'' + filePath + '\';';
            //        },
            //        starttag: '// injector',
            //        endtag: '// endinjector'
            //    },
            //    files: {
            //        '<%= quickbase.client.root %>/app.scss': [
            //            '<%= quickbase.client.components %>/**/*.{scss,sass}',
            //            '<%= quickbase.client.assets %>/**/*.{scss,sass}'
            //        ]
            //    }
            //}

            // Inject component css into index.html
            // TODO: as with script tag, remove if not going to automatically inject script tags.
            //css: {
            //    options: {
            //        transform: function (filePath) {
            //            filePath = filePath.replace('/client/', '');
            //            filePath = filePath.replace('/.tmp/', '');
            //            return '<link rel="stylesheet" href="' + filePath + '">';
            //        },
            //        starttag: '<!-- injector:css -->',
            //        endtag: '<!-- endinjector -->'
            //    },
            //    files: {
            //        '<%= quickbase.client.root %>/apps.index.html': [
            //            '<%= quickbase.client.components %>/apps/**/*.css',
            //            '<%= quickbase.client.assets %>/**/*.css'
            //        ]
            //    }
            // }
        }
    });

    // Used for delaying livereload until after server has restarted
    grunt.registerTask('wait', function () {
        grunt.log.ok('Waiting for server reload...');

        var done = this.async();

        setTimeout(function () {
            grunt.log.writeln('Done waiting!');
            done();
        }, 1500);
    });

    grunt.registerTask('compass-compile', 'Compass compile', function () {
        grunt.task.run([
            'compass:dev'
        ]);
    });
    grunt.registerTask('compass-watch', 'Compass watch', function () {
        grunt.task.run([
            'watch:sass'
        ]);
    });

    grunt.registerTask('express-keepalive', 'Keep grunt running', function () {
        this.async();
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'env:local', 'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive']);
        }

        if (target === 'debug') {
            return grunt.task.run([
                'clean:server',
                'env:local',
                //'injector:sass',
                'concurrent:server',
                //'injector',   NOT INJECTING SCRIPTS AND CSS AUTOMATICALLY
                'wiredep',
                'autoprefixer',
                'concurrent:debug'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'env:local',
            //'injector:sass',
            'concurrent:server',
            //'injector',   NOT INJECTING SCRIPTS AND CSS AUTOMATICALLY
            'wiredep',
            'autoprefixer',
            'express:dev',
            'wait',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', function (target) {
        if (target === 'server') {
            return grunt.task.run([
                'env:local',
                'env:test',
                'mochaTest'
            ]);
        }
        if (target === 'client') {
            return grunt.task.run([
                'clean:server',
                'env:local',
                //'injector:sass',
                'concurrent:test',
                //'injector',   NOT INJECTING SCRIPTS AND CSS AUTOMATICALLY
                'autoprefixer',
                'karma'
            ]);
        }

        if (target === 'e2e') {
            return grunt.task.run([
                'clean:server',
                'env:local',
                'env:test',
                //'injector:sass',
                'concurrent:test',
                //'injector',   NOT INJECTING SCRIPTS AND CSS AUTOMATICALLY
                'wiredep',
                'autoprefixer',
                'express:dev',
                'protractor'
            ]);
        }

        //  default task if no target specified
        grunt.task.run([
            'test:server',
            'test:client'
        ]);

    });

    grunt.registerTask('build', [
        'clean:dist',
        //'injector:sass',
        'concurrent:dist',
        //'injector',   NOT INJECTING SCRIPTS AND CSS AUTOMATICALLY
        'wiredep',
        'useminPrepare',
        'autoprefixer',
        'ngtemplates',
        'concat',
        'ngAnnotate',
        'copy:dist',
        //'cdnify',
        'cssmin',
        'uglify',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);

    grunt.loadNpmTasks("grunt-jscs");
};
