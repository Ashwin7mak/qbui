(function() {
    'use strict';
    var log = require('../logger').getLogger();

    var reactViews = require('express-react-views');
    var lodash = require('lodash');
    console.log("clientRoutes-dir=" +  __dirname );
    var viewPath =  __dirname;

    module.exports = function(app, config) {
        var jsxEngine =  reactViews.createEngine();

        // for hot loading we need to prefix the requests in the html wih the hot loader url
        var HOT_BASE = 'http://localhost:' + (config.webpackDevServerPort || 3000 );
        var PROD_BASE = '';
        var BASE_PROPS = {
            title: '',
            lang : 'en-us',
            favicon : '/dist/favicon.ico',
            jsPath :  '/dist/',
            settings: {views : viewPath},
            hostBase: config.isProduction ? PROD_BASE : HOT_BASE
        };

        function renderJsx(res, filename, opts) {
            log.info('renderJSX entry file:' + filename + ' opts:' + JSON.stringify(opts))
            var templatePath = require.resolve(filename);
            jsxEngine(templatePath, opts, function transformedJsxCallback(err, str) {
                if (!err) {
                    console.log("results html for:" + filename + " opts: " + JSON.stringify(opts) + " html:" + str);
                    res.write(str);
                    res.end();
                } else {
                    log.error("got error in jsx file:" + filename + e.message);
                    res.write("error:" + error.message);
                    res.end();
                }
            });
        }

        function renderIndex(res) {
            var opts =  lodash.merge({}, BASE_PROPS, { title: 'QuickBase'});
            renderJsx(res, './index.jsx', opts);
            //res.sendfile(app.get('appPath') + '/index.html');
        }

        function renderAppsIndex(res) {
            var opts = lodash.merge({}, BASE_PROPS, {
                title: 'QuickBase Apps',
                styleTagStringContent : 'body>.container {margin-left:0;padding-left:0;}'
            });
            renderJsx(res, './apps.index.jsx', opts);
            // res.sendfile(app.get('appPath') + '/apps.index.html');
        }

        app.route('/app/:appId/table/:tblId/report/:rptId').get(function(req, res) {
            log.info('..specific app report request');
            renderIndex(res);
        });

        app.route('/app/:appId/table/:tblId/reports').get(function(req, res) {
            log.info('..reports for a given table');
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