
## QuickBase UI Project Structure

Overview of the UI directory

    ui
     │
     └─ .tmp                                    - temporary output folder used by build  (not tracked by git)
         │
        client                                  - angular UI client code folder
         │  │
         │  ├── bower_components                - components downloaded by bower compressed/concatinated/installed in brower
         │  ├── gallery                         - for samples of ui component modules
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
         │  │    │    └──<1..n qbapp modules>   - ie: tables, reports, etc.
         │  │    │        └──<1..n qbapp test>   - ie: tables\test, reports\test, etc.
         │  │    │          └── <...>.spec.js   - test spec
         │  │    │
         │  │    ├── realm                      - a quickbase angular module named 'realm'
         │  │    │    └──<1..n realm modules>
         │  │    │      └──<1..n realm test>
         │  │    │          └── <...>.spec.js   - test specs
         │  │    │
         │  │    └── <...>
         │  │
         │  ├── gallery.index.html              - entry point html file associated with the angular module named 'gallery' for debug only
         │  ├── qbapp.index.html                - entry point html file associated with the angular module named 'qbapp'
         │  ├── realm.index.html                - entry point html file associated with the angular module named 'realm'
         │  ├── report.index.html               - entry point html file associated with the angular module named 'report'
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
         │  │    └── quickbase                  - quickbase server api
         |  │      └── test                     - test scripts         
         │  │    
         │  ├── components                      - app-wide component's
         │  │    └── test                       - test scripts        
         │  │    
         │  ├── config
         │  │    │
         │  │    └── environment                - configuration per environment (local, test, aws)
         │  │    │    └── keys                  - ssl keys for the server (content is not tracked by git)
         │  │    └── test                       - test scripts
         │  │    
         │  ├── routes                          - quickbase server routes (rest endpoints, angular)
         │  │  └── test                         - test scripts
         │  │    
         │  ├── views                           - server rendered views
         │  │
         │  ├── app.js                          - express server start script
         │  └── routes.js                       - express server routes script
         │
        Gruntfile.js                            - grunt build file for express and angular application
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
         ├── xyz.modules.js                                   - angular dependent modules for this module
         │
         ├── xyz                                              - xyz component
         │    ├── xyz.controller.js
         │    ├── xyz.directive.js
         │    ├── xyz.model.js
         │    ├── xyz.service.js
         │    ├── xyz.html
         │    │
         │    └── test                                        - test folder for the xyz component
         │         ├── xyz.controller.spec.js
         │         ├── xyz.directive.spec.js
         │         ├── xyz.model.spec.js
         │         └── xyz.service.spec.js
         │
         ├── reports                                   - reports component
         ├── tables                                    - tables component
         └── <...>


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
