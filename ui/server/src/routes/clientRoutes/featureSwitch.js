const BaseClientRoute = require('../baseClientRoute');

const routes = [
    '/admin/featureSwitches',
    '/admin/featureSwitch/:id'
];

module.exports = {
    addRoutes(app, appConfig, BASE_PROPS) {
        BaseClientRoute.addRoutesFromArrayOfPaths(app, BASE_PROPS, routes);
    }
};
