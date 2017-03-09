var lodash = require('lodash');
var path = require('path');
var baseClientRoute = require('./clientRoutes/baseClientRoute');
var basePath = require('../../../common/src/constants').ROUTES.BASE_CLIENT_ROUTE;

(function() {
    'use strict';

    var viewPath = path.join(__dirname, '/viewComponents');

    var HOT_BASE;
    var BASE_PROPS;

    function getBaseOpts(config) {
        // for hot loading we need to prefix the requests in the html wih the hot loader url
        HOT_BASE = 'http://' + config.ip + ':' + (config.webpackDevServerPort || 3000);
        BASE_PROPS = {
            title   : '',
            lang    : 'en-us',
            jsPath  : '/dist/',
            settings: {views: viewPath},
            hostBase: (config.isProduction || config.noHotLoad) ? '' : HOT_BASE,
            bundleFileName: config.isProduction ? 'bundle.min.js' : 'bundle.js',
            wistiaJs1: config.wistiaScriptPart1,
            wistiaJs2: config.wistiaScriptPart2,
            isClientPerfTrackingEnabled: config.isProduction || !!config.isClientPerfTrackingEnabled
        };
    }

    module.exports = function(app, config) {
        getBaseOpts(config);
        const governanceBundleFileName = config.isProduction ? 'governance.min.js' : 'governance.js';

        const clientReactPaths = [
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

        baseClientRoute.addRoutesFromArrayOfPaths(app, BASE_PROPS, clientReactPaths);

        const featureSwitchRoutes = [
            '/admin/featureSwitches',
            '/admin/featureSwitch/:id'
        ];

        baseClientRoute.addRoutesFromArrayOfPaths(app, BASE_PROPS, featureSwitchRoutes);

        const compBundleFileName = config.isProduction ? 'componentLibrary.min.js' : 'componentLibrary.js';

        const componentLibraryRoutes = [
            '/components',
            '/components/:componentName'
        ];

        baseClientRoute.addRoutesFromArrayOfPaths(app, BASE_PROPS, componentLibraryRoutes, {title: 'QuickBase Component Library', bundleFileName: compBundleFileName});

        const builderRoutes = [
            '/builder/app/:appId/table/:tblId/form',
            '/builder/app/:appId/table/:tblId/form/:formId',
        ];

        baseClientRoute.addRoutesFromArrayOfPaths(app, BASE_PROPS, builderRoutes);

        const governanceRoutes = [
            '/governance/:accountId/users'
        ];

        baseClientRoute.addRoutesFromArrayOfPaths(app, BASE_PROPS, governanceRoutes, {title: 'QuickBase Governance', bundleFileName: governanceBundleFileName});

        //  default application dashboard
        app.route(`${basePath}/`).get(function(req, res) {
            res.redirect(`${basePath}/apps`);
        });
    };
}());
