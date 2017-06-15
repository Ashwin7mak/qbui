# Upgrading to Nexus NPM proxy
1. Engineers need to install Xcode from the app store
  1. grunt-protractor-runner (required compilation)
2. react-intl versions greater than 1.2.0 do not work with React 0.14+ which is what we use, will need to migrate to react-intl 2.0 going forwards
3. Had to add babel-core to our package.json as some of our modules depend on it, but pull down versions that break themselves (this way we can ensure we have the correct version installed)
4. We had references to a module in router.js that was not part of package.json but was checked in (preventing our build from breaking). Removed references to this code in router.js
5. All changes to checked in modules will occur in a future jira story about upgrading our build process
6. Added a local npm settings file (.npmrc) that tells our project to use our nexus as the registry, this allows other projects on the computer to continue reaching out to the public npm registry.

#Modules we should upgrade
1. react-intl
2. react-addons-test-utils
3. babel-core
4. lodash
5. bootstrap-sass-loader no longer valid, bootstrap-loader is the new version
6. bunyans
7. grunt-protractor-runner
8. react-redux Anything above 4.4.6 logs a ton of "Warnings: Failed Context Types: Calling PropTypes validators directly is not supported by the 'prop-types' packages" in the console.
9. react-bootstrap Anything above 0.30.7 logs a ton of "Warnings: Failed Context Types: Calling PropTypes validators directly is not supported by the 'prop-types' packages" in the console.
10. webdriverio - Version locked because of breaking change in minor update (trimming strings). Ken will investigate fixes and upgrades.
11. webpack-dev-server - Version locked to 1.16.3 because subsequent minor versions cause problems with icons in Chrome.
12. jasmine-core - Verision locked to 2.5.2. Version 2.6.1 cleans up the document which causes our unit tests to fail. The fault is in our unit tests for not properly cleaning up old DOM nodes.
13. jasmine - Version locked to 2.5.3. Locked along with jasmine-core, see above.
14. appium - version locked to 1.6.4
15. wdio appium service - version locked to 0.2.2
