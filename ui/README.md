
#Introduction

This project has the files needed to startup the node.js express server in support of the Angular QuickBase application.

## UI Project Structure

Overview of the UI directory

    ui
     │
     └─ .tmp                                    - temporary output folder used by build  (not tracked by git)
         │
        client                                  - angular UI client code folder
         │  │
         │  ├── bower_components                - components downloaded by bower
         │  ├── quickbase                       - 1..n quickbase angular modules
         │  │    │
         │  │    ├── assets
         │  │    │    ├──images
         │  │    │    ├──css                    - compass generated css and sprite images
         │  │    │    │
         │  │    │    ├── _partial1.scss        - scss partial
         │  │    │    ├── _partial2.scss        - scss partial
         │  │    │    ├── _partialN.scss        - scss partial
         │  │    │    │
         │  │    │    ├── app.scss              - scss file for the quickbase app module
         │  │    │    ├── realm.scss            - scss file for the quickbase realm module
         │  │    │    └── <...>.scss
         │  │    │
         │  │    ├── common                     - common shared angular modules
         │  │    │    └──<1..n common modules>  - ie: logger, spinner, etc.
         │  │    │      └──\test\<1..n common test>  - ie: logger\test, spinner\test, etc.
         │  │    │          └── <...>.spec.js   - test spec
         │  │    │
         │  │    ├── qbapp                      - a quickbase angular module named 'app'
         │  │    │    ├──assets
         │  │    │    │   ├──images
         │  │    │    │   └──styles
         │  │    │    └──<1..n qbapp modules>   - ie: tables, reports, etc.
         │  │    │        └──<1..n qbapp test>   - ie: tables\test, reports\test, etc.
         │  │    │          └── <...>.spec.js   - test spec
         │  │    │
         │  │    ├── realm                      - a quickbase angular module named 'realm'
         │  │    │    ├──assets
         │  │    │    │   ├──images
         │  │    │    │   └──styles
         │  │    │    └──<1..n realm modules>
         │  │    │      └──<1..n realm test>
         │  │    │          └── <...>.spec.js   - test specs
         │  │    │
         │  │    └── <...>
         │  │
         │  ├── app.index.html                  - entry point html file associated with the angular module named 'app'
         │  ├── realm.index.html                - entry point html file associated with the angular module named 'realm'
         │  └── <...>.index.html
         │
        build                                   - gradle build output folder   (not tracked by git)
         │  │
         │  ├── distributions                   - folder to hold zip/jar/etc file
         │  └── reports
         │       ├──server                      - folder to hold test and coverage output
         │       └──client                      - folder to hold test and coverage output
         │
        dist                                    - grunt build output folder   (not tracked by git)
         │
        e2e                                     - protractor end to end tests
         │
        node_modules                            - the application&#39;s npm library
         │
        server                                  - express Node server
         │  │
         │  ├── api                             - app server folder
         │  ├── components                      - app-wide component's
         │  ├── config
         │  │    │
         │  │    └── environment                - configuration per environment (local, test, production)
         │  │         └── keys                  - ssl keys for the server (content is not tracked by git)
         │  ├── routes                          - quickbase server routes (rest endpoints, angular)
         │  ├── views                           - server rendered views
         │  │
         │  ├── app.js                          - express server start script
         │  └── routes.js                       - express server routes script
         │  └── test                            - express server test scripts
         │       ├── app.spec.js                - express server start script
         │       └── routes.spec.js
         │
        gruntfile.js                            - grunt build file for express and angular application
        build.gradle                            - gradle build file.
        karma.conf.js                           - karma test configuration file
        bower.json                              - application bower dependency definitions
        package.json                            - list of npm dependencies
        config.rb                               - compass configuration file
        protractor.conf.js                      - protractor configuration file
        .gitignore                              - application (client and server) git ignore configuration file
        .yo-rc.json                             - yeoman configuration file
        .jscsrc                                 - js code style linter configuration


Example folder structure of a QuickBase Angular module.

* name:   `app`;
* folder: `client/quickbase/qbapp`

        qbapp                                                 - name of the angular module
         ├── qbapp.routes.js                                  - angular routes for this module
         ├── qbapp.modules.js                                 - angular modules for this module
         │
         ├── dashboard                                 - dashboard component
         │    ├── realmDashboard.controller.js
         │    ├── realmDashboard.directive.js
         │    ├── realmDashboard.model.js
         │    ├── realmDashboard.service.js
         │    ├── realmDashboard.html
         │    │
         │    └── test                                - test folder for the dashboard component
         │         ├── realmDashboard.controller.spec.js
         │         ├── realmDashboard.directive.spec.js
         │         ├── realmDashboard.model.spec.js
         │         └── realmDashboard.service.spec.js
         │
         ├── reports                                   - reports component
         ├── tables                                    - tables component
         └── <...>

#Instructions to Run for Development
* Have node.js installed from the [Node.js site](http://nodejs.org/)

* Make sure you have Ruby installed (Macs should have it already `which ruby` otherwise get Ruby here)

* Run `gem install compass -v 1.0.1`   (may need sudo)

* Make sure you have grunt and bower installed
    * Run  `npm install bower grunt-cli`

* After you get the branch you can go to the terminal command line

* `cd` to the <QuickbaseRoot>/ui directory.

* To launch the node web server (express) and update as you edit run

    * `grunt serve`

* Current urls supported
    * http://localhost:9000/

#Configuring
The application requires a run-time environment to be defined and configured.  By default, the server runs in local development mode,
meaning a local configuration file must be defined. As this file is not tracked by git, to run locally, you will need to do the following:

- copy <project root>/server/config/environment/localsample.js into the local.js and save:

        (function () {
            'use strict';

            // Use local.js for environment variables that grunt will set when the server starts locally.
            // This file should not be tracked by git.

            var path = require('path');

            module.exports = {

                // to run using ssl, copy the private key and cert for
                // your host(ie:localhost.intuit.com) to ../server/config/keys
                // folder.. comment this out if don't want to offer ssl support.

                //SSL_KEY: {
                //    private: path.normalize(__dirname + '/keys/private.pem'),
                //    cert: path.normalize(__dirname + '/keys/cert.pem')
                //    requireCert: false  // set to false for self signed certs
                //},

                // allow for override of default ports
                port: 9000,
                sslPort: 9443,

                //REST endpoint (protocol,server,port)
                //javaHost: 'https://localhost.intuit.com:8443',
                javaHost: 'http://localhost.intuit.com:8080'

                //Express Server
                //DOMAIN: 'https://localhost.intuit.com:9443'
                DOMAIN: 'https://localhost.intuit.com:9000'

            };
        }());

Notes about the above configuration:

        SSL support is commented out.  See the section at the bottom of this README for setup instruction.
        Environment variable 'javaHost' points to a local instance rest endpoint.  Change to point to another server instance.  ie: pppdc9prd2jx.corp.intuit.net

RUN-TIME configuration.

The following run-time environment variables are supported:

        NODE_ENV=<environment>
        HOST=<express server host>

        For example:

        NODE_ENV=test;HOST=localhost-test.intuit.com

# Testing

Running `grunt test` will run the client and server unit tests with karma and mocha.

Use `grunt test:server` to only run server tests.

Use `grunt test:client` to only run client tests.

**Protractor tests**

To setup protractor e2e tests, you must first run

`npm run update-webdriver`

Use `grunt test:e2e` to have protractor go through tests located in the `e2e` folder.


#To debug Node UI server code

* Launch the grunt task with debug
    * `grunt serve:debug`

* Setup a debug config in Intellij
    * Install some IntelliJ plugins if you don't have these already
        * AngularJS - front end framework plugin
        * NodeJS - ui web server plugin
        * SASS support - enhances css with variables and methods plugin
     * Know working versions of Intellij are 13.0.3 and 13.0.4

    * Add a new config of type Node.js *Remote* debug in Intellij run/debug options menu
    * use the CI javaapi server in your <qbroot>/ui/server/config/local.env.js file for javaHost
    * Give the IntelliJ config a name like Node.js server
    * Set the port to the port printed out by the serve:debug grunt task and save the config

* Set your breakpoints in our server or node_modules directories (just use Chrome inspector for clientside js file debugging)

* Launch the config in debug mode


## To debug using your localhost java server

#To debug Protractor tests

Taken from [http://www.youtube.com/watch?v=VLMyI7QKcwg](http://www.youtube.com/watch?v=VLMyI7QKcwg)

1. Make sure you have the Node.js plugin installed for IntelliJ
2. Install the Selenium WebDriver standalone server
    * `npm install -g webdriver-manager`
3. Create a new Node.js run configuration and set the following parameters:
    * Node interpreter : `/usr/local/bin/node` (should be pre-filled)
    * Working directory : `QB_PROJECT_HOME/ui`
    * JavaScript file : `QB_PROJECT_HOME/ui/node_modules/grunt-protractor-runner/node_modules/protractor/lib/cli.js`
    * Application parameters : `QB_PROJECT_HOME/ui/protractor.conf.js`
4. Start your local Node.js server
    * `grunt serve`
5. Start your standalone Selenium WebDriver server
    * `webdriver-manager start`
6. Set a breakpoint in a JavaScript file from IntelliJ
7. Select the Node.js run configuration you just created and run in debug mode

#Adding new source elements with Yeoman
Yeoman is a tool that eases the scaffolding setup of new apps/widgets/services etc

The angular-fullstack generator was used as a blueprint for the client and server directory app structure.

If you wish to use yeoman to add new elements like an angular service, directive, etc., it
will create the files in the correct locations to keep to the project structure.


Example to add a directive to the quickbase realm application:

            cd to the project root
            yo angular-fullstack:directive myDirective
            [?] Where would you like to create this directive? ui/client/quickbase/<insert app>/component
            [?] Does this directive need an external html file? Yes

            NOTE: when prompted on where to create the directive, replace <insert app> with application name...for this example: realm

Produces:

            ui/client/quickbase/realm/component/myDirective.directive.js
            ui/client/quickbase/realm/component/myDirective.directive.spec.js  (You'll need to manually create a test folder and move this file)
            ui/client/quickbase/realm/component/myDirective.html


More yeoman angular fullstack details [here](https://www.npmjs.org/package/generator-angular-fullstack#endpoint)

##Compass
Compass is an open-source CSS authoring framework which uses the Sass stylesheet language.

If you're not familiar with Compass, go to the [Compass homepage](http://compass-style.org/) for an overview.  
For developer's, [click here to install compass on your dev machine](http://compass-style.org/install/). 

 
Grunt build: 

        A compass configuration file, config.rb, is located at the project root level.  It's used in the grunt build to compile the sass files into css.

        You can also manually compile your styles, without running a full build, by running the grunt task: compass-compile

Grunt watch:

        To automatically compile your styles on a file change, start the grunt task: compass-watch

NOTE:  the CSS files used by the application are always generated by the compass compiler.  Directly manipulating a css file will result in your changes getting overwritten when a new build is invoked.

#Using Gradle to build distribution node server
Gradle is used to build a production version of the node server and client application. 

Output from the Gradle Build and Test task is saved under the /build folder. 

Supported Gradle tasks include:

        gradle build - cleans dist and build folder; builds deployable code in dist folder; runs unit tests; runs code coverage; creates zip file.
        gradle clean - cleans gradle build folder AND grunt dist folder
        gradle test  - cleans dist folder; runs unit tests; runs code coverage.  Equivalent to 'gradle clean test'
        gradle (default) - equivalent to 'gradle clean test build' 
  
To run a gradle task, cd to the dist dir and run:
 
        `npm install --production` 
        
        which will install all the necessary modules for the release in node_modules under dist.
        NOTE: using --production will not include all the development node_modules needed to build/compile/compress/test the code.

To run the production distribution node server, run one of the following (may need sudo):
       
        NODE_ENV=production PORT=9000 node server/app.js
        NODE_ENV=production PORT=9000 npm start

##Running with Forever
To start a node server with forever which ensures that a given node script runs continuously:

        NODE_ENV=production PORT=9000 node_modules/forever/bin/forever start server/app.js
    
To stop a running node server with forever:

        NODE_ENV=production PORT=9000 node_modules/forever/bin/forever stop server/app.js

add forever option -w to automatically restart server on change to js files
other forever options
    -l  LOGFILE      Logs the forever output to LOGFILE
    -o  OUTFILE      Logs stdout from child script to OUTFILE
    -e  ERRFILE      Logs stderr from child script to ERRFILE

##Running NODE UI server code with SSL
By default, the express server will only accept http requests. To also accept https requests, the following setup is required.

CREATE CERTS:

The two files you need are a PEM encoded SSL certificate and private key.

If you already have a certificate(self-signed is okay) in your local keystore for the express server CommonName (ie: localhost, localhost.intuit.com, etc),
you can create the files from your local keystore.
For more information, click [here](http://security.stackexchange.com/questions/3779/how-can-i-export-my-private-key-from-a-java-keytool-keystore):

  a) Import your keystore into PKCS#12 (.p12) files:

    keytool -importkeystore -srckeystore yourKeyStore.jks -destkeystore keystore.p12 -deststoretype PKCS12 -srcalias <jkskeyalias> -deststorepass <password> -destkeypass <password>

    NOTE: srcalias is an optional parameter. If omitted, then all entries are imported.  It's recommended to import only the alias associated with your CN.

  b) Export your certificates(cert.pem):

    openssl pkcs12 -in keystore.p12  -nokeys -out cert.pem

  c) Export your private key(private.pem):

    openssl pkcs12 -in keystore.p12  -nodes -nocerts -out private.pem


If you do not have a certificate, you'll need to generate a private key and a certificate signing request, or CSR (which also contains your public key).
The following highlights how to do so using OpenSSL.
For more information, click [here](http://stackoverflow.com/questions/12871565/how-to-create-pem-files-for-https-web-server)

  a) Create a certficate signing request and private key:

    openssl req -newkey rsa:2048 -new -nodes -keyout private.pem -out csr.pem

    You will enter an interactive prompt to generate a 2048-bit RSA private key and a CSR that
    has all the information you choose to enter at the prompts. (Note: Common Name is where you'll want to
    put the domain name you'll be using to access your site.)

  b) Generate a self-signed certificate (the below expires in 10 years):

    openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout private.pem -out cert.pem

LOCALHOST CONFIGURATION

Caution should be taken with your private key. The following highlights a recommended approach as to how a developer's localhost
environment could be configured.  How other run-time environments like QA, E2E and PROD/AWS are configured/implemented will most likely differ
based on the security requirements of each.

  a) Copy the certificate(cert.pem) and private key(private.pem) to the 'keys' folder within the project.  The path is:

     ../quickbaseui/ui/server/config/keys

     NOTE: this is a new folder intended to hold run-time environments certs.  Given the sensitive nature of the content, other than the
     .gitignore file, all files put into this folder are not tracked by git.

  b) Modify the local.env.js file to define the path where your private key and certificate is located:

    SSL_KEY: {
        private: path.normalize(__dirname + '/keys/private.pem'),
        cert: path.normalize(__dirname + '/keys/cert.pem'),
        requireCert: false  // set to false for self signed certs
    },

  c) Modify the local.env.js file to change the default port for SSL.  Currently, it is set to 9443.  You can override as follows:

    sslPort: 9988,


Start up your express server.  In the console, you should see that the server is listening on both the http port(9000) and https port(9443).
Open a browser to verify.

To stop or not accept SSL requests, comment out/remove the SSL_KEY object in your run-time environment configuration file...(ie: local.env.js).

##Access REST endpoints over SSL
Update the javahost run-time configuration parameter to use the https protocol and appropriate port.  For example, include the following
setting in the local.env.js file:

    //REST endpoint (protocol,server,port)
    javaHost: 'https://localhost.intuit.com:8443'


##POSSIBLE ISSUES -- and how to resolve

1) When running unit tests, if the following error is outputted, it means PhantomJS is not installed on your machine:

      INFO [launcher]: Starting browser PhantomJS
      ERROR [launcher]: No binary for PhantomJS browser on your platform.
        Please, set "PHANTOMJS_BIN" env variable.

   Thought the package definition is included in the package.json, to correct, open a command window, cd to the project folder and
   manually install by running:

      npm install karma-phantomjs-launcher


