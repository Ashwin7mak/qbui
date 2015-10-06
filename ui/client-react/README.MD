
#Environment Configuration

Temporary changes to support a new 'REACT' run-time environment.  These changes to be deleted once the Angular client code is removed.

* /server/config/environment/react.js : new file created to configure a 'REACT' run time environment.
* /server/config/environment/environmentConstants.js : added 'REACT' run time environment 
* /server/config/expressConfig.js : define static appPath for the 'REACT' run time environment.  
* /server/routes/js : load either Angular or React routes based on run-time environment.
 
#package.json   
 
Updated to include React modules.  When Angular is removed, will need to do the following:

* Remove all Angular references from dev and devDependencies section
* Update webpack script to reference where the webpack configuration file is located (client-react will probably be refactored to just client..)

#Build and launch Angular implementation of Lighthouse:   
 
* Start Oracle db server
* Start lighthouse java back-end server from Quickbase repo
* cd to the ui folder
* run `CLIENT=ANGULAR grunt serve`
    - CLIENT=ANGULAR is required as the CLIENT=REACT uses by default it will if CLIENT is unspecified
    - browser should open to an unauthorized page
    - generate a ticket for realm to view data

#Build and launch React implementation of Lighthouse:

## Start Node Server :
### using _grunt_ to build and start node server and  watch for changes
* From command window:
    * cd to the ui folder
    * run  `NODE_ENV=local grunt serve` or `NODE_ENV=local CLIENT=REACT grunt serve`
    * grunt will generate the client webpack output
    * browser should open to view react lighthouse page
    * grunt will wait for changes to client or server and regen webpack and restart server
    
### Or using _npm_ to build and start server only
* From command window:
     * cd to the ui folder
     * run  `npm run webpack` 
     * then `NODE_ENV=local npm start`
     * grunt will generate the client webpack output
     * manually go to browser at localhost:9000

## Generate distribution(dist) folder for production deploy
* From command window:    
    * run  `grunt build` or `CLIENT=REACT grunt build`
    * to generate the ui\dist folder for deploy 
    * which will contain the and server dir and under public the react index.html and client bundle files 
    * host webserver from ui\dist\public for react interface 
     
## Run Unit tests with Karma:
* From command window:
     * cd to the ui folder
     * run `npm run tests` 
     * output is sent to:
        * the console 
        * ui/build/reports/client/unit/client_report.xml 
         
#WebPack 

## What gets generated 
* webpack builds the client files (replaces bower/browserify)
* build output to /client-react/dist folder
* non-production build outputs bundle.js and bundle.js.map
* production build outputs bundle.min.js and bundle.min.js.map

## Developers to run react app with _hot load_ of ui changes
_note: hot loading means edits will update the browser without needing to refresh the page
### Using _npm_ to launch hot reload
* From command window:    
    * run  `npm run webpack-dev-server` 
    * manually go to browser at localhost:3000
    * any edits you make to the files in the bundle (css, js) will be hot loaded 
    
### Or using _grunt_ to launch hot reload
* From command window:    
    * run  `grunt webpack-dev-server` 
    * manually go to browser at localhost:3000
    * any edits you make to the files in the bundle (css, js) will be hot loaded





