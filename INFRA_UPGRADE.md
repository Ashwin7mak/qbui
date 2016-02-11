# Upgrading to Nexus NPM proxy
1. Engineers need to install Xcode from the app store
2. react-intl versions greater than 1.2.0 do not work with React 0.14+ which is what we use, will need to migrate to react-intl 2.0 going forwards
3. Had to add babel-core to our package.json as some of our modules depend on it, but pull down versions that break themselves (this way we can ensure we have the correct version installed)
4. We had references to a module in router.js that was not part of package.json but was checked in (preventing our build from breaking). Removed references to this code in router.js
5. All changes to checked in modules will occur in a future jira story about upgrading our build process
6. Added a local npm settings file (.npmrc) that tells our project to use our nexus as the registry, this allows other projects on the computer to continue reaching out to the public npm registry.