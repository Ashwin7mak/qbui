// es5 shims for Function.prototype.bind, Object.prototype.keys, etc.
//require('core-js/es5');

/*
 * This is a shortcut way to require custom files in a directory.
 * Run karma test with env var KARMA_USE_CUSTOM=true to pick this one instead of full list tests.webpack.js
 *
 * See webpack docs for how it works
 * https://webpack.github.io/docs/context.html
 *
 * the require.context function allows you to pass three parameters:
 *  - the directory to match within,
 * - a boolean flag to include or exclude subdirectories,
 * - a regular expression to match files against.
 *
 */

var clientReactModules = require.context('./client-react/test/reducers', true, /report.unit.spec.js$/);
console.log("Will run test for:" + JSON.stringify(clientReactModules.keys()));
clientReactModules.keys().forEach(clientReactModules);
