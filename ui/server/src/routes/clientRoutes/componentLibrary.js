const BaseClientRoute = require('../baseClientRoute');

const routes = [
    '/components',
    '/components/:componentName'
];

module.exports = {
    addRoutes(app, appConfig, BASE_PROPS) {
        const compBundleFileName = BaseClientRoute.generateBundleFilePath('componentLibrary', appConfig);
        const options = {title: 'QuickBase Component Library', bundleFileName: compBundleFileName};

        BaseClientRoute.addRoutesFromArrayOfPaths(app, BASE_PROPS, routes, options);
    }
};
