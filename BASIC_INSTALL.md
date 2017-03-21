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

See [notes about the above configuration](ui/README.md#configuring)


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
See [testing instructions](ui/README.md#testing)

## Troubleshooting
See [POSSIBLE ISSUES -- and how to resolve](ui/README.md#troubleshooting)
