(function() {
    'use strict';
    var log = require('../logger').getLogger();

    module.exports = function(app) {

        app.route('/app/:appId/table/:tblId/report/:rptId').get(function(req, res) {
            log.info('..specific app report request');
            res.sendfile(app.get('appPath') + '/index.html');
        });

        app.route('/app/:appId/table/:tblId/reports').get(function(req, res) {
            log.info('..reports for a given table');
            res.sendfile(app.get('appPath') + '/index.html');
        });

        app.route('/apps').get(function(req, res) {
            log.info('..apps home page.');
            res.sendfile(app.get('appPath') + '/apps.index.html');
        });

        //  default page -- quickbase application dashboard
        app.route('/').get(function(req, res) {
            log.info('..default home page.');
            res.sendfile(app.get('appPath') + '/index.html');
        });

    };

}());