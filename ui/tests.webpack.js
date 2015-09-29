// es5 shims for Function.prototype.bind, Object.prototype.keys, etc.
//require('core-js/es5');

var context = require.context('./client-react/test', true, /.unit.spec.js$/);
context.keys().forEach(context);

console.log(context.keys());