/**
 * TODO: remove this function when React is upgraded to v15.3 or above.
 *
 * Using React Router 4 with older React versions throws LOTS of errors like the following:
 *   ERROR: 'Warning: Failed Context Types: Calling PropTypes validators directly is not supported
 *   by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at
 *   http://fb.me/use-check-prop-types Check the render method of `Constructor`.'
 *
 * these warnings will go away once we upgrade to react v15.3.
 * Untils then, disable printing
 * see https://github.com/reactjs/prop-types/blob/master/README.md#what-happens-on-other-react-versions
 */
/*eslint no-console:0 */
console.log("All 'Failed Context Types' warning messages logged by the use of React Router 4 are" +
    " temporarily disabled from printing to the console until React is upgraded to v15.3.0" +
    " see http://fb.me/use-check-prop-types");
jasmine.getEnv().topSuite().beforeEach({fn: function() {
    let error = console.error;
    console.error = function() {
        if (arguments && arguments[0] && !arguments[0].includes("Warning: Failed Context Types: Calling PropTypes validators directly is not supported by the \`prop-types\` package.")) {
            error.apply(console, arguments);
        }
    };
}});
