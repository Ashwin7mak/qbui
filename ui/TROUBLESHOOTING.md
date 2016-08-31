#Troubleshooting Your Developer Environment

Keeping your dev environment up to date (and working properly) with the latest checked in code is a necessary task as an engineer on the re-arch project.

Below are steps to help you try to diagnose and resolve issues during day to day use. This guide isn't meant as a fix all so if nothing works here please see another engineer for more help.

##Guide Prerequisites
1. You have gone through the dev setup guides **README.md** documents of both the **qbui** and **QuickBase** repos

##Diagnosing your dev env
A good practice when diagnosing issues with your dev env is to divide it into two parts (qbui and core) diagnosing from the ground up. So you should always check core first.

1. A good test that core is working properly is to run the Java API Integration tests:
 
        Found in the Quickbase/allServices/src/test/java/com.quickbase.corews/api/controllers/ package       
        Run test classes named IntegrationTest with your core (Tomcat server) running
        If you get passing tests then it's a good indication core is OK (not an absolute of course)
        
2. To test that the integration between node and Java core is setup properly you can either run the Mocha Integration tests or the E2E dataGen script via 

        grunt test:e2eLocalDataGen
        
3. The final test that everything is working properly is to either load an Application in the UI via your browser or run the Protractor E2E tests

##Java Core Symptoms:
* Tomcat starts, I see Swagger but can't create realms / apps via swagger or run Java API Integration Tests (I'm getting Null or 500 errors back):

        See Core General Fixes section
        
* Tomcat won't start and I have compilation errors and seemingly missing references to classes / packages:

        Try to refresh Gradle dependencies or rebuild your allServices war file first then try the other general fixes

* I'm getting a 404 error when swagger comes up:

        Double check your IntelliJ Tomcat configuration. Make sure /api is set in the Application context on the Deployment tab of your Tomcat config.

* I'm getting errors when starting Tomcat complaining about Oracle or SQL being unreachable:
 
        Is your Oracle VM running? :) Did you do the Oracle setup in the README.md file? 
        Double check that your Oracle VM IP address did not change because that does happen occasionally if it crashes or you restart your Mac with it running. 
        Use the steps noted in QuickBase README.md to get the IP address for the VM and that the IP you get matches what is specified in core.local.properties and integration.local.properties.

* I'm getting errors about not being able to find either **realmName.localhost** or **localhost.localhost** when running Integration tests:
        
        Make sure you have dnsmasq configured as specified in the QBUI README.md file.

##Java Core General Fixes:
Make sure you stop your Tomcat server before attempting these. Note you might need some or a combination of the steps below in order to get everything working again.

* Double check you didn't miss any steps in the QuickBase **README.md** setup (if you are setting up your env for the first time):
 
        Make sure you have built your artifacts at least once with the gradle build command, setup core.local.properties, and created your IntelliJ config properly.

* Did you setup your **integration.local.properties** config file? The Java API Integration tests will not run without it if you are using them as your smoke test.

* Update to the latest master code (which might have "broken" you in the first place:))

* From within IntelliJ refresh your Gradle dependencies:
        
        Open your Gradle tab -> Click the Refresh Icon from the top QuickBase project level

* Invalidate IntelliJ's cache and restart. Note that this will reindex all IntelliJ projects you have checked out: 

        From within the IDE go to File -> Invalidate Caches / Restart. 
        
* Close all IntelliJ instances, open up the Mac OSX Activity Monitor and make sure all IntelliJ and Java processes have been terminated (might have to force quit them) - sometimes these hang around when you restart / stop Tomcat a bunch of times.

####Still broken?
* Rebuild your allServices war file. Note that if you run this at the top QuickBase package level it will clean out and rebuild EVERY package in the project (and that will take a while). Usually rebuilding allServices is enough but you have to be in that directory / package to run it's specific gradle commands: 

        In your OSX terminal cd to your checked out QuickBase project and then into the allServices package. 
        Run gradle clean build -x test which cleans out and rebuilds your artifacts. This will skip running the unit tests. 
        

####Still broken?!
* Check that QBFunctions have not updated / changed. Check your email for notifications on this: 

        Run QBFunctions.sql on your Oracle VM via SQLDeveloper

* You might have bad / out of date data in your Oracle VM: 
        
        Run db-cleanup.sql (note you will lose any test data you have generated!)
        
* If all else fails do a reset of your Oracle VM: 

        Run db-cleanup.sql db-reset.sql and then QBFunctions.sql
        
####You are still here?
* Restart your Mac - honestly this sometimes does work :)
* See another engineer for some help in diagnosing :)

##QBUI Symptoms:
* My Node server won't start up via npm start or grunt serve:
 
        Check your local.js config file in qbui/ui/server/src/config/environment. It's usually something misconfigured there

* When starting Node you get errors about Node Modules or you might not see new changes in the UI. Were modules added / updated (check your email)? 

        Run npm install from the qbui/ui directory.
        In some cases I've had to delete my node_modules folder from within IntelliJ and then run npm install again (this should be a last resort though)

* I can't load an application in the UI, I can't run the dataGen scripts (either dataGen.js or grunt test:e2eLocalDataGen), or the Mocha Integration tests:
 
        Check core is working properly first! Then move onto the general fixes for QBUI.

* When I try to run Protractor e2e tests I get a webdriver not found error:
 
        From the qbui/ui directory run npm run update-webdriver to download the selenium and chrome drivers

##QBUI General Fixes:
* Double check you followed all the steps in the QBUI README.md file (if this is a first time setup).
* Check your local.js config file! Make sure everything is configured properly. Especially check your javaHost and port settings.
* Restart your node server if you updated your project with new changes: 

        You can stop a running node server via Control + c in the terminal window
        
* Make sure you don't have any other old Node instances running on your machine
* I've run into issues using the hotloader option when running Protractor tests or when trying to see new changes so try disabling it:

        Set noHotLoad : true in your local.js config


##Contributors
+ Ken LaBak

