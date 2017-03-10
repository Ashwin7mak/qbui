const BaseClientRoute = require('../baseClientRoute');

const routes = [
    '/admin/featureSwitches',
    '/admin/featureSwitch/:id'
];

module.exports = {
    addRoutes(app, BASE_PROPS, appConfig) {
        BaseClientRoute.addRoutesFromArrayOfPaths(app, BASE_PROPS, routes);
    }
};
