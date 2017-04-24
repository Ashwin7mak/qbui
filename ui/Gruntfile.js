/* eslint-disable babel/no-invalid-this */

//
//
var path = require('path');


module.exports = function(grunt) {
    'use strict';

    var currentDateTime = new Date().getTime();
    // Select a random port number for sauce labs to launch selenium at (prevents concurrency issues in CI builds)
    var seleniumPort = Math.floor(Math.random() * 100) + 4400;

    var baseUrl = grunt.option('baseUrl') || 'http://localhost:9000';
    var buildDir = path.join(__dirname, '/build');
    var localJsFilePath = path.join(__dirname, '/server/src/config/environment/local.js');

    // For the Protractor tests we need to import the node config files (one for local, one for CI)
    // This way when Protractor starts node it can read in what domain node is started at
    var testJsConfig = require('./server/src/config/environment/test.js');

    var serverReportDir = buildDir + '/reports/server';
    var clientReportDir = buildDir + '/reports/client';
    var reuseReportDir = buildDir + '/reports/reuse';
    var governanceReportDir = buildDir + '/reports/governance';

    var mochaUnitTest = grunt.option('test') || '*.unit.spec.js';
    var mochaIntTest = grunt.option('test') || '*.integration.spec.js';

    //  If the run-time environment variable is not set, will set to a local environment
    //  configuration file, BUT ONLY if one is found....which should mean we are on a
    //  developer's machine.
    //
    //  NOTE: this needs to get checked/set prior to the sauce labs setup.
    //
    if (!process.env.NODE_ENV) {
        if (grunt.file.exists(localJsFilePath)) {
            grunt.log.writeln('NODE_ENV not set...defaulting to LOCAL.');
            process.env.NODE_ENV = 'local';
        }
    }

    grunt.log.writeln('NODE_ENV: ' + process.env.NODE_ENV);

    // Used as an option for e2e try builds to pass in a custom browser config file
    var wdioSauceConfig = grunt.option('wdioSauceConfig') || 'wdioSauce.conf.js';

    var sauceDns = grunt.option('sauceDns') || '127.0.0.1';
    var sauceJobName = grunt.option('sauceJobName') || 'e2e_' + currentDateTime;
    var sauceKey = grunt.option('sauceKey');

    var tunnelIdentifier = grunt.option('tunnelIdentifier') || 'default_tunnel_' + currentDateTime;
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
        bldinfo : {
            JOB_NAME : (process.env.JOB_NAME ? (process.env.JOB_NAME) : ''),
            GIT_BRANCH : (process.env.GIT_BRANCH ? (process.env.GIT_BRANCH) : ''),
            GIT_UIBRANCH : (process.env.GIT_UIBRANCH ? (process.env.GIT_UIBRANCH) : ''),
            BUILD_NUMBER : (process.env.BUILD_NUMBER ? (process.env.BUILD_NUMBER) : ''),
        },
        vendorDir : 'vendor',
        express  : {
            root   : 'server',
            options: {
                debug  : true,
                port   : 9000,
                sslPort: 9443,
                host   : process.env.HOST || 'localhost',
                script : '<%= express.root %>/src/app.js',
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
                    script  : '<%= quickbase.distDir %>/<%= express.root %>/src/app.js',
                    node_env: 'production'
                }
            },
            test   : {
                options: {
                    script  : '<%= quickbase.distDir %>/<%= express.root %>/src/app.js',
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
                    '<%= express.root %>/**/*.{js,json,jsx}',
                    '<%= quickbase.commonDir %>/src/**/*'
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
            reuse: {
                files: [{
                    dot: true,
                    src: [
                        reuseReportDir + '/coverage/*',
                        reuseReportDir + '/unit/*'
                    ]
                }]
            },
            governance: {
                files: [{
                    dot: true,
                    src: [
                        governanceReportDir + '/coverage/*',
                        governanceReportDir + '/unit/*'
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
                script : '<%= express.root %>/src/app.js',
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
                            '<%= express.root %>/src/**/*'
                        ]
                    },
                    {
                        expand: true,
                        dest  : '<%= quickbase.distPublic %>',
                        src   : [
                            '<%= vendorDir %>/**/*'
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
                browsers: ["PhantomJS_Desktop"],
                // browsers: ["HeadlessChrome"],
                singleRun : true
            },
            devunit: {
                browsers: ["Chrome"],
                // browsers: ["HeadlessChrome"],
                singleRun : false
            },
            governance: {
                configFile: './governance/governance.karma.conf.js',
                browsers: ["PhantomJS_Desktop"],
                // browsers: ["HeadlessChrome"],
                singleRun : true
            },
            reuse: {
                configFile: './reuse/reuse.karma.conf.js',
                browsers: ["PhantomJS_Desktop"],
                // browsers: ["HeadlessChrome"],
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
                src    : ['server/test/**/' + mochaUnitTest]
            },

            testGen: {
                options: {
                    reporter: (function() {
                        process.env.MOCHA_COLORS = useColors;
                        process.env.JUNIT_REPORT_PATH = serverReportDir + '/unit/testGen_report.xml';
                        return 'mocha-jenkins-reporter';
                    }())
                },
                src    : ['server/test/**/' + mochaUnitTest]
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
                src    : ['server/test/**/' + mochaIntTest]
            }
        },

        //  Code coverage against the express code
        mocha_istanbul: {
            coverage: {
                src    : ['server/test', 'common/test'],
                options: {
                    check: {
                        statements: 90,
                        branches: 80,
                        functions: 80,
                        lines: 90
                    },
                    mask          : '**/*.unit.spec.js',
                    root          : '.',
                    excludes      : ['server/src/api/quickbase/mock/mockFeatureSwitchesApi.js'],
                    noColors      : !useColors,
                    reportFormats : ['lcov'],
                    coverageFolder: 'build/reports/server/coverage'
                }
            },
            integration_coverage: {
                src    : ['server/test/api'],
                options: {
                    mask          : '**/*.integration.spec.js',
                    root          : 'server/src/api',
                    includes      : ['server/src/api/**/.js'],
                    noColors      : !useColors,
                    reportFormats : ['lcov'],
                    coverageFolder: 'build/reports/integration/coverage',
                    reporter: (function() {
                        process.env.MOCHA_COLORS = useColors;
                        process.env.JUNIT_REPORT_PATH = serverReportDir + '/integration/server_report.xml';
                        return 'mocha-jenkins-reporter';
                    }())
                }
            }
        },

        protractor: {
            // Used for the try-ui-e2e CI job
            sauce_multi_browser : {
                options: {
                    configFile: './e2e/config/sauceLabs/sauce.multi.browser.protractor.conf.js',
                    args: {
                        baseUrl   : testJsConfig.DOMAIN,
                        sauceSeleniumAddress : 'localhost:' + seleniumPort + '/wd/hub'
                    }
                }
            },
            // Used for the production smoke test CI job
            sauce_production : {
                options: {
                    configFile: './e2e/config/sauceLabs/sauce.production.protractor.conf.js',
                    args: {
                        baseUrl   : testJsConfig.DOMAIN,
                        sauceSeleniumAddress : 'localhost:' + seleniumPort + '/wd/hub'
                    }
                }
            },
            // Used for running e2e tests locally
            local              : {
                options: {
                    configFile: './e2e/config/local.protractor.conf.js',
                    args: {
                        baseUrl   : baseUrl
                    }
                }
            },
            // Used for running e2e tests in sauce labs against your local dev env
            local_sauce              : {
                options: {
                    configFile: './e2e/config/local.sauce.protractor.conf.js',
                    args: {
                        baseUrl   : baseUrl,
                        sauceSeleniumAddress : 'localhost:' + seleniumPort + '/wd/hub'
                    }
                }
            },
            // Used for running dataGen scripts on your local dev env
            local_data_gen : {
                options: {
                    configFile: './e2e/config/local.dataGen.protractor.conf.js',
                    args: {
                        baseUrl   : baseUrl
                    }
                }
            }
        },

        // Uses the grunt-webdriver node module to execute WebdriverIO E2E tests
        //TODO: Figure out how to define multiple 'webdriver' tasks
        webdriver: {
            options: {
                exclude: [
                    // reportAddRecord is currently broken on Reactabular, the save and add a new row button for inline editing has been disabled
                    // this bug is logged in reactabular backlog under https://quickbase.atlassian.net/browse/MB-2115
                    // because the save and add button is disabled we turned off the reportAddRecord test
                    // we will turn it back on once this button has been enabled again
                    './wdio/tests/reports/reportAddRecord.e2e.spec.js',
                    // disabling formPermissionsViewerRole test as after moving to ExperienceEngine,
                    // permissions for viewer are not working correctly
                    //TODO MC-2105 should be fixed to enable permissions on forms
                    './wdio/tests/forms/formPermissionsViewerRole.e2e.spec.js',
                    './wdio/tests/forms/formPermissionsParticipantRole.e2e.spec.js',
                    // currently intermittently broken in CI need to fix in another PR
                    './wdio/tests/forms/formDragDrop.e2e.spec.js',
                    './wdio/tests/reports/reportTable.e2e.spec.js',
                    './wdio/tests/reports/grouping/reportGroupingViaColumnHeader.e2e.spec.js',
                    './wdio/tests/reports/sorting/reportSortingViaColumnHeader.e2e.spec.js',
                    './wdio/tests/relationships/relationshipViewChildTable.e2e.spec.js'
                ],
                suites: {
                    reports: [
                        './wdio/tests/reports/*.e2e.spec.js',
                        './wdio/tests/reports/sorting/*.e2e.spec.js',
                        './wdio/tests/reports/grouping/*.e2e.spec.js'
                    ],
                    forms: [
                        './wdio/tests/forms/*.e2e.spec.js'
                    ],
                    tables: [
                        './wdio/tests/tables/*.e2e.spec.js'
                    ],
                    relationships: [
                        './wdio/tests/relationships/*.e2e.spec.js'
                    ]
                }
            },
            test: {
                // Use the wdioSauce.conf.js file setting the options above
                configFile: './wdio/config/' + wdioSauceConfig,
                // Make sure there are no spaces between test suites here
                suite: 'reports,forms,tables'
            }
        },

        env: {
            test : {
                NODE_ENV                    : 'test',
                NODE_TLS_REJECT_UNAUTHORIZED: 0,
                ENV_TUNNEL_NAME             : tunnelIdentifier,
                SAUCE_JOB_NAME              : sauceJobName,
                SAUCE_KEY                   : sauceKey,
                SAUCE_DOMAIN                : testJsConfig.DOMAIN
            },
            e2e  : {
                NODE_ENV                    : 'e2e',
                NODE_TLS_REJECT_UNAUTHORIZED: 0,
                ENV_TUNNEL_NAME             : tunnelIdentifier,
                SAUCE_DNS                   : sauceDns,
                SAUCE_JOB_NAME              : sauceJobName,
                SAUCE_KEY                   : sauceKey
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
                    username        : 'QuickBaseNS',
                    accessKey       : sauceKey,
                    proxy           : httpProxy,
                    tunnelIdentifier: tunnelIdentifier,
                    verbose         : true,
                    logger          : console.log,
                    dns             : sauceDns,
                    port            : seleniumPort
                }
            },
            aws: {
                options: {
                    username        : 'QuickBaseNS',
                    accessKey       : sauceKey,
                    //proxy           : 'egressproxy.quickbaserocks.com:80',
                    tunnelIdentifier: tunnelIdentifier,
                    //proxyTunnel     : true,
                    verbose         : true,
                    logfile         : 'sauceConnect.log',
                    port            : seleniumPort
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
            nodeVer: {
                command: 'node -v',
                options: {
                    execOptions: {}
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
                    //print out  the time of this build, include eastern time for convenience
                    ' printf "<%= grunt.template.today("dddd, mmmm d yyyy, hh:MM:ss TT Z") %>\n"  > <%= quickbase.client.gen %>/buildBranchInfo.txt ',
                    ' [[ $(date +%Z) != E* ]] && TZ=":America/New_York" date "+%A, %B %d %Y, %I:%M:%S %p %Z" >> <%= quickbase.client.gen %>/buildBranchInfo.txt ||: ',

                    //print out the CI Job name and build number if available
                    ' [[ "<%= bldinfo.JOB_NAME %>" ]] && printf "Job Name: <%= bldinfo.JOB_NAME %>\n" >> <%= quickbase.client.gen %>/buildBranchInfo.txt ||: ',
                    ' [[ "<%= bldinfo.BUILD_NUMBER %>" ]] && printf "BUILD_NUMBER: <%= bldinfo.BUILD_NUMBER %> \n">> <%= quickbase.client.gen %>/buildBranchInfo.txt ||: ',

                    //print out the git branch name from env var or use git rev-parse if none
                    ' printf "GIT_BRANCH: " >> <%= quickbase.client.gen %>/buildBranchInfo.txt ',
                    ' [[ "<%= bldinfo.GIT_BRANCH %>" ]] && printf "<%= bldinfo.GIT_BRANCH %>\n" >> <%= quickbase.client.gen %>/buildBranchInfo.txt ||: ',
                    ' [[ !"<%= bldinfo.GIT_BRANCH %>" ]] && git rev-parse --abbrev-ref HEAD >> <%= quickbase.client.gen %>/buildBranchInfo.txt ||: ',

                    //print out the current git revision short id
                    ' printf "GIT Revision: "  >> <%= quickbase.client.gen %>/buildBranchInfo.txt ',
                    ' git rev-parse --verify HEAD --short >> <%= quickbase.client.gen %>/buildBranchInfo.txt ',

                    //console log whats went into the buildBranchInfo.txt file
                    ' cat <%= quickbase.client.gen %>/buildBranchInfo.txt'
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

    // Load and register custom external grunt scripts
    // All grunt tasks in ../scripts/gruntTasks will be loaded/registered
    grunt.loadTasks('./gruntTasks');

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
        if (target === 'reuse') {
            return grunt.task.run([
                'clean:reuse']);
        }
        if (target === 'governance') {
            return grunt.task.run([
                'clean:governance']);
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
                'shell:webpack',
                'env:test',
                'express:test',
                'wait',
                'express-keepalive'
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

    grunt.registerTask('setEnv', function(envName, envVal) {
        process.env[envName] = envVal;
        updateClientRoot();
    });

    grunt.registerTask('codeStandards', [
        'lint',
        'lintStyles'
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

        if (target === 'integration_coverage') {
            //server integration tests
            return grunt.task.run([
                'codeStandards',
                'clean:server',
                'mocha_istanbul:integration_coverage'
            ]);
        }

        if (target === 'client') {
            return grunt.task.run([
                'clean:client',
                'autoprefixer',
                'karma:unit'
            ]);
        }

        if (target === 'reuse') {
            return grunt.task.run([
                'clean:reuse',
                'autoprefixer',
                'karma:reuse'
            ]);
        }

        if (target === 'governance') {
            return grunt.task.run([
                'clean:governance',
                'autoprefixer',
                'karma:governance'
            ]);
        }

        // Run your protractor tests locally against your dev env
        if (target === 'e2eLocal') {
            return grunt.task.run([
                'env:e2e',
                'clean:server',
                'autoprefixer',
                'protractor:local'
            ]);
        }

        // Run a protractor spec file that will generate you a ticket, realm and app in your local dev
        if (target === 'e2eLocalDataGen') {
            return grunt.task.run([
                'env:e2e',
                'clean:server',
                'autoprefixer',
                'protractor:local_data_gen'
            ]);
        }

        // Run your protractor tests in Sauce Labs against your local dev env
        if (target === 'e2eLocalSauce') {
            return grunt.task.run([
                'env:e2e',
                'sauce_connect:local',
                'protractor:local_sauce',
                'sauce-connect-close'
            ]);
        }

        // Run your protractor tests via Sauce Labs against a local stack in the CI env
        // Currently used for e2e try job
        if (target === 'e2eAWSSauce') {
            return grunt.task.run([
                'env:test',
                'sauce_connect:aws',
                'protractor:sauce_multi_browser'
            ]);
        }

        // Run the protractor e2e smoke test on Sauce Labs against QuickBase production
        // Currently used for e2e smoke test job in Jenkins
        if (target === 'e2eProdSauce') {
            return grunt.task.run([
                'env:test',
                'sauce_connect:aws',
                'protractor:sauce_production'
            ]);
        }

        // Run your webdriverIO tests via Sauce Labs against a local stack in the CI env
        // Currently used for e2e-webdriverIO try job
        if (target === 'e2eWebdriver') {
            return grunt.task.run([
                'env:test',
                'webdriver'
            ]);
        }

        //  default task if no target specified
        return grunt.task.run([
            // run lint and coding standards tests
            'codeStandards',
            // run unit tests
            'test:client',
            'test:governance',
            'test:reuse',
            'test:coverage' // server with coverage
        ]);

    });

    grunt.registerTask('testIntegration', function() {
        grunt.task.run(['test:integration']);
    });

    grunt.registerTask('testIntegrationCoverage', function() {
        grunt.task.run(['test:integration_coverage']);
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

    grunt.registerTask('ciIntegrationCoverage', [
        'env:test',
        'test:integration_coverage'
    ]);

    grunt.registerTask('logGitState', 'output Git branch state to file', function() {
        return grunt.task.run([
            'shell:gitState'
        ]);
    });

    grunt.registerTask('build', [
        'shell:nodeVer',
        'clean:dist',
        'webpackbuild',
        'copy:reactDist'
    ]);

    grunt.registerTask('default', [
        'newer:lint',
        'test',
        'build'
    ]);

    grunt.registerTask('lint', 'Run eslint and stylelint on code', function() {
        return grunt.task.run([
            'shell:lint'
        ]);
    });

    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-sauce-connect-launcher');
    grunt.loadNpmTasks('grunt-webdriver');
};
