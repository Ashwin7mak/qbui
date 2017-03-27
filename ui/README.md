
# QuickBase UI

The QuickBase ui project is the ui layer of the QuickBase application. It is an Node.js pass thru API server to the java backend as well as a React frontend.

Other repos for QuickBase:

* [java backend](https://github.com/QuickBase/QuickBase)
*  and [aws](https://github.com/QuickBase/aws)
are also part of the Quickbase application.

see also:
[QBUI project File structure](FILESSTRUCTURE.md)


## Knowledge Prerequisites
Writing Javascript, Node.js, React


## Pre-installation

FIRST - Do all the Quickbase java backend development [setup instructions](https://github.com/QuickBase/QuickBase/blob/master/README.md) so that you have installed

* Git & SourceTree Source code control
* Intellij IDE
  * Install some IntelliJ plugins if you don't have these already
    * React-templates
    * GitHub
    * NodeJS - ui web server plugin
    * SASS support - enhances css with variables and methods plugin
  * Known working versions of Intellij is 2016.3.x
  * Use the QuickBase/intelliJSettings.jar from the Quickbase project.
* Java and Tomcat to run the backend

## Installing

To avoid permission issues caused by installing npm modules globally, you can either 1) [install NVM](https://github.com/QuickBase/qbui/blob/master/ui/README.md#install-node-via-nvm) (on Mac) OR 2) [install node and configure](https://github.com/QuickBase/qbui/blob/master/ui/README.md#install-node-and-configure-global-node-modules) where node installs global npm modules.

#### Install Node via NVM

NVM only works with Mac but is the easier and cleaner option.

Follow the steps in this[nvm installation docs](https://github.com/creationix/nvm#installation)

Next, install Node.js v6.9.5 and set v6.9.5 as your default version of node 

```bash
    nvm install 6.9.5 && nvm alias default 6.9.5
```

To verify installation enter `nvm list default` which should print:
```bash
    ->         v6.9.5
```
If nvm and node were successfully installed, skip the next section about installing Node.js and global node configuration.

##### Tip for NVM and Zsh

You can add the following script to your `~/.zshconfig` file to automatically switch to the correct node version for the qbui project
when you `cd` into the `qbui/ui` folder if you used NVM (see above) and also use [OhMyZsh](https://github.com/robbyrussell/oh-my-zsh).

``` bash
# place this after nvm initialization!
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```
See more about this at https://github.com/creationix/nvm

*Note:* Don't have Zsh? That's ok. You can use the command `nvm use` when you are in the `qbui/ui` directly 
to automatically switch to the correct version of Node.

#### Install Node and configure global node modules

1. Install node.js (v6.9.5, as of 3/1/2016) via nvm 


2. Install homebrew if it's not already installed. Test if it's install by running `brew --version` if says not found, install homebrew with:

    ```
        ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    ```
3. Install grunt with npm
    ``` bash
    npm install -g grunt
    npm install -g grunt-cli
    ```

4. **qbui** project uses npm as its *package managers* and Grunt as its *task runner*.

    The top level of the project holds the CI Jenkins Gradle related files and the source for the ui is under the ui directory

     Node modules are managed by package.json.

    Grunt tasks are defined in the Gruntfile.js


5. Then get the qbui project repo

    ```
    git clone -b master ssh://git@github.com/quickbase/qbui.git
    ```
    or

    ```
    git clone -b master https://github.com/QuickBase/qbui.git
    ```

    *Note:* If you get an error about no developer tools found when executing git, make sure you have xCode from Apple installed (and the cli tools). Go to the AppStore application and [install xcode](http://itunes.apple.com/us/app/xcode/id497799835?ls=1&mt=12).

6. Last step is to install all the npm modules.

First, you'll most likely need to amend the `.npmrc` file located in the `/<project root>/qbui/ui` folder.

Comment out the following line:
```
;registry = https://nexus1.ci.quickbaserocks.com/nexus/content/repositories/npmjs/
```

Now `cd` into the `/<project root>/qbui/ui` directory and run
```
npm install
```

## Configuring
Environment specific configurations reside in the qbui/ui/server/src/config/environment directory. The application requires a run-time environment to be defined and configured.  

For developing set this environment variable in your bash profile
`export NODE_ENV=local`

By default, the server runs in local development mode, meaning a local configuration file must be defined. As this file is not tracked by git, to run locally, you will need to do the following:

- copy \<project root\>qbui/ui/server/src/config/environment/local.js.sample into the local.js

Notes about the above configuration:

* SSL support is commented out.  See the section at the bottom of this README for setup instruction.

* Environment variable 'javaHost' points to a local core instance rest endpoint.  Change to point to another server instance if not running Quickbase java core backend locally.

* Environment variable 'eeHost' points to a local experience engine instance rest endpoint.  Change to point to another server instance if not running Quickbase java EE backend locally.

* Environment variable 'eeHostEnable' indicates if the experience engine instance is used by the node layer or not.  Set this flag to true to enable the experience engine support.

* Hotloading is enabled. If you need to connect to your server from inside a VM (such as when testing with IE or Edge) or from any device other than your laptop, you will need to disable hotloading with our current configuration or Node will refuse the connection since it didn't originate from 127.0.0.1/localhost. (Hotloading a.k.a. Hot Module Replacement / HMR is a feature of webpack that watches for changes on your disk and updates the code in the browser without you needing to refresh the page.)

RUN-TIME configuration.

The following run-time environment variable is supported:

        NODE_ENV: <name of config file>

        For example:

        NODE_ENV=test

        will load the test.js file for configuration, default is local.js


## Instructions to run server and watch for changes

* To launch the node web server (express) and it will update server as you make edits run

    * `grunt serve`

* Current urls supported
    * http://localhost:9000/

### Note :
 The Node Server only listen via a specific ip/hostname when running with dev hotloader,
 as the hotload server needs the ip of main express server. When running in production mode listen is just scoped to port, not ip.node -

## Testing
cd to <project root>/qbui/ui directory
### Lint and Code Style tests
Running `grunt codeStandards`from `/qbui/ui` directory will run the lint tasks. This task validates the javascript follows best practices and ensures the code is formatted to our qbui coding styles.

* Linting check [ESLint](http://eslint.org/docs/rules/) -
    Look at the .eslintrc files for the lint rules and coding standards
    and set the following settings for coding style errors to appear in the IDE inspection. (This step is manual due to difference user code paths)

    *  In the qbui Intellij project, go to Main Menu `Intellij IDEA/Preferences...` or `File/Other Settings... /Default Settings...` and then select the options for `Languages & Frameworks` then `Code Quality Tools` then `Javascript` and disable all the others but enable ESLint and set the following ESLint settings

    *  ESLint dialog
        * ![eslintDialogScreenShot.png](eslintDialogScreenShot.png)
    * Note: The lint and coding standards settings are found in `.eslintrc` file(s). Each directory can overide the general settings with its own .eslintrc file or in line a file can specify `/* eslint rule:value */` to override with comment statements.
    * The rules are based on several standards see [https://github.com/jscs-dev/node-jscs/tree/master/presets](https://github.com/jscs-dev/node-jscs/tree/master/presets)  as well as data from statistics on github open source code [http://sideeffect.kr/popularconvention#javascript](http://sideeffectkr/popularconvention#javascript

    * The ESLint setup in the above dialog will now run eslint with the Intellij `Analyze\Inspect Code...` feature and while you edit it will show errors in the left margin in red.

    * ESLint is part of the build and build will fail if there are errors.

    * The script to run eslint from the command line is `NODE_ENV=local npm run lint` or to fix the stylistic [fixable errors][http://eslint.org/docs/rules/) run `NODE_ENV=local npm run lintFix` our build does lintFix. The lint npm script runs ` node_modules/eslint/bin/eslint.js --ext .js --ext .jsx --format 'node_modules/eslint-friendly-formatter' .`

    * Also to run the eslint on the source from Intellij *custom tool* with clickable links to error location, do the following
        1. Create a external tool (`IntelliJ\Preferences...\Tools\Exterenal Tools`) to run eslint using this
           - program: `npm`
           - parameters: `run lintFix`
           - working directory: `$ProjectFileDir$/ui`

        2. Use an output filter like:

           ```bash
             $FILE_PATH$.*:$LINE$.*:$COLUMN$

           ```
           * For Example ![eslintExternalTool](eslintExternalTool.png)

        3. When launching the tool now any eslint errors listed which have file location will be also clickable. Clicking will take you to the error location in the Intellij editor:
           ![](eslintErrorExample.png)





### Unit tests
Running `grunt test` will run the client and server unit tests with karma and mocha as well as the codeStandards.

Use `grunt test:server` to only run server tests.

Use `grunt test:client` to only run client tests.

Note: If you see a `Cannot find module './build/Release/DTraceProviderBindings'] code: 'MODULE_NOT_FOUND'` in the log from unit test run ` npm install bunyan ` to fix


### Mocha Integration tests

In order to run the integration tests you will need to have your Node.js express server and your Java API service running

Make sure you have configured your local.js file properly (as described above):

        //REST endpoint (protocol,server,port)
        javaHost: 'http://localhost:8080'
        //Express Server
        DOMAIN: 'http://localhost:9000'



Because the integration tests create a realm and the Mac OS by default does not handle loopback calls to localhost, we need to setup / configure
a local DNS server (Dnsmasq):


        # Update your homebrew installation
        brew up
        # Install Dnsmasq
        brew install dnsmasq

        # Copy the default configuration file:
        mkdir -p /usr/local/etc && cp $(brew list dnsmasq | grep /dnsmasq.conf.example$) /usr/local/etc/dnsmasq.conf

        # Copy the daemon configuration file into place:
        sudo cp $(brew list dnsmasq | grep /homebrew.mxcl.dnsmasq.plist$) /Library/LaunchDaemons/

        # Start Dnsmasq automatically when the OS starts:
        sudo launchctl load /Library/LaunchDaemons/homebrew.mxcl.dnsmasq.plist

        #if you ever need to unload it use
        sudo launchctl remove homebrew.mxcl.dnsmasq
        sudo launchctl unload /Library/LaunchDaemons/homebrew.mxcl.dnsmasq.plist


Configure Dnsmasq: The configuration file lives at `/usr/local/etc/dnsmasq.conf` by default, so open this file in your favourite editor. Add or uncomment this line in config file:

        address=/localhost/127.0.0.1

        # Restart Dnsmasq:
        sudo launchctl stop homebrew.mxcl.dnsmasq
        sudo launchctl start homebrew.mxcl.dnsmasq

At this point Dnsmasq is being used for all DNS requests. We want to configure the Mac OS to just use Dnsmasq for localhost callbacks:

        sudo mkdir -p /etc/resolver
        sudo tee /etc/resolver/localhost >/dev/null <<EOF
        nameserver 127.0.0.1
        EOF

For more documentation on Dnsmasq see: `http://passingcuriosity.com/2013/dnsmasq-dev-osx/`

To make sure it's working properly run java backend and in your web browser hit:
`http://blah.localhost:8080/api/`
If swagger comes up then Dnsmasq is configured properly.

Now try to hit an external website like `http://www.google.com` to make sure the OS is handling non localhost calls.

Now you should be able to run your Mocha integration tests!
With the Java API service running, from the qbui/ui directory run:

        export NODE_ENV=local
        grunt mochaTest:integration

Note that this command will launch your Node express server if it's not running.

### WebdriverIO E2E tests

To setup WebdriverIO for browser end to end tests, follow the **README.md** setup guide in the `qbui/ui/wdio` directory. Make sure to check out the **NEWBIEGUIDE.md** as well!

Create your own copy of the **e2e.js** Node config file by copying and renaming **e2e.js.sample** located in `qbui/ui/server/src/config/environment`. The e2e tests have their own config file as they will launch their own node instance when running.

Now run `npm run update-webdriver` in terminal from the `qbui/ui` directory

Once everything is configured you can run `grunt test:e2eLocalDataGen` as a smoke test to check that everything is working properly. This script will generate you a test realm and app which you can view in the UI.

See [Debugging UI](./DEBUGGING.md) for more info on debugging tests.

To run your local e2e tests out on Sauce Labs against your local dev machine you can run

`grunt test:e2eLocalSauce --baseUrl=<the url you want to hit> --sauceKey=<the credentials for our sauceLabs account>`

The credentials for the Sauce Labs account can be found in the Jenkins job **try-ui-webdriverIO**

For more information on Sauce Labs visit: [https://docs.saucelabs.com/](https://docs.saucelabs.com/)

To configure WebdriverIO to use different browsers, modify or add a file to the wdio configuration under `qbui/ui/wdio/config`.

For all of the browser capabilities check out:

[http://www.ignoredbydinosaurs.com/2015/04/angular-protractor-tests-and-sauce-connect-config](http://www.ignoredbydinosaurs.com/2015/04/angular-protractor-tests-and-sauce-connect-config)
and
[https://www.browserstack.com/automate/capabilities](https://www.browserstack.com/automate/capabilities)

## Using Gradle to build distribution node server
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

To run the production distribution node server: 
1. run build to create the dist dir with grunt or gradle

* with grunt, go to the ui dir:        
    `NODE_ENV=prod grunt clean build`
    
* or with gradle, go to the project root dir:      
    `NODE_ENV=prod gradle build`
    
2. run one of the following (may need sudo) to start the server, go to the ui/dist dir:

        NODE_ENV=prod node server/src/app.js
        NODE_ENV=prod npm start

## Running with Forever
To start a node server with forever which ensures that a given node script runs continuously:

        NODE_ENV=prod PORT=9000 node_modules/forever/bin/forever start server/src/app.js

To stop a running node server with forever:

        NODE_ENV=prod PORT=9000 node_modules/forever/bin/forever stop server/src/app.js

add forever option -w to automatically restart server on change to js files
other forever options
    -l  LOGFILE      Logs the forever output to LOGFILE
    -o  OUTFILE      Logs stdout from child script to OUTFILE
    -e  ERRFILE      Logs stderr from child script to ERRFILE

## Running NODE UI server code with SSL
By default, the express server will only accept http requests. To also accept https requests, the following setup is required.

### Using existing certificate

**Note: Go to next section to create a new certificate**

The two files you need are a PEM encoded SSL certificate and private key.

If you already have a certificate(self-signed is okay) in your local keystore for the express server CommonName (ie: localhost, localhost.com, etc),
you can create the files from your local keystore.
For more information, click [here](http://security.stackexchange.com/questions/3779/how-can-i-export-my-private-key-from-a-java-keytool-keystore):

  a) Import your keystore into PKCS#12 (.p12) files:

    keytool -importkeystore -srckeystore yourKeyStore.jks -destkeystore keystore.p12 -deststoretype PKCS12 -srcalias <jkskeyalias> -deststorepass <password> -destkeypass <password>

    NOTE: srcalias is an optional parameter. If omitted, then all entries are imported.  It's recommended to import only the alias associated with your CN.

  b) Export your certificates(cert.pem):

    openssl pkcs12 -in keystore.p12  -nokeys -out cert.pem

  c) Export your private key(private.pem):

    openssl pkcs12 -in keystore.p12  -nodes -nocerts -out private.pem

### Creating a new certificate

If you do not have a certificate, you'll need to generate a private key and a certificate signing request, or CSR (which also contains your public key).
The following highlights how to do so using OpenSSL.
For more information, click [here](http://stackoverflow.com/questions/12871565/how-to-create-pem-files-for-https-web-server)

  a) Create a certficate signing request and private key:

    openssl req -newkey rsa:2048 -new -nodes -keyout private.pem -out csr.pem

    You will enter an interactive prompt to generate a 2048-bit RSA private key and a CSR that
    has all the information you choose to enter at the prompts. (Note: Common Name is where you'll want to
    put the domain name you'll be using to access your site. e.g., quickbase-dev.com)

  b) Generate a self-signed certificate (the below expires in 10 years):

    openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout private.pem -out cert.pem

### LOCALHOST CONFIGURATION

Caution should be taken with your private key. The following highlights a recommended approach as to how a developer's localhost
environment could be configured.  How other run-time environments like QA, E2E and PROD/AWS are configured/implemented will most likely differ
based on the security requirements of each.

  a) Copy the certificate(cert.pem) and private key(private.pem) to the 'keys' folder within the project.  The path is:

     ../quickbaseui/ui/server/src/config/environment/keys

     NOTE: this is a new folder intended to hold run-time environments certs.  Given the sensitive nature of the content, other than the
     .gitignore file, all files put into this folder are not tracked by git.

  b) Modify the local.js file to define the path where your private key and certificate is located:

    ```javascript
    SSL_KEY: {
        private: path.normalize(__dirname + '/keys/private.pem'),
        cert: path.normalize(__dirname + '/keys/cert.pem'),
        requireCert: false  // set to false for self signed certs
    },
    ```

  c) Modify the local.js file and uncomment the path

    ```javascript
    var path = require('path');
    ```

  d) Optional: Modify the local.js file to change the default port for SSL.  Currently, it is set to 9443.  You can override as follows:

    sslPort: 9988,


Start up your express server.  In the console, you should see that the server is listening on both the http port(9000) and https port(9443).
Open a browser to verify.

To stop or not accept SSL requests, comment out/remove the SSL_KEY object in your run-time environment configuration file...(ie: local.env.js).

## Access REST endpoints over SSL
Update the javahost run-time configuration parameter to use the https protocol and appropriate port.  For example, include the following
setting in the local.env.js file:

    //REST endpoint (protocol,server,port)
    javaHost: 'https://localhost.com:8443'

## Accessing your development environment from another laptop or device

To access your development environment from another laptop or device, you need to disable the
hotloader. Edit local.js, and uncomment the line for the "noHotLoad" property.

    //set notHotLoad true to disable hotloading
    noHotLoad : true,

This configures node to accept incoming connections from any host as opposed to only localhost.
You can then access your development environment from other laptops or devices by IP address.
To help determine the correct IP address for your machine (since you may have several) and to
easily generate URLs to access your environment, a tool is available. Download it from here:

    smb://qbfs01.corp.quickbase.net/Data/SoftwareEngineering/IPAddressTool/

The tool presents you with a list of the network interfaces on your computer, their IP addresses,
and a description. When you choose an interface from this list, the tool presents you with a list
of text items (including things such as a "Create Ticket" URL) that you can easily copy to the clipboard and
paste into a chat session with yourself or another person on the other laptop or device.
You can configure the format of the text items in the tool to meet your own personal needs.

By disabling the hotloader, you lose the ability for the watcher to automatically push the
updates into the browser. However, you can run webpack with file watching enabled and
see updates in the browser with a manual refresh instead of hotloading changes.
This process is actually faster sometimes and less likely to crash node.
Developers who refresh their browsers to reload JavaScript frequently may find this
configuration preferable to "grunt serve". In this configuration
you run node to serve the app separate from the watcher. To serve the app:

    node server/src/app.js

To run the watcher, in a different terminal:

    npm run watch

In order for a device or laptop to connect to your dev environment, they
must both be on the same local network. Both can be connected to the office
network or your home network. If both are not on the same local network,
you can use the VPN to connect through the office network. You can connect from
any laptop or device at the office to your dev environment running at home when
your laptop at home has the VPN running. If two developers are at home, they
can both run the VPN and connect from a laptop at one home to a dev
environment at another home through the office network.

Be aware that enabling other devices to access your dev environment enables *all* devices
on the local network. This is not as big of an issue when at the office or your home.
However, when using public networks (like at Starbucks), if that network does not block
peer-to-peer connections, this will enable the people sitting at the table next
to you, or the black hat network sniffer dude in a car in the parking lot,
or a roaming trojan horse or virus to connect to your node server. So, use
whatever caution you determine to be appropriate. Note that turning off the
hotloader only opens up node on port 9000 to other devices. Other services
(such as core on port 8080 or Experience Engine on port 8081) are always open to
all devices on the network and aren't affected by the hotloader settings.

## Troubleshooting
POSSIBLE ISSUES -- and how to resolve

1. First, since the ui has dependencies on the java backend make sure:

    1.1. your Tomcat server is running

    * see [Quickbase repo](https://github.com/QuickBase/QuickBase/raw/master/README.md)

    1.2. your Oracle DB is up

    * see [oracle vm setup info](https://wiki.intuit.com/display/qbasepd/Local+Oracle+Linux+VM+Setup)

    1.3. your Node express server is running

    * under this repo ui dir run 'grunt serve'

2. When running unit tests, if the following error is outputted, it means PhantomJS is not installed on your machine:

      INFO [launcher]: Starting browser PhantomJS
      ERROR [launcher]: No binary for PhantomJS browser on your platform.
        Please, set "PHANTOMJS_BIN" env variable.

   Though the package definition is included in the package.json, to correct, open a command window, cd to the project folder and
   manually install by running:

      npm install karma-phantomjs-launcher

3. If when running your node server you see ECONNREFUSED in the logs make sure you have followed the instructions for the DNS workaround on mac above


## Other Resources

* Links for learning Node, react, etc - [https://github.com/QuickBase/QuickBaseUIProto/blob/development/ui/LEARNING.md]([https://github.com/QuickBase/QuickBaseUIProto/blob/development/ui/LEARNING.md)

* Information on the ui ops tools we use to build and deploy the you - [https://github.com/QuickBase/QuickBaseUIProto/blob/development/ui/TOOLS_AND_LIBS.md](https://github.com/QuickBase/QuickBaseUIProto/blob/development/ui/TOOLS_AND_LIBS.md)

* Globalization in the UI - [https://github.com/QuickBase/QuickBaseUIProto/blob/development/ui/UI%20i18n.md](https://github.com/QuickBase/QuickBaseUIProto/blob/development/ui/UI%20i18n.md)

Contributors
---------------------
+ Chris Deery
+ Claire Martinez
+ Cleo Schneider
+ Don Hatch
+ Ken LaBak
+ Lisa Davidson
+ Mark Roper
+ Micah Zimring
+ Rick Beyer
