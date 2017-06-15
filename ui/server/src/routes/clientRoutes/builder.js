const BaseClientRoute = require('../baseClientRoute');

const routes = [
    '/builder/app/:appId/table/:tblId/form',
    '/builder/app/:appId/table/:tblId/form/:formId',
    '/builder/app/:appId/table/:tblId/report/:rptId',
    '/builder/app/:appId/automation/:automationId'
];

// Routes related to app building functionality (e.g., app, table, forms building)
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
