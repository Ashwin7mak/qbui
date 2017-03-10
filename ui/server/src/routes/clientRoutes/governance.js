const BaseClientRoute = require('../baseClientRoute');

const routes = [
    '/governance/:accountId/users'
];

module.exports = (app, appConfig, baseProps) => {
    const baseClientRoute = new BaseClientRoute(app, appConfig, baseProps);

    return {
        addRoutes() {
            /**
             * Possible option keys are:
             * - title - Sets the page title
             * - bundleFileName - The name of the bundle file to be used for this route. Defaults to bundle.js/bundle.min.js
             * Use the `BaseClientRoute.generateBundleFilePath` function to automatically generate the right bundle file path for the current environment.
             */
            const governanceBundleFileName = baseClientRoute.generateBundleFilePath('governance');
            const options = {title: 'QuickBase Governance', bundleFileName: governanceBundleFileName};

            baseClientRoute.addRoutesFromArrayOfPaths(routes, options);
        }
    };
};
