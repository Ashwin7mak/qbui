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

