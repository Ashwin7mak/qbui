/**
 * All .js files in the clientRoutes will be auto-loaded as part of the express app setup.
 * To add new client routes, copy this file and rename it to [functionalAreaName].js
 * Then add the routes you need to the routes array.
 *
 * That's it! This file will be auto-loaded and your new routes will be available.
 *
 * Optionally, you may add options (e.g., an alternate bundle or page title) by adding those keys to the `optional` contant
 * within the `addRoutes` function.
 *
 * Remember to restart your node/express server after making changes to one of these files.
 */

const BaseClientRoute = require('../baseClientRoute');

const routes = [
    '/your/path/here',
    '/as/many/paths/as/you/need'
];

module.exports = {
    addRoutes(app, BASE_PROPS, appConfig) {
        /**
         * Possible option keys are:
         * - title - Sets the page title
         * - bundleFileName - The name of the bundle file to be used for this route. Defaults to bundle.js/bundle.min.js
         * Use the `BaseClientRoute.generateBundleFilePath` function to automatically generate the right bundle file path for the current environment.
         */
        const options = {};

        BaseClientRoute.addRoutesFromArrayOfPaths(app, BASE_PROPS, routes, options);
    }
};
