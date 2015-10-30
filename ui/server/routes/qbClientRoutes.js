(function() {
    'use strict';
    var log = require('../logger').getLogger();

    var reactViews = require('express-react-views');
    var lodash = require('lodash');
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
            favicon : '/favicon.ico',
            jsPath  : '/dist/',
            settings: {views: viewPath},
            hostBase: (config.isProduction || config.noHotLoad) ? '' : HOT_BASE,
            bundleFileName: config.isProduction ? 'bundle.min.js' : 'bundle.js'
        };
    }


    function renderJsx(res, filename, opts) {
        var templatePath = require.resolve(filename);
        jsxEngine(templatePath, opts, function transformedJsxCallback(err, str) {
            if (!err) {
                log.debug('results html for jsx:' + filename + ' opts: ' + JSON.stringify(opts) + ' html:' + str);
                res.write(str);
                res.end();
            } else {
                log.error('got error server rendering jsx file:' + filename + err.message);
                res.write('error:' + err.message);
                res.end();
            }
        });
    }

    function renderIndex(res) {
        var opts = lodash.merge({}, BASE_PROPS, {title: 'QuickBase'});
        renderJsx(res, './index.jsx', opts);
        //res.sendfile(app.get('appPath') + '/index.html');
    }

    function renderAppsIndex(res) {
        var opts = lodash.merge({}, BASE_PROPS, {
            title                : 'QuickBase Apps',
            styleTagStringContent: 'body>.container {margin-left:0;padding-left:0;}'
        });
        renderJsx(res, './apps.index.jsx', opts);
        // res.sendfile(app.get('appPath') + '/apps.index.html');
    }

    module.exports = function(app, config) {
        getBaseOpts(config);

        app.route('/app/:appId/table/:tblId/report/:rptId').get(function(req, res) {
            log.info('..specific app report request');
            renderIndex(res);
        });

        app.route('/app/:appId/table/:tblId/record/:recordId').get(function(req, res) {
            log.info('..specific record request');
            renderIndex(res);
        });
        app.route('/app/:appId/table/:tblId/dashboardDemo/:rptId').get(function(req, res) {
            log.info('..specific app report request');
            renderIndex(res);
        });

        app.route('/app/:appId/table/:tblId/reports').get(function(req, res) {
            log.info('..reports for a given table');
            renderIndex(res);
        });

        app.route('/app/:appId/table/:tblId').get(function(req, res) {
            log.info('..table homepage request (placeholder)');
            renderIndex(res);
        });

        app.route('/apps').get(function(req, res) {
            log.info('..apps home page.');
            renderAppsIndex(res);
        });

        //  default page -- quickbase application dashboard
        app.route('/').get(function(req, res) {
            log.info('..default home page.');
            renderIndex(res);
        });

    };

}());
