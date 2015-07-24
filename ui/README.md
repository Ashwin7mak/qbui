
#QuickBase UI

The QuickBase ui project is the ui layer of the QuickBase application. It is an Node.js pass thru API server to the java backend as well as an angular frontend. This project has the files needed to startup the node.js express server for the ui layer in support of the Angular QuickBase application.

Other repos for QuickBase [java backend](https://github.intuit.com/QuickBase/QuickBase) and [aws](https://github.intuit.com/QuickBase/aws) are also part of the Quickbase application. 
see also:
[File structure](FILESSTRUCTURE.md)

##Installing
Get the qbui project repo 

```
git clone -b master ssh://git@github.intuit.com/quickbase/qbui.git
```
or

```
git clone -b master https://github.intuit.com/QuickBase/qbui.git
```

##Prerequisites 
1. Know Javascript, Node.js Angularjs
2. Read coding conventions (TODO:link to coding conventions doc)


##Pre-installation

* Have node.js installed from the [Node.js site](http://nodejs.org/)
* (*Optional*) Make a place for any global node modules 
 	1. Create a .node folder from command line.
 	   
	  	```
	  	$ mkdir .node
	  	```
   
	2. Adjust your node settings so that the global modules get installed locally for your login.
	
	   ``` bash
	      $ npm config set prefix=~/.node
	   ```
 	  This is required because when you try to install modules globally (npm install -g), npm will install it in /usr/local/    and this will cause permission issues. In order to prevent this, adjust your node settings to install global modules     local for your login.

	3. Add this directory to your PATH.
	
	   ``` bash
	     $ export PATH=$PATH:$HOME/.node/bin
	   ```


* Make sure you have Ruby installed (Macs should have it already, try `which ruby` otherwise get Ruby here)

* Install compass. Run `gem install compass -v 1.0.1`   (may need sudo)

* **qbui** project uses npm and Bower as its *package managers* and Grunt as its *task runner*. 

	The top level of the project holds the CI Jenkins Gradle related files and the source for the ui is under the ui directory

	There is a bower_components folder which is managed by bower.json. 

	There is a node_modules folder which is managed by package.json. 

	Grunt tasks are defined in the Gruntfile.js 

	* Make sure you have grunt and bower installed
	    * Run  `npm install bower grunt-cli`

##Configuring
Environment specific configurations reside in the server/config/environment directory. The application requires a run-time environment to be defined and configured.  
By default, the server runs in local development mode, meaning a local configuration file must be defined. As this file is not tracked by git, to run locally, you will need to do the following:

- copy <project root>/server/config/environment/local.js.sample into the local.js and save:

Notes about the above configuration:

        SSL support is commented out.  See the section at the bottom of this README for setup instruction.
        Environment variable 'javaHost' points to a local instance rest endpoint.  Change to point to another server instance.  ie: pppdc9prd2jx.corp.intuit.net

RUN-TIME configuration.

The following run-time environment variables are supported:

        NODE_ENV=<environment>
        HOST=<express server host>

        For example:

        NODE_ENV=test;HOST=localhost-test.intuit.com


##Instructions to run server and watch for changes 

* `cd` to the <QuickbaseRoot>/ui directory.

* To launch the node web server (express) and it will update server as you make edits run

    * `grunt serve`

* Current urls supported
    * http://localhost:9000/


## Testing
###Unit tests
Running `grunt test` will run the client and server unit tests with karma and mocha.

Use `grunt test:server` to only run server tests.

Use `grunt test:client` to only run client tests.

###Mocha Integration tests

In order to run the integration tests you will need to have your Node.js express server and your Java API service (aka Monolith) running

Make sure you have configured your local.js file properly (as described above):

        //REST endpoint (protocol,server,port)
        javaHost: 'http://localhost:8080/api/'
        //Express Server
        DOMAIN: 'http://localhost:9000'

Because the integration tests create a realm and the Mac OS by default does not handle loopback calls to localhost, we need to setup / configure
a local DNS server (Dnsmasq):

        # Update your homebrew installation
        brew up
        # Install Dnsmasq
        brew install dnsmasq

        # Copy the default configuration file:
        cp $(brew list dnsmasq | grep /dnsmasq.conf.example$) /usr/local/etc/dnsmasq.conf

        # Copy the daemon configuration file into place:
        sudo cp $(brew list dnsmasq | grep /homebrew.mxcl.dnsmasq.plist$) /Library/LaunchDaemons/

        # Start Dnsmasq automatically when the OS starts:
        sudo launchctl load /Library/LaunchDaemons/homebrew.mxcl.dnsmasq.plist

        # Configure Dnsmasq: The configuration file lives at `/usr/local/etc/dnsmasq.conf` by default, so open this file in your favourite editor.
        # Add / uncomment to config file:
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

To make sure it's working properly run Monolith and in your web browser hit:
`http://blah.localhost:8080/api/`
If swagger comes up then Dnsmasq is configured properly.

Now try to hit an external website like `http://www.google.com` to make sure the OS is handling non localhost calls.

Now you should be able to run your Mocha integration tests!
With the Java API service running, from the qbui/ui directory run:

        grunt mochaTest:integration

Note that this command will launch your Node express server if it's not running.

###Protractor E2E tests

To setup protractor e2e tests, you must first run

`npm run update-webdriver`

Use `grunt test:e2e` to have protractor go through tests located in the `e2e` folder.

See [Debugging UI](./DEBUGGING.md)


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

##Using Gradle to build distribution node server
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
       
        NODE_ENV=aws PORT=9000 node server/app.js
        NODE_ENV=aws PORT=9000 npm start

##Running with Forever
To start a node server with forever which ensures that a given node script runs continuously:

        NODE_ENV=aws PORT=9000 node_modules/forever/bin/forever start server/app.js
    
To stop a running node server with forever:

        NODE_ENV=aws PORT=9000 node_modules/forever/bin/forever stop server/app.js

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


##Troubleshooting
POSSIBLE ISSUES -- and how to resolve

1. First, since the ui has dependencies on the java backend make sure:
	
	1.1. your Tomcat server is running 
	* see [Quickbase repo](https://github.intuit.com/QuickBase/QuickBase/raw/master/README.md)
	
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
      

      
      
      

