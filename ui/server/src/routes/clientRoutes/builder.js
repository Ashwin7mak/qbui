const BaseClientRoute = require('../baseClientRoute');

const routes = [
    '/builder/app/:appId/table/:tblId/form',
    '/builder/app/:appId/table/:tblId/form/:formId',
];

// Routes related to app building functionality (e.g., app, table, forms building)
module.exports = (app, appConfig, baseProps) => {
    const baseClientRoute = new BaseClientRoute(app, appConfig, baseProps);

    return {
        addRoutes() {
            const options = {};

            baseClientRoute.addRoutesFromArrayOfPaths(routes, options);
        }
    };
};
