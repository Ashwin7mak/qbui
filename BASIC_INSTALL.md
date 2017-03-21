The following provides instructions for installing only the QBUI project locally for development, pointing to the integration environment for Core and Experience Engine.
For full instructions to setup and run, including various options see <https://github.com/QuickBase/qbui/blob/master/ui/README.md#instructions-to-run-for-development> for details

### Pre-installation

FIRST - Make sure you have the following installed 
(Further instructions in the Core repo [setup instructions](https://github.com/QuickBase/QuickBase/blob/master/README.md))

* Git & SourceTree Source code control (or GitHub Desktop)
* Intellij IDE
  * Install some IntelliJ plugins if you don't have these already
    * React-templates
    * GitHub
    * NodeJS - ui web server plugin
    * SASS support - enhances css with variables and methods plugin
  * Known working versions of Intellij is 2016.3.x
  * Use the QuickBase/intelliJSettings.jar from the Quickbase project.
* Java and Tomcat to run the backend

### Installing
#### Install Node via NVM

NVM only works with Mac but is the easier and cleaner option.
Install NVM from a terminal window:
```
touch ~/.bash_profile
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
```
For further info or if you run into issues, check here for the latest instructions: [nvm installation docs](https://github.com/creationix/nvm#installation)

Next, install Node.js v6.9.5 and set v6.9.5 as your default version of node 

```bash
    nvm install 6.9.5 && nvm alias default 6.9.5
```

To verify installation enter `nvm list default` which should print:
```bash
    ->         v6.9.5
```
(For instructions for using Zsh instead of bash or installing and configuring without NVM, see the full installation guide: https://github.com/QuickBase/qbui/blob/master/ui/README.md#tip-for-nvm-and-zsh

#### Install homebrew and grunt

* Install homebrew if it's not already installed. Test if it's install by running `brew --version` if says not found, install homebrew with:

    ```
        ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    ```
* Install grunt with npm
    ``` bash
    npm install -g grunt
    npm install -g grunt-cli
    ```

* **qbui** project uses npm as its *package managers* and Grunt as its *task runner*.

    The top level of the project holds the CI Jenkins Gradle related files and the source for the ui is under the ui directory

     Node modules are managed by package.json.

    Grunt tasks are defined in the Gruntfile.js

### Clone the repo
To clone this repo use:

* `git clone -b master ssh://git@github.com/quickbase/qbui.git`

or

* `git clone -b master https://github.com/QuickBase/qbui.git`

or through the GitHub desktop tool

    *Note:* If you get an error about no developer tools found when executing git, make sure you have xCode from Apple installed (and the cli tools). Go to the AppStore application and [install xcode](http://itunes.apple.com/us/app/xcode/id497799835?ls=1&mt=12).

## Configuring
Environment specific configurations reside in the qbui/ui/server/src/config/environment directory. The application requires a run-time environment to be defined and configured.  

For developing set this environment variable in your bash profile
`export NODE_ENV=local`

By default, the server runs in local development mode, meaning a local configuration file must be defined. As this file is not tracked by git, to run locally, you will need to do the following:

- copy \<project root\>qbui/ui/server/src/config/environment/local.js.sample into local.js
- copy \<project root\>qbui/ui/server/src/config/environment/e2e.js.sample into e2e.js

Edit both files and switch to the commented out values for javaHost, eeHost and eeHostPort so you point to the trunk integration environment

See [notes about the above configuration](https://github.com/QuickBase/qbui/blob/master/ui/README.md#configuring)


## Instructions to run server and watch for changes

* `cd` to the \<project root\>qbui/ui directory.

* run 'npm install' to install node modules

* To launch the node web server (express) and it will update server as you make edits run

    * `grunt serve`

* Current urls supported
    * http://localhost:9000/

### Note :
 The Node Server only listen via a specific ip/hostname when running with dev hotloader,
 as the hotload server needs the ip of main express server. When running in production mode listen is just scoped to port, not ip.node -

## Testing
See [testing instructions](https://github.com/QuickBase/qbui/blob/master/ui/README.md#testing)

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

##Running with Forever
To start a node server with forever which ensures that a given node script runs continuously:

        NODE_ENV=prod PORT=9000 node_modules/forever/bin/forever start server/src/app.js

To stop a running node server with forever:

        NODE_ENV=prod PORT=9000 node_modules/forever/bin/forever stop server/src/app.js

add forever option -w to automatically restart server on change to js files
other forever options
    -l  LOGFILE      Logs the forever output to LOGFILE
    -o  OUTFILE      Logs stdout from child script to OUTFILE
    -e  ERRFILE      Logs stderr from child script to ERRFILE

##Running NODE UI server code with SSL
By default, the express server will only accept http requests. To also accept https requests, the following setup is required.

CREATE CERTS:

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

     ../quickbaseui/ui/server/src/config/keys

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
    javaHost: 'https://localhost.com:8443'

##Accessing your development environment from another laptop or device

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

##Troubleshooting
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

