// es5 shims for Function.prototype.bind, Object.prototype.keys, etc.
//require('core-js/es5');

/*
 * This is a shortcut way to require all files in a directory.
 * See webpack docs for how it works
 * https://webpack.github.io/docs/context.html
 */

var governanceModules = require.context('./test', true, /.unit.spec.js$/);
governanceModules.keys().forEach(governanceModules);
