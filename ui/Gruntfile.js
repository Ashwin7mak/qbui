// Generated on 2015-02-24 using generator-angular-fullstack 2.0.13
module.exports = function(grunt) {
    'use strict';

    var buildDir = __dirname + '/build';
    var localJsFile = __dirname + '/server/config/environment/local.js';
    var serverReportDir = buildDir + '/reports/server';
    var clientReportDir = buildDir + '/reports/client';
    var mochaUnitTest = grunt.option('test') || '*.unit.spec.js';
    var mochaIntTest = grunt.option('test') || '*.integration.spec.js';
    var baseUrl = grunt.option('baseUrl') || 'http://localhost:9000';
    var sauceConnect = require('./e2e/sauce_connect');
    var currentDateTime = new Date().getTime();
    var tunnelIdentifier = grunt.option('tunnelIdentifier') || 'tunnel_' + currentDateTime;
    var sauceJobName = grunt.option('sauceJobName') || 'e2e_' + currentDateTime;
    var sauceKey = grunt.option('sauceKey');
    //We need to pass along --proxy-tunnel so that the tunnel will also use the proxy to communicate with the sauce apis
    //sauce-connect-launcher won't take an explicit no arg argument, so we are "leveraging" their mechanism for passing
    //arguments along to sauce-connect-launcher
    var httpProxy = grunt.option('httpProxyHost') !== undefined ? grunt.option('httpProxyHost') + ':80 --proxy-tunnel' : null;
    var useColors = grunt.option('colors') || false;

    // Load grunt tasks automatically, when needed
    require('jit-grunt')(grunt, {
        express      : 'grunt-express-server',
        useminPrepare: 'grunt-usemin',
        ngtemplates  : 'grunt-angular-templates',
        //cdnify: 'grunt-google-cdn',
        protractor   : 'grunt-protractor-runner',
        injector     : 'grunt-asset-injector',
        buildcontrol : 'grunt-build-control'
    });

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings
        pkg      : grunt.file.readJSON('package.json'),
        quickbase: {
            // configurable paths
            client    : {
                root      : 'client',
                components: '<%= quickbase.client.root %>/quickbase',
                gallery   : '<%= quickbase.client.root %>/gallery',
                assets    : '<%= quickbase.client.root %>/quickbase/assets'
            },
            e2e       : 'e2e',
            //  dist contains the target folders of the build
            distDir   : 'dist',
            distPublic: 'dist/public'
        },
        express  : {
            root   : 'server',
            options: {
                debug  : true,
                port   : 9000,
                sslPort: 9443,
                host   : process.env.HOST || 'localhost',
                script : '<%= express.root %>/app.js'
            },
            local  : {
                options: {
                    node_env: 'local'
                }
            },
            prod   : {
                options: {
                    debug   : false,
                    script  : '<%= quickbase.distDir %>/<%= express.root %>/app.js',
                    node_env: 'production'
                }
            },
            test   : {
                options: {
                    script  : '<%= quickbase.distDir %>/<%= express.root %>/app.js',
                    node_env: 'test'
                }
            }
        },
        open     : {
            server: {
                url: 'http://<%= express.options.host %>:<%= express.options.port %>'
            }
        },
        watch    : {
            mochaTest : {
                files: ['<%= express.root %>/**/*.spec.js',
                        '<%= express.root %>/**/test/**/*.js',
                        '<%= express.root %>/**/*.js'
                ],
                tasks: ['env:local', 'newer:jshint', 'newer:jscs', 'mochaTest:test']
            },
            jsTest    : {
                files: [
                    '<%= quickbase.client.components %>/**/*.spec.js',
                    '<%= quickbase.client.components %>/**/*.mock.js',
                    '<%= quickbase.client.components %>/**/test/**/*.js',
                    '<%= quickbase.client.components %>/**/*.js'
                ],
                tasks: ['newer:jshint', 'newer:jscs','karma:unit']
            },
            livereload: {
                files  : [
                    '{.tmp,<%= quickbase.client.components %>}/**/*.css',
                    '{.tmp,<%= quickbase.client.assets %>}/**/*.css',
                    '{.tmp,<%= quickbase.client.components %>}/**/*.html',
                    '{.tmp,<%= quickbase.client.components %>}/**/*.js',
                    '!{.tmp,<%= quickbase.client.components %>}**/*.spec.js',
                    '!{.tmp,<%= quickbase.client.components %>}/**/*.mock.js',
                    '<%= quickbase.client.components %>/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= quickbase.client.assets %>/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                options: {
                    livereload: true
                }
            },
            express   : {
                files  : [
                    '<%= express.root %>/**/*.{js,json}'
                ],
                tasks  : ['express:local', 'wait'],
                options: {
                    livereload: true,
                    nospawn   : true //Without this option specified express won't be reloaded
                }
            },
            sass      : {  //watch for changes to scss files to trigger compass compilation
                files: '<%= quickbase.client.root %>/**/*.scss',
                tasks: ['compass-compile']
            }
        },

        jscs: {
            client : {
                files  : {
                    src: ['<%= quickbase.client.root %>/**/*.js', '<%= quickbase.e2e %>/**/*.js']
                },
                options: {
                    config      : './.jscsrc',
                    excludeFiles: ['<%= quickbase.client.root %>/bower_components/**/*.js',
                        //              '<%= quickbase.client.root %>/**/*.spec.js'
                    ]
                }
            },
            server : {
                files  : {
                    src: ['<%= express.root %>/**/*.js']
                },
                options: {
                    config: './.jscsrc',
                    // excludeFiles: ['<%= express.root %>/**/*.spec.js']
                }
            },
            testGen: {
                files  : {
                    src: ['test_generators/**/*.js']
                },
                options: {
                    config: './.jscsrc',
                    //             excludeFiles: ['test_generators/**/*.spec.js']
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options   : {
                jshintrc: './.jshintrc',
                //reporter: require('jshint-stylish'),
                reporter: './node_modules/jshint-practical/'
            },
            server    : {
                options: {
                    jshintrc: '<%= express.root %>/.jshintrc'
                },
                src    : [
                    '<%= express.root %>/**/*.js',
                    '!<%= express.root %>/**/*.spec.js'
                ]
            },
            serverTest: {
                options: {
                    jshintrc: '<%= express.root %>/.jshintrc'
                },
                src    : ['<%= express.root %>/**/*.spec.js',
                          '<%= express.root %>/**/test/**/*.js']
            },
            client    : {
                options: {
                    jshintrc: '<%= quickbase.client.root %>/.jshintrc'
                },
                src    : [
                    '<%= quickbase.client.components %>/**/*.js',
                    '<%= quickbase.client.components %>/**/*.js',
                    '<%= quickbase.client.gallery %>/**/*.js',
                    '!<%= quickbase.client.components %>/**/*.spec.js',
                    '!<%= quickbase.client.components %>/**/*.mock.js'
                ]
            },
            clientTest: {
                options: {
                    jshintrc: '<%= quickbase.client.root %>/.jshintrc'
                },
                src    : [
                    '<%= quickbase.client.components %>/**/*.spec.js',
                    '<%= quickbase.client.components %>/**/*.mock.js',
                    '<%= quickbase.client.gallery %>/**/test/**/*.js',
                    '<%= quickbase.e2e %>/**/*.js'
                ]
            },
            testGen   : {
                options: {
                    jshintrc: '<%= express.root %>/.jshintrc'
                },
                src    : [
                    'test_generator/**/*.js'
                ]
            }
        },

        // Empties folders to start fresh
        clean: {
            dist  : {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= quickbase.distDir %>/*',
                        '!<%= quickbase.distDir %>/.git*',
                        '!<%= quickbase.distDir %>/.openshift',
                        '!<%= quickbase.distDir %>/Procfile'
                    ]
                }]
            },
            client: {
                files: [{
                    dot: true,
                    src: [
                        '<%= quickbase.client.assets %>/css/*.*',
                        '<%= quickbase %>/css/*.*',
                        clientReportDir + '/coverage/*',
                        clientReportDir + '/unit/*'
                    ]
                }]
            },
            server: {
                files: [{
                    dot: true,
                    src: [
                        serverReportDir + '/coverage/*',
                        serverReportDir + '/unit/*',
                        serverReportDir + '/integration/*'
                    ]
                }]
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist   : {
                files: [{
                    expand: true,
                    cwd   : '.tmp/',
                    src   : '{,*/}*.css',
                    dest  : '.tmp/'
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
                script : '<%= express.root %>/app.js',
                options: {
                    nodeArgs: ['--debug-brk'],
                    env     : {
                        PORT: 9000
                    },
                    callback: function(nodemon) {
                        nodemon.on('log', function(event) {
                            grunt.log.ok(event.colour);
                        });

                        // opens browser on initial server start
                        nodemon.on('config:update', function() {
                            setTimeout(function() {
                                require('open')('http://localhost:8080/debug?port=5858');
                            }, 500);
                        });
                    }
                }
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app : {
                src       : '<%= quickbase.client.root %>/*.index.html',
                ignorePath: '<%= quickbase.client.root %>/',
                exclude   : [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/]
            },
            test: {
                src            : 'karma.conf.js',
                ignorePath     : /\.\.\//,
                devDependencies: true,
                fileTypes      : {
                    js: {
                        block  : /(([\s\t]*)\/\/\s*startbower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower:)/gi,
                        detect : {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= quickbase.distPublic %>/quickbase/{,*/}*.js',
                        '<%= quickbase.distPublic %>/quickbase/{,*/}*.css'
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
            html   : [
                '<%= quickbase.client.root %>/*.index.html', '!<%= quickbase.client.root %>/gallery/*.index.html'],         // look for entry point html files
            options: {
                dest: '<%= quickbase.distPublic %>'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        //
        usemin: {
            html   : ['<%= quickbase.distPublic %>/{,*/}*.html'],
            css    : ['<%= quickbase.distPublic %>/{,*/}*.css'],
            js     : ['<%= quickbase.distPublic %>/{,*/}*.js'],
            options: {
                assetsDirs: [
                    '<%= quickbase.distPublic %>',
                    '<%= quickbase.distPublic %>/assets/images'
                ],
                // This is so we update image references in our ng-templates
                patterns  : {
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
                    cwd   : '<%= quickbase.client.root %>/',
                    src   : '{,*/}*.{png,jpg,jpeg,gif}',
                    dest  : '<%= quickbase.distPublic %>/assets/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd   : '<%= quickbase.client.root %>/',
                    src   : '{,*/}*.svg',
                    dest  : '<%= quickbase.distPublic %>/assets/images'
                }]
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd   : '.tmp/concat',
                    src   : '*/**.js',
                    dest  : '.tmp/concat'
                }]
            }
        },

        // Package all the html partials into a single javascript payload
        //
        // Each quickBase angular app (quickbase.realm, quickbase.qbapp, etc.) to have their own definition block
        ngtemplates: {
            'quickbase.realm' : {
                cwd    : '<%= quickbase.client.root %>',
                src    : ['quickbase/common/**/*.html',
                          'quickbase/realm/**/*.html'],     // look for all html files required for this angular application
                dest   : '.tmp/realmTemplates.js',
                options: {
                    usemin: 'quickbase/realm.js'        // maps to reference in realm.index.html
                }
            },
            'quickbase.qbapp' : {
                cwd    : '<%= quickbase.client.root %>',
                src    : ['quickbase/common/**/*.html',
                          'quickbase/qbapp/**/*.html'],     // look for all html files required for this angular application
                dest   : '.tmp/appTemplates.js',
                options: {
                    usemin: 'quickbase/qbapp.js'        // maps to reference in app.index.html
                }
            },
            'quickbase.report': {
                cwd    : '<%= quickbase.client.root %>',
                src    : ['quickbase/common/**/*.html',
                          'quickbase/qbapp/reports/reportManager/**/*.html'],     // look for all html files required for this angular application
                dest   : '.tmp/reportTemplates.js',
                options: {
                    usemin: 'quickbase/report.js'        // maps to reference in report.index.html
                }
            },
            options           : {
                htmlmin: {
                    collapseBooleanAttributes    : true,
                    collapseWhitespace           : true,
                    removeAttributeQuotes        : true,
                    removeEmptyAttributes        : true,
                    removeRedundantAttributes    : true,
                    removeScriptTypeAttributes   : true,
                    removeStyleLinkTypeAttributes: true
                }
            },
            tmp               : {
                cwd : '.tmp',
                src : ['**/*.html'],
                dest: '.tmp/tmp-templates.js'
            }
        },

        // Replace Google CDN references
        //cdnify: {
        //    dist: {
        //        html: ['<%= quickbase.distPublic %>/*.html']
        //    }
        //},

        // Copies remaining files to places other tasks can use
        copy: {
            dist  : {
                files: [{
                    expand: true,
                    dot   : true,
                    cwd   : '<%= quickbase.client.root %>',
                    dest  : '<%= quickbase.distPublic %>',
                    src   : [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'bower_components/**/*',
                        '*.index.html',
                        '!gallery.index.html',
                        '!**/gallery/*'
                    ]
                }, {
                    //  copy icon files that are not in the sprites folder
                    flatten: true,
                    expand : true,
                    cwd    : '<%= quickbase.client.assets %>',
                    dest   : '<%= quickbase.distPublic %>/quickbase/assets',
                    src    : ['**/images-*.*']
                }, {
                    //  copy the sprites folder
                    flatten: false,
                    expand : true,
                    cwd    : '<%= quickbase.client.assets %>',
                    dest   : '<%= quickbase.distPublic %>/quickbase',
                    src    : [
                        '**/sprites/**.*'
                    ]
                }, {
                    expand: true,
                    dest  : '<%= quickbase.distDir %>',
                    src   : [
                        'package.json',
                        '<%= express.root %>/**/*'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd   : ['<%= quickbase.client.assets %>/'],
                dest  : '.tmp/',
                src   : ['**/*.css']
            }
        },

        buildcontrol: {
            options  : {
                dir           : 'dist',
                commit        : true,
                push          : true,
                connectCommits: false,
                message       : 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            heroku   : {
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
                'compass:dev'
            ],
            test  : [
                'compass:dev'
            ],
            debug : {
                tasks  : [
                    'nodemon',
                    'node-inspector'
                ],
                options: {
                    logConcurrentOutput: true
                }
            },
            dist  : [
                'compass:dist',
                'imagemin',
                'svgmin'
            ]
        },

        // Karma tests..use configuration file to determine what is run
        karma: {
            unit: {
                colors    : useColors,
                configFile: 'karma.conf.js',
                singleRun : true
            }
        },

        // Mocha tests against the express code
        mochaTest: {
            test: {
                options: {
                    quiet   : true,
                    reporter: (function() {
                        process.env.MOCHA_COLORS = useColors;
                        process.env.JUNIT_REPORT_PATH = serverReportDir + '/unit/server_report.xml';
                        return 'mocha-jenkins-reporter';
                    }())
                },
                src    : ['server/**/test/' + mochaUnitTest]
            },

            testGen: {
                options: {
                    reporter: (function() {
                        process.env.MOCHA_COLORS = useColors;
                        process.env.JUNIT_REPORT_PATH = serverReportDir + '/unit/testGen_report.xml';
                        return 'mocha-jenkins-reporter';
                    }())
                },
                src    : ['server/**/test/' + mochaUnitTest]
            },

            integration: {
                options: {
                    //log in test results in red any node integration tests over slow amount below which in milliseconds
                    slow    : 400,
                    reporter: (function() {
                        process.env.MOCHA_COLORS = useColors;
                        process.env.JUNIT_REPORT_PATH = serverReportDir + '/integration/server_report.xml';
                        return 'mocha-jenkins-reporter';
                    }())
                },
                src    : ['server/**/test/' + mochaIntTest]
            }

        },

        //  Code coverage against the express code
        mocha_istanbul: {
            coverage: {
                src    : ['server/**/test/*.unit.spec.js'],
                options: {
                    mask          : '**/*.spec.js',
                    root          : 'server',
                    noColors      : !useColors,
                    reportFormats : ['lcov'],
                    coverageFolder: 'build/reports/server/coverage'
                }
            }
        },

        protractor: {
            sauce_linux_chrome : {
                options: {
                    configFile: './e2e/config/sauce.chrome.linux.protractor.conf.js',
                    baseUrl   : baseUrl
                }
            },
            sauce_linux_firefox: {
                options: {
                    configFile: './e2e/config/sauce.firefox.linux.protractor.conf.js',
                    baseUrl   : baseUrl
                }
            },
            local              : {
                options: {
                    configFile: './e2e/config/local.protractor.conf.js'
                }
            }
        },

        env: {
            test : {
                NODE_ENV                    : 'test',
                NODE_TLS_REJECT_UNAUTHORIZED: 0,
                ENV_TUNNEL_NAME             : tunnelIdentifier,
                SAUCE_JOB_NAME              : sauceJobName,
                SAUCE_KEY                   : sauceKey,
                //for the test env, we need to thwart the proxy
                http_proxy                  : '',
                //for the test env, we need to thwart the proxy
                https_proxy                 : ''
            },
            e2e  : {
                NODE_ENV                    : 'test',
                NODE_TLS_REJECT_UNAUTHORIZED: 0,
                ENV_TUNNEL_NAME             : tunnelIdentifier,
                SAUCE_JOB_NAME              : sauceJobName,
                SAUCE_KEY: sauceKey
            },
            prod : {
                NODE_ENV       : 'production',
                ENV_TUNNEL_NAME: tunnelIdentifier,
                SAUCE_JOB_NAME : sauceJobName,
                SAUCE_KEY      : sauceKey
            },
            local: {
                NODE_ENV                    : 'local',
                NODE_TLS_REJECT_UNAUTHORIZED: 0,
                ENV_TUNNEL_NAME             : tunnelIdentifier,
                SAUCE_JOB_NAME              : sauceJobName,
                SAUCE_KEY                   : sauceKey,
                DOMAIN                      : baseUrl
            }
        },

        compass: {
            options: {
                config: 'config.rb'
            },
            //  set the run-time environment for config.rb
            dist   : {
                options: {
                    environment: 'production'
                }
            },
            dev    : {
                options: {
                    environment: 'development'
                }
            }
        }
    });


    grunt.registerTask('fixCoveragePaths', function() {
        // Workaround: The lcov report generated by karma-coverage for clientside js code
        // does not contain the absolute path and thus sonar cannot use the report file
        // for coverage, an issue is open on this https://github.com/karma-runner/karma/issues/528
        // meanwhile we can workaround it by fixing the paths in the client coverage file
        var clientCoverageReport = clientReportDir + '/coverage/lcov.info';
        var absoluteFilePrefix = 'SF:' + __dirname + '/';
        if (grunt.file.exists(clientCoverageReport)) {
            var lcovString = grunt.file.read(clientCoverageReport);
            var newLcovString = lcovString.replace(/SF\:\.\//g, absoluteFilePrefix);
            grunt.file.write(clientCoverageReport, newLcovString);
        }

    });

    // Used for delaying livereload until after server has restarted
    grunt.registerTask('wait', function() {
        grunt.log.ok('Waiting for server reload...');

        var done = this.async();

        setTimeout(function() {
            grunt.log.writeln('Done waiting!');
            done();
        }, 1500);
    });

    grunt.registerTask('clean-up', 'Clean build and distribution folders', function(target) {
        if (target === 'dist') {
            return grunt.task.run([
                'clean:dist']);
        }
        if (target === 'client') {
            return grunt.task.run([
                'clean:client']);
        }
        if (target === 'server') {
            return grunt.task.run([
                'clean:server']);
        }
        grunt.task.run([
            'clean:client',
            'clean:server',
            'clean:dist'
        ]);
    });

    grunt.registerTask('compass-compile', 'Compass compile', function() {
        grunt.task.run([
            'compass:dev'
        ]);
    });
    grunt.registerTask('compass-watch', 'Compass watch', function() {
        grunt.task.run([
            'watch:sass'
        ]);
    });

    grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
        this.async();
    });

    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run([
                'build',
                'express:prod',
                'wait',
                'open',
                'express-keepalive']);
        }

        if (target === 'debug') {
            return grunt.task.run([
                'clean:server',
                'env:local',
                'concurrent:server',
                'wiredep:app',
                'autoprefixer',
                'concurrent:debug'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'env:local',
            'concurrent:server',
            'wiredep:app',
            'autoprefixer',
            'express:local',
            'wait',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('server', function() {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('fixCoveragePaths', function() {
        // Workaround: The lcov report generated by karma-coverage for clientside js code
        // does not contain the absolute path and thus sonar cannot use the report file
        // for coverage, an issue is open on this https://github.com/karma-runner/karma/issues/528
        // meanwhile we can workaround it by fixing the paths in the client coverage file
        var clientCoverageReport = clientReportDir + '/coverage/lcov.info';
        var absoluteFilePrefix = 'SF:' + __dirname + '/';
        if (grunt.file.exists(clientCoverageReport)) {
            var lcovString = grunt.file.read(clientCoverageReport);
            var newLcovString = lcovString.replace(/SF\:\.\//g, absoluteFilePrefix);
            grunt.file.write(clientCoverageReport, newLcovString);
        }
    });

    grunt.registerTask('setEnv', function(envName, envVal) {
        process.env[envName] = envVal;
    });

    grunt.registerTask('codeStandards', [
        'jshint',
        'jscs'
    ]);

    grunt.registerTask('testClientOnly', function() {
        grunt.task.run(['jshint:client', 'jscs:client', 'karma:unit']);
    });


    grunt.registerTask('test', function(target) {
        //  need this folder to exist or mocha tests will fail
        grunt.file.mkdir(serverReportDir + '/unit/');
        grunt.file.mkdir(serverReportDir + '/integration/');

        //  If the run-time environment variable is not set, will set to local
        //  but only if the file is defined (which should be only on a developer's machine).
        if (!process.env.NODE_ENV) {
            if (grunt.file.exists(localJsFile)) {
                grunt.task.run(['env:local']);
            }
        }

        if (target === 'server') {
            //server unit tests
            return grunt.task.run([
                'clean:server',
                'setEnv:NODE_TLS_REJECT_UNAUTHORIZED:0',
                'mochaTest:test',
            ]);
        }
        if (target === 'testGen') {
            //testGen unit tests
            return grunt.task.run([
                'mochaTest:testGen'
            ]);
        }
        if (target === 'coverage') {
            //server unit tests
            return grunt.task.run([
                'clean:server',
                'setEnv:NODE_TLS_REJECT_UNAUTHORIZED:0',
                'mocha_istanbul:coverage'
            ]);
        }
        if (target === 'integration') {
            //server integration tests
            return grunt.task.run([
                'codeStandards',
                'clean:server',
                'mochaTest:integration',
            ]);
        }
        if (target === 'client') {
            //client unit tests
            return grunt.task.run([
                'clean:client',
                'concurrent:test',
                'autoprefixer',
                'wiredep:test',
                'karma:unit',
                'fixCoveragePaths'
            ]);
        }

        if (target === 'e2e') {
            return grunt.task.run([
                'env:e2e',
                'sauce_connect',
                'protractor:sauce_linux_chrome',
                'sauce-connect-close'
            ]);
        }

        if (target === 'e2eLocal') {
            return grunt.task.run([
                'clean:server',
                'concurrent:test',
                'wiredep:app',
                'autoprefixer',
                'protractor:local',
            ]);
        }

        //  default task if no target specified
        return grunt.task.run([
            // run lint and coding standards tests
            'codeStandards',
            // run unit tests
            'test:client',
            'test:server',
        ]);

    });


    grunt.registerTask('testIntegration', function() {
        grunt.task.run(['test:integration']);
    });


    grunt.registerTask('testE2ELocal', function() {
        grunt.task.run(['test:e2eLocal']);
    });

    grunt.registerTask('testE2E', function() {
        grunt.task.run(['test:e2e']);
    });

    grunt.registerTask('ciTest', [
        'env:test',
        'test'
    ]);


    grunt.registerTask('ciIntegration', [
        'env:test',
        'test:integration'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:dist',
        'wiredep:app',
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
        'newer:jscs',
        'test',
        'build'
    ]);

    /* global console:true */
    grunt.registerTask('sauce_connect', 'Grunt plug-in to download and launch Sauce Labs Sauce Connect', function() {
        var options = this.options({
            username        : 'sbg_qbse',
            accessKey       : sauceKey,
            proxy           : httpProxy,
            tunnelIdentifier: tunnelIdentifier,
            verbose         : grunt.option('verbose') === true,
            logger          : console.log
        });

        var done = this.async();

        var tunnel = {};
        sauceConnect.setOptions(options);

        grunt.log.writeln('Found tunnelIdentifier: ' + options.tunnelIdentifier);

        if (tunnel.process) {
            grunt.log.writeln('Existing'.cyan + ' Sauce Connect tunnel: ' + tunnel.tid);
            sauceConnect.close(sauceConnect.open(done));
        } else {
            tunnel = sauceConnect.open(done);
        }
    });

    grunt.registerTask('sauce-connect-close', 'Closes the current Sauce Connect tunnel', function() {
        sauceConnect.close(this.async());
    });

    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-jshint');

};
