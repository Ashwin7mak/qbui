const BaseClientRoute = require('../baseClientRoute');

const routes = [
    '/app/:appId/table/:tblId/report/:rptId',
    '/app/:appId/table/:tblId/report/:rptId/fieldWithParentId/:fieldWithParentId/masterRecordId/:masterRecordId',
    '/app/:appId/table/:tblId/report/:rptId/record/:recordId',
    '/app/:appId/table/:tblId/record/:recordId',
    '/app/:appId/table/:tblId/reports',
    '/app/:appId/table/:tblId',
    '/app/:appId/users',
    '/app/:appId',
    '/apps',
    '/settings/app/:appId',
    '/settings/app/:appId/properties',
    '/settings/app/:appId/table/:tblId/properties',
    '/app/:appId/table/:tblId/report/:rptId/record/:recordId/drawerTableId/:drawerTableId/drawerRecId/:drawerRecId/embeddedReportId/:embeddedRptId*'
];

// Routes related to base app functionality (viewing data, modifying records, etc.)
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


