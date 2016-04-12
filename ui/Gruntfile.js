//
//
var path = require('path');

/*eslint-disable no-invalid-this */

module.exports = function(grunt) {
    'use strict';

    var currentDateTime = new Date().getTime();

    var baseUrl = grunt.option('baseUrl') || 'http://localhost:9000';
    var buildDir =  path.join(__dirname, '/build');
    var localJsFile =  path.join(__dirname, '/server/config/environment/local.js');

    var serverReportDir = buildDir + '/reports/server';
    var clientReportDir = buildDir + '/reports/client';

    var mochaUnitTest = grunt.option('test') || '*.unit.spec.js';
    var mochaIntTest = grunt.option('test') || '*.integration.spec.js';

    //  If the run-time environment variable is not set, will set to a local environment
    //  configuration file, BUT ONLY if one is found....which should mean we are on a
    //  developer's machine.
    //
    //  NOTE: this needs to get checked/set prior to the sauce labs setup.
    //
    if (!process.env.NODE_ENV) {
        if (grunt.file.exists(localJsFile)) {
            grunt.log.writeln('NODE_ENV not set...defaulting to LOCAL.');
            process.env.NODE_ENV = 'local';
        }
    }

    grunt.log.writeln('NODE_ENV: ' + process.env.NODE_ENV);

    var sauceDns = grunt.option('sauceDns') || '127.0.0.1';
    var sauceJobName = grunt.option('sauceJobName') || 'e2e_' + currentDateTime;
    var sauceKey = grunt.option('sauceKey');

    var tunnelIdentifier = grunt.option('tunnelIdentifier') || 'tunnel_' + currentDateTime;
    //We need to pass along --proxy-tunnel so that the tunnel will also use the proxy to communicate with the sauce apis
    //sauce-connect-launcher won't take an explicit no arg argument, so we are "leveraging" their mechanism for passing
    //arguments along to sauce-connect-launcher
    var httpProxy = grunt.option('httpProxyHost') !== undefined ? grunt.option('httpProxyHost') + ':80 --proxy-tunnel' : null;
    var useColors = grunt.option('colors') || false;

    //  webpack is our module builder
    var webpack = require('webpack');
    var webpackConfig = require('./webpack.config.js');

    // define the source client(REACT) folder hierarchy...
    function updateClientRoot() {
        var clientRoot = 'client-react';
        var folderHierarchy = {
            root : clientRoot,
            components: clientRoot + '/src',
            assets    : clientRoot + '/src/assets',
            src    : clientRoot + '/src',
            gen    : clientRoot + '/dist'
        };

        var msg = 'clientRoot' + JSON.stringify(folderHierarchy);
        grunt.log.writeln(msg);

        return folderHierarchy;
    }

    // Load grunt tasks automatically, when needed
    require('jit-grunt')(grunt, {
        express      : 'grunt-express-server',
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
            client    : updateClientRoot(), // 'client',
            e2e       : 'e2e',
            //  dist contains the target folders of the build
            distDir   : 'dist',
            commonDir   : 'common',
            distPublic: 'dist/public'
        },
        express  : {
            root   : 'server',
            options: {
                debug  : true,
                port   : 9000,
                sslPort: 9443,
                host   : process.env.HOST || 'localhost',
                script : '<%= express.root %>/app.js',
                realm : process.env.REALM ? (process.env.REALM + '.') : ''
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
                url: 'http://<%= express.options.realm %><%= express.options.host %>:<%= express.options.port %>'
            }
        },
        watch    : {
            mochaTest : {
                files: ['<%= express.root %>/**/*.spec.js',
                    '<%= express.root %>/**/test/**/*.js',
                    '<%= express.root %>/**/*.js'
                ],
                tasks: ['env:local', 'newer:lint', 'mochaTest:test']
            },
            jsTest    : {
                files: [
                    '<%= quickbase.client.components %>/**/*.spec.js',
                    '<%= quickbase.client.components %>/**/*.mock.js',
                    '<%= quickbase.client.components %>/**/test/**/*.js',
                    '<%= quickbase.client.components %>/**/*.js'
                ],
                tasks: ['newer:hint', 'karma:unit']
            },
            livereload: {
                files  : [
                    '{.tmp,<%= quickbase.client.components %>}/**/*.css',
                    '{.tmp,<%= quickbase.client.assets %>}/**/*.css',
                    '{.tmp,<%= quickbase.client.components %>}/**/*.html',
                    '{.tmp,<%= quickbase.client.components %>}/**/*.js',
                    '<%= quickbase.client.gen %>/**/*.js',
                    '!{.tmp,<%= quickbase.client.components %>}**/*.spec.js',
                    '!{.tmp,<%= quickbase.client.components %>}/**/*.mock.js',
                    '<%= quickbase.client.components %>/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= quickbase.client.assets %>/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}',
                    'Gruntfile.js'
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
            reactapp: {
                files: ['Gruntfile.js', '<%= quickbase.client.src %>/**/*'],
                tasks: ['webpack-dev-server'],
                options: {
                    spawn: false
                }
            }
        },


        // Empties folders to start fresh
        clean: {
            dist  : {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= quickbase.client.gen %>/*',
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
            },
            modulesProd: {
                files: [{
                    dot: true,
                    src: [
                        '<%= quickbase.distDir %>/node_modules/*'
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

        // Copies remaining files to places other tasks can use
        copy: {
            styles: {
                expand: true,
                cwd   : ['<%= quickbase.client.assets %>/'],
                dest  : '.tmp/',
                src   : ['**/*.css']
            },
            modulesProd : {
                expand: true,
                cwd   : 'node_modules',
                src   : ['**/*'],
                dest   :'<%= quickbase.distDir %>/node_modules'
            },
            reactDist : {
                files: [
                    {
                        expand : true,
                        dot   : true,
                        cwd   : '<%= quickbase.client.root %>',
                        dest  : '<%= quickbase.distPublic %>',
                        src   : [
                            '*.{ico,png,txt}',
                            'dist/**/*',
                            'index.html'
                        ]
                    },
                    {
                        expand: true,
                        dest  : '<%= quickbase.distDir %>',
                        src   : [
                            'package.json',
                            '<%= express.root %>/**/*'
                        ]
                    },
                    {
                        expand: true,
                        dest  : '<%= quickbase.distDir %>',
                        src   : [
                            '<%= quickbase.commonDir %>/src/**/*'
                        ]
                    }
                ]
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
            debug : {
                tasks  : [
                    'nodemon',
                    'node-inspector'
                ],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        // Karma tests..use configuration file to determine what is run
        karma: {
            options: {
                colors    : useColors,
                configFile: 'karma.conf.js'
            },
            unit: {
                browsers: ["PhantomJS"],
                singleRun : true
            },
            devunit: {
                browsers: ["Chrome"],
                singleRun : false
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
                src    : ['server/**/test/*.unit.spec.js', 'common/**/test/*.unit.spec.js'],
                options: {
                    mask          : '**/*.spec.js',
                    root          : '.',
                    noColors      : !useColors,
                    reportFormats : ['lcov'],
                    coverageFolder: 'build/reports/server/coverage'
                }
            }
        },

        protractor: {
            sauce_osx_chrome : {
                options: {
                    configFile: './e2e/config/sauceLabs/sauce.chrome.osx.protractor.conf.js',
                    args: {
                        baseUrl   : baseUrl
                    }
                }
            },
            sauce_win7_chrome : {
                options: {
                    configFile: './e2e/config/sauceLabs/sauce.chrome.win7.protractor.conf.js',
                    args: {
                        baseUrl   : baseUrl
                    }
                }
            },
            sauce_linux_chrome : {
                options: {
                    configFile: './e2e/config/sauceLabs/sauce.chrome.linux.protractor.conf.js',
                    args: {
                        baseUrl   : baseUrl
                    }
                }
            },
            sauce_linux_firefox : {
                options: {
                    configFile: './e2e/config/sauceLabs/sauce.firefox.linux.protractor.conf.js',
                    args: {
                        baseUrl   : baseUrl
                    }
                }
            },
            sauce_multi_browser : {
                options: {
                    configFile: './e2e/config/sauceLabs/sauce.multi.browser.protractor.conf.js',
                    args: {
                        baseUrl   : baseUrl
                    }
                }
            },
            local              : {
                options: {
                    configFile: './e2e/config/local.protractor.conf.js',
                    args: {
                        baseUrl   : baseUrl
                    }
                }
            },
            local_sauce              : {
                options: {
                    configFile: './e2e/config/local.sauce.protractor.conf.js',
                    args: {
                        baseUrl   : baseUrl
                    }
                }
            },
            local_data_gen : {
                options: {
                    configFile: './e2e/config/local.dataGen.protractor.conf.js',
                    args: {
                        baseUrl   : baseUrl
                    }
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
                SAUCE_DNS                   : sauceDns,
                SAUCE_JOB_NAME              : sauceJobName,
                SAUCE_KEY                   : sauceKey,
                DOMAIN                      : baseUrl
            }
        },

        sauce_connect: {
            local: {
                options: {
                    username        : 'sbg_qbse',
                    accessKey       : sauceKey,
                    proxy           : httpProxy,
                    tunnelIdentifier: tunnelIdentifier,
                    verbose         : grunt.option('verbose') === true,
                    logger          : console.log,
                    dns             : sauceDns
                }
            },
            aws: {
                options: {
                    username        : 'sbg_qbse',
                    accessKey       : sauceKey,
                    proxy           : httpProxy,
                    tunnelIdentifier: tunnelIdentifier,
                    verbose         : grunt.option('verbose') === true,
                    logger          : console.log
                }
            }
        },

        shell: {
            lint: {
                // Make sure code styles are up to par and there are no obvious mistakes
                command: 'npm run lint',
                options: {
                    execOptions: {
                    }
                }
            },
            lintFix: {
                // Make sure code styles are up to par and there are no obvious mistakes
                //fixes any fixables i.e. spacing, missing semicolon etc
                // see (fixables) in the list http://eslint.org/docs/rules/
                command: 'npm run lintFix',
                options: {
                    execOptions: {
                    }
                }
            },
            webpack: {
                command: 'npm run webpack',
                options: {
                    execOptions: {
                    }
                }
            },
            modulesPrune: {
                command: 'npm prune --production',
                options: {
                    execOptions: {
                        cwd : '<%= quickbase.distDir %>'
                    }
                }
            },
            rebuild: {
                command: [
                    'npm rebuild node-sass',
                    'npm install node-sass'
                ],
                options: {
                    execOptions: {
                    }
                }
            },
            gitState : {
                command: [
                    'git rev-parse --abbrev-ref HEAD > <%= quickbase.client.gen %>/buildBranchInfo.txt',
                    'git rev-parse --verify HEAD --short >> <%= quickbase.client.gen %>/buildBranchInfo.txt',
                    //'git status --porcelain -b -s  >> <%= quickbase.client.gen %>/buildBranchInfo.txt',
                    'echo <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>  >> <%= quickbase.client.gen %>/buildBranchInfo.txt',
                    'cat <%= quickbase.client.gen %>/buildBranchInfo.txt'
                ].join('&&')
            },
            options: {
                stdout: true,
                stderr: true,
                failOnError: true
            }
        },
        webpack : {
            options    : webpackConfig,
            build      : {
                plugins: webpackConfig.plugins.concat(
                    new webpack.DefinePlugin({
                        'process.env': {
                            // This has beneficial effect on the react lib size for deploy
                            NODE_ENV: JSON.stringify('production')
                        }
                    })
                )
            }
        },
        'webpack-dev-server': {
            options: {
                webpack   : webpackConfig,
                contentBase : './<%= quickbase.client.root %>',
                publicPath : '/dist/',
                inline: true,
                hot: true,
                progress: true,
                port: 3000
            },
            start  : {
                keepAlive: true,
                webpack  : {
                    devtool: 'eval',
                    debug  : true
                }
            }
        }
    });
    //------------END OF initConfig

    // Production build
    grunt.registerTask('webpackbuild', ['webpack:build']);

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
            'clean:dist',
            'clean:modulesProd'
        ]);
    });

    grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
        this.async();
    });

    grunt.registerTask('serve', function(target) {
        updateClientRoot();
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
                'autoprefixer',
                'concurrent:debug'
            ]);
        }
        if (target === 'AWSe2e') {
            return grunt.task.run([
                'clean:server',
                'build',
                'env:e2e'
            ]);
        }
        grunt.task.run([
            'clean:server',
            'shell:webpack',
            'env:local',
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
        var absoluteFilePrefix =  path.join('SF:', __dirname, '/');
        if (grunt.file.exists(clientCoverageReport)) {
            var lcovString = grunt.file.read(clientCoverageReport);
            var newLcovString = lcovString.replace(/SF\:\.\//g, absoluteFilePrefix);
            grunt.file.write(clientCoverageReport, newLcovString);
        }
    });

    grunt.registerTask('setEnv', function(envName, envVal) {
        process.env[envName] = envVal;
        updateClientRoot();
    });

    grunt.registerTask('codeStandards', [
        'lint'
    ]);

    grunt.registerTask('testClientOnly', function() {
        grunt.task.run(['lint', 'karma:unit']);
    });


    grunt.registerTask('test', function(target) {
        //  need this folder to exist or mocha tests will fail
        grunt.file.mkdir(serverReportDir + '/unit/');
        grunt.file.mkdir(serverReportDir + '/integration/');

        if (target === 'server') {
            //server unit tests
            return grunt.task.run([
                'clean:server',
                'setEnv:NODE_TLS_REJECT_UNAUTHORIZED:0',
                'mochaTest:test'
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
                'mochaTest:integration'
            ]);
        }

        if (target === 'client-wip') {
            //client unit tests
            return grunt.task.run([
                'clean:client',
                'autoprefixer',
                'karma:unit',
                'fixCoveragePaths'
            ]);
        }

        if (target === 'client') {
            //client dummy placeholder
            return grunt.task.run([
                'clean:client',
                'autoprefixer',
                'karma:unit',
                'fixCoveragePaths'
            ]);
        }

        // Run your protractor tests locally against your dev env
        if (target === 'e2eLocal') {
            return grunt.task.run([
                'clean:server',
                'autoprefixer',
                'protractor:local'
            ]);
        }

        // Run a protractor spec file that will generate you a ticket, realm and app in your local dev
        if (target === 'e2eLocalDataGen') {
            return grunt.task.run([
                'clean:server',
                'autoprefixer',
                'protractor:local_data_gen'
            ]);
        }

        // Run your protractor tests in Sauce Labs against your local dev env
        if (target === 'e2eLocalSauce') {
            return grunt.task.run([
                'env:local',
                'sauce_connect:local',
                'protractor:local_sauce',
                'sauce-connect-close'
            ]);
        }

        // Run your protractor tests via Sauce Labs against an existing AWS swimlane
        if (target === 'e2eAWSSauce') {
            return grunt.task.run([
                'env:e2e',
                'sauce_connect:aws',
                'protractor:sauce_osx_chrome'
            ]);
        }

        //  default task if no target specified
        return grunt.task.run([
            // run lint and coding standards tests
            'codeStandards',
            // run unit tests
            'test:client',
            //'test:server' // no coverage
            'test:coverage' // server with coverage
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

    grunt.registerTask('logGitState', 'output Git branch state to file', function() {
        return grunt.task.run([
            'shell:gitState',
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'webpackbuild',
        'logGitState',
        'copy:reactDist'
    ]);

    grunt.registerTask('default', [
        'newer:lint',
        'test',
        'build'
    ]);

    grunt.registerTask('lint', 'Run eslint on code', function() {
        return grunt.task.run([
            'shell:lint',
        ]);
    });

    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-sauce-connect-launcher');
};
