// es5 shims for Function.prototype.bind, Object.prototype.keys, etc.
//require('core-js/es5');

/*
 * This is a shortcut way to require all files in a directory.
 * See webpack docs for how it works
 * https://webpack.github.io/docs/context.html
 */
var clientReactModules = require.context('./client-react/test', true, /.unit.spec.js$/);
clientReactModules.keys().forEach(clientReactModules);

var compLibraryModules = require.context('./componentLibrary/test', true, /.unit.spec.js$/);
compLibraryModules.keys().forEach(compLibraryModules);

var commonModules = require.context('./common/test', true, /.unit.spec.js$/);
commonModules.keys().forEach(commonModules);
