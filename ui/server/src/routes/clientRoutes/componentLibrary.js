const BaseClientRoute = require('../baseClientRoute');

const routes = [
    '/components',
    '/components/:componentName'
];

module.exports = {
    addRoutes(app, BASE_PROPS, appConfig) {
        const compBundleFileName = BaseClientRoute.generateBundleFilePath('componentLibrary', appConfig);
        const options = {title: 'QuickBase Component Library', bundleFileName: compBundleFileName};

        BaseClientRoute.addRoutesFromArrayOfPaths(app, BASE_PROPS, routes, options);
    }
};
