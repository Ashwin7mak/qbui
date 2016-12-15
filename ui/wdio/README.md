#WebdriverIO README.md Setup Guide
Written by klabak 12/14/16

##Pre-requisites:
You'll need your full local dev stack running properly - **Oracle VM**, **Tomcat Server**, **Node Server** (with dnsmasq as well!).
All **Node modules** need to be installed and up to date via **npm install** (this command will install WebdriverIO automatically for you)

Check the **README.md** files in the specific repos for getting these things setup.

Browser installation: You'll need at least the latest Chrome version installed on your local dev ENV (55 at the time of writing). If you want to run tests against other browsers you'll need those as well. 

##Overview:
**WebdriverIO (wdio)** is an E2E test framework that simulates an end user interacting with a UI in a web browser or mobile application. 
It is essentially a wrapper over the WebdriverJS framework which is the Javascript version of Selenium Webdriver.
Wdio has many awesome features for writing tests and interacting with page elements in a simple, concise manner. 
Tests can be written synchronously so you don't have to have in-depth knowledge about promises and callbacks!
We will be using the wdio testrunner to manage selenium and run our tests for us. Wdio also has services (installed as separate npm packages) for interacting with other third parties which we will make use of as well.
This guide will help you get wdio setup on your local dev machine.

For more info on WebdriverIO please see their website here: [http://webdriver.io/](http://webdriver.io/)

The wdio GitHub repo is here: [https://github.com/webdriverio](https://github.com/webdriverio)

##Configuration:
The WebdriverIO configuration file **wdio.conf.js** contains all the information needed to run the test suite. 
Things like what spec files and browsers to run can be configured here. 

First copy the checked in **sample** file to the same directory renaming it to **wdio.conf.js** to create your local config (this has already been added to **.gitignore**). The sample file is located in

```
qbui/ui/wdio/config/wdio.conf.js.sample
```

This config file will be set by default to run your tests locally. The config file will read in environment variables set by your Node server.
By default the E2E tests will launch a **separate** Node server automatically using the **e2e.js** config file on port **9001** (aka **NODE_ENV=e2e** environment variable if you run from the command line).
This is to prevent port collision if you have Node already running. 

**e2e.js** is were you need to make sure the values match what your dev env is currently running at (specifically the **DOMAIN** and **javaHost** properties). The node config file is located in

```
qbui/ui/server/src/config/environment/e2e.js
```

For more on the wdio config file and all the different options see the page here: [http://webdriver.io/guide/testrunner/configurationfile.html](http://webdriver.io/guide/testrunner/configurationfile.html)

###Choosing which tests run:

Edit the **specs** parameter of **wdio.conf.js** (the path is dependent on where u run the wdio.conf.js from - see above)

###Configure your browser and breakpoint size

Edit the **capabilities** object of **wdio.conf.js**. Valid browserNames are **chrome**, **firefox**, **safari** and valid breakpointSizes are **small**, **medium**, **large**, **xlarge**.


##Running E2E tests:
You can run the E2E tests either by creating an IntelliJ Node configuration or via the command line (via IntelliJ is preferred since it's MUCH easier to debug tests).

###Via IntelliJ Node Configuration (local):
* In IntelliJ select the configuration menu located at the top of the IDE and choose **Edit Configurations**
* Hit the **+** sign in the top left corner and choose new **Node.js** configuration
* Configure it as follows (you will need to edit the paths to where your qbui repo is located)

![wdioIntellijConfig.png](wdioIntellijConfig.png)


* Save and close this window when you are finished. You can then click the green **Play** button at the top to run (or debug) your config.

You’ll see the Chrome browser launch and run a few tests. If you get errors check the section above.


###Via the command-line (local):
* The wdio config file is set to be run via IntelliJ by default. You'll need to update the **specs** parameter in **wdio.conf.js** first before proceeding. Change it to: 
```
specs: [
        './tests/reportAddRecord.e2e.spec.js'
    ]
```

* In the Mac OS X terminal ```cd``` to your checked out repository into the ```qbui/ui/wdio``` directory.
* Enter the following: 
```
NODE_ENV=e2e ../node_modules/.bin/wdio ./config/wdio.conf.js
```

We will be adding a grunt task to handle spec configuration automatically in the future!


##Debugging tests
First make sure the debug flag in **wdio.conf.js** is set to true (should be by default).
Next you'll probably need to increase the Jasmine global timeout (so your test operation can continue after pausing in the debugger): Increase **defaultTimeoutInterval** defined in **wdio.conf.js**

If you are running wdio via IntelliJ (which you should be) simply put a breakpoint in your code and run your IntelliJ config in Debug mode.

If you are running wdio via the command line you'll need to add ```browser.debug();``` to your code to pause your test. Then run the tests via the command listed above.

See the guide here on more info for debugging tests:
[http://webdriver.io/guide/testrunner/debugging.html](http://webdriver.io/guide/testrunner/debugging.html)

##Node Modules
Here are the current modules we are using as defined in our **package.json** file:

* "wdio-jasmine-framework": "^0.2.15",
* "wdio-sauce-service": "^0.2.5",
* "wdio-selenium-standalone-service": "0.0.7",
* "wdio-spec-reporter": "0.0.3",
* "webdriverio": "^4.4.0",
* "grunt-webdriver": "^2.0.2",