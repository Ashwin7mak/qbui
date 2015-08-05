#To debug Node UI server code

* To debug node layer in Intellij Create a node.js run time configuration and setting the following parameters:
 * Node interpreter : /usr/local/bin/node (should be pre-filled)
 * Working directory : QBUI_SERVER_HOME (folder where your app.js is located)
 * JavaScript file : app.js
 * environment variables : NODE_ENV=local;HOST=localhost.intuit.com
 * Set your breakpoints in our server or node_modules directories 
 * Launch the config in debug mode  

#To debug client side angular js code
* just use Chrome Browsers inspector for debugging


#To debug Protractor tests

Taken from [http://www.youtube.com/watch?v=VLMyI7QKcwg](http://www.youtube.com/watch?v=VLMyI7QKcwg)

1. Make sure you have the Node.js plugin installed for IntelliJ
2. Install the Selenium WebDriver standalone server
    * `npm install -g webdriver-manager`
3. Create a new Node.js run configuration and set the following parameters:
    * Node interpreter : `/usr/local/bin/node` (should be pre-filled)
    * Working directory : `QB_PROJECT_HOME/ui`
    * JavaScript file : `QB_PROJECT_HOME/ui/node_modules/grunt-protractor-runner/node_modules/protractor/lib/cli.js`
    * Application parameters : `QB_PROJECT_HOME/ui/sauce.chrome.protractor.conf.js`
4. Start your local Node.js server
    * `grunt serve`
5. Start your standalone Selenium WebDriver server
    * `webdriver-manager start`
6. Set a breakpoint in a JavaScript file from IntelliJ
7. Select the Node.js run configuration you just created and run in debug mode

