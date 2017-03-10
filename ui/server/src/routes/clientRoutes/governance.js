const BaseClientRoute = require('../baseClientRoute');

const routes = [
    '/governance/:accountId/users'
];

module.exports = {
    addRoutes(app, appConfig, BASE_PROPS) {
        /**
         * Possible option keys are:
         * - title - Sets the page title
         * - bundleFileName - The name of the bundle file to be used for this route. Defaults to bundle.js/bundle.min.js
         * Use the `BaseClientRoute.generateBundleFilePath` function to automatically generate the right bundle file path for the current environment.
         */
        const governanceBundleFileName = BaseClientRoute.generateBundleFilePath('governance', appConfig);
        const options = {title: 'QuickBase Governance', bundleFileName: governanceBundleFileName};

        BaseClientRoute.addRoutesFromArrayOfPaths(app, BASE_PROPS, routes, options);
    }
};
