
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
* run `grunt serve`
    - note CLIENT=ANGULAR is optional, by default it will use ANGULAR if CLIENT is unspecified
    - browser should open to an unauthorized page
    - generate a ticket for realm to view data

#Build and launch React implementation of Lighthouse:
 
* From command window:
    * cd to the ui folder
    * npm run webpack
    * run  `grunt setEnv:CLIENT:REACT serve` or `CLIENT=REACT grunt serve`
    * browser should open to view react lighthouse page
    
#WebPack
      
* build output to /client-react/dist folder
* non-production build outputs bundle.js and bundle.js.map
* production build outputs bundle.min.js and bundle.min.js.map/Users/dstevens/Desktop/qbui