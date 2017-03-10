const BaseClientRoute = require('../baseClientRoute');

const routes = [
    '/builder/app/:appId/table/:tblId/form',
    '/builder/app/:appId/table/:tblId/form/:formId',
];

module.exports = {
    addRoutes(app, BASE_PROPS, appConfig) {
        const options = {};

        BaseClientRoute.addRoutesFromArrayOfPaths(app, BASE_PROPS, routes, options);
    }
};
