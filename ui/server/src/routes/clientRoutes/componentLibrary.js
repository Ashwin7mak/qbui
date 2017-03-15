const BaseClientRoute = require('../baseClientRoute');

const routes = [
    '/components',
    '/components/:componentName'
];

// Routes that load the component library
module.exports = (app, appConfig, baseProps) => {
    const baseClientRoute = new BaseClientRoute(app, appConfig, baseProps);

    return {
        addRoutes() {
            const compBundleFileName = baseClientRoute.generateBundleFilePath('componentLibrary');
            const options = {title: 'QuickBase Component Library', bundleFileName: compBundleFileName};

            baseClientRoute.addRoutesFromArrayOfPaths(routes, options);
        }
    };
};
