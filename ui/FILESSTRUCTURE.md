
## QuickBase UI Project Structure

Overview of the UI directory (as of 03-nov-2015)

    ui
     │
     └──client-react
         │
         ├─ dist                                    - distribution folder used by build  (not tracked by git)
         │    │
         │   src                                     - ui client code folder
         │    │  
         │    ├── actions 
         │    ├── assets 
         │    ├── components
         │    ├── config
         │    ├── constants
         │    ├── locales
         │    ├── scripts
         │    ├── services
         │    ├── stores
         │    ├── gallery
         │    ├── utils
         │    └── <...>
         │    │
         │   test                                     - ui client test code folder
         │
        coverage
         │   
         │
        dist                                    - grunt build output folder   (not tracked by git)
         │
        e2e                                     - protractor end to end tests
         |  
         │        
        node_modules                            - the npm library
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
        .gitignore                              - application (client and server) git ignore configuration file
        .eslintrc                               - js code style linter configuration
        .eslintignore                           - folders bypassed by the linter
        .exlint*.png                            - png files to assist with IDE configuration setup
        tests.webpack.js                        - referenced by karma 
        webpack.config.js                       - webpack configuration file



