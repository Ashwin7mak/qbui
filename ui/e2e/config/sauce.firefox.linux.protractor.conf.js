// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js

'use strict';

exports.config = {
  // The timeout for each script run on the browser. This should be longer
  // than the maximum time your application needs to stabilize between tasks.
  allScriptsTimeout: 110000,

  //The sauce user and access key allow us to run our browser tests remotely on a SauceLabs VM
  sauceUser: "sbg_qbse",
  sauceKey: "ae1f362a-024f-44b1-a428-992defbf0062",

  // A base URL for your application under test will be passed in via grunt config so that we can use whatever url we please

  // list of files / patterns to load in the browser
  specs: [
    '../qbapp/**/*.spec.js'
  ],

  // Patterns to exclude.
  exclude: [],

  // ----- Capabilities to be passed to the webdriver instance ----
  //
  // For a full list of available capabilities, see
  // https://code.google.com/p/selenium/wiki/DesiredCapabilities
  // and
  // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
  capabilities: {
    'browserName': 'firefox',
    tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
    name: process.env.SAUCE_JOB_NAME
  },

  // ----- The test framework -----
  //
  // Jasmine and Cucumber are fully supported as a test and assertion framework.
  // Mocha has limited beta support. You will need to include your own
  // assertion framework if working with mocha.
  framework: 'jasmine',

  // ----- Options to be passed to minijasminenode -----
  //
  // See the full list at https://github.com/juliemr/minijasminenode
  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }
};