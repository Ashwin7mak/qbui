var log = require('../logger').getLogger();
var reactViews = require('express-react-views');
var lodash = require('lodash');

(function() {
    'use strict';

    var viewPath = __dirname;
    var engineOptions = {
        beautify: true,
    };
    var jsxEngine = reactViews.createEngine(engineOptions);
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
            walkMeJS: config.walkmeJSSnippet,
            isClientPerfTrackingEnabled: config.isProduction || !!config.isClientPerfTrackingEnabled

        };
    }

    function renderJsx(req, res, filename, opts) {
        var templatePath = require.resolve(filename);
        jsxEngine(templatePath, opts, function transformedJsxCallback(err, str) {
            if (!err) {
                res.write(str);
                //log.debug('rendering jsx file:' + filename + '; MESSAGE: ' + str);
                res.end();
            } else {
                log.error({req:req}, 'ERROR rendering jsx file:' + filename + '; MESSAGE: ' + err.message);
                res.write('Error rendering page');
                res.end();
            }
        });
    }

    /**
     * Use options to pass in parameters based on the route
     */
    function renderIndex(req, res, options) {
        var opts = lodash.merge({}, BASE_PROPS, {title: 'QuickBase', req: req}, options);
        renderJsx(req, res, './index.jsx', opts);
    }

    module.exports = function(app, config) {
        getBaseOpts(config);
        var compBundleFileName = config.isProduction ? 'componentLibrary.min.js' : 'componentLibrary.js';

        app.route('/qbase/app/:appId/table/:tblId/report/:rptId').get(function(req, res) {
            renderIndex(req, res);
        });

        app.route('/qbase/app/:appId/table/:tblId/report/:rptId/record/:recordId').get(function(req, res) {
            renderIndex(req, res);
        });

        app.route('/qbase/app/:appId/table/:tblId/record/:recordId').get(function(req, res) {
            renderIndex(req, res);
        });

        app.route('/qbase/app/:appId/table/:tblId/reports').get(function(req, res) {
            renderIndex(req, res);
        });

        app.route('/qbase/app/:appId/table/:tblId').get(function(req, res) {
            renderIndex(req, res);
        });

        app.route('/qbase/app/:appId').get(function(req, res) {
            renderIndex(req, res);
        });

        app.route('/qbase/apps').get(function(req, res) {
            renderIndex(req, res);
        });

        app.route('/qbase/components').get(function(req, res) {
            renderIndex(req, res, {bundleFileName: compBundleFileName});
        });

        app.route('/qbase/components/:componentName').get(function(req, res) {
            renderIndex(req, res, {title: 'QuickBase Component Library', bundleFileName: compBundleFileName});
        });

        //  default application dashboard
        app.route('/qbase/').get(function(req, res) {
            renderIndex(req, res);
        });
    };
}());
