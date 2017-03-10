const BaseClientRoute = require('../baseClientRoute');

const routes = [
    '/app/:appId/table/:tblId/report/:rptId',
    '/app/:appId/table/:tblId/report/:rptId/record/:recordId',
    '/app/:appId/table/:tblId/record/:recordId',
    '/app/:appId/table/:tblId/reports',
    '/app/:appId/table/:tblId',
    '/app/:appId/table/:tblId/report/:rptId/fieldWithParentId/:fieldWithParentId/masterRecordId/:masterRecordId',
    '/app/:appId/settings',
    '/app/:appId/users',
    '/app/:appId/properties',
    '/app/:appId',
    '/apps',
];

module.exports = (app, appConfig, baseProps) => {
    const baseClientRoute = new BaseClientRoute(app, appConfig, baseProps);

    return {
        addRoutes() {
            const options = {};

            baseClientRoute.addRoutesFromArrayOfPaths(routes, options);
        }
    };
};


