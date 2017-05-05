const BaseClientRoute = require('../baseClientRoute');

const routes = [
    '/admin/featureSwitches',
    '/admin/featureSwitch/:id'
];

// Routes related to feature switches
module.exports = (app, appConfig, baseProps) => {
    const baseClientRoute = new BaseClientRoute(app, appConfig, baseProps);

    return {
        addRoutes() {
            const compBundleFileName = baseClientRoute.generateBundleFilePath('bundle');
            const options = {bundleFileName: compBundleFileName};

            baseClientRoute.addRoutesFromArrayOfPaths(routes, options);
        }
    };
};
