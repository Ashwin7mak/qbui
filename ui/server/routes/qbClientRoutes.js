(function() {
    'use strict';
    var log = require('../logger').getLogger();

    module.exports = function(app) {


        app.route('/app/table').get(function(req, res) {
            log.info('..opening specific app report request: ' + app.get('appPath') + '/index.html');
            res.sendfile(app.get('appPath') + '/index.html');
        });

        app.route('/app/:appId/table/:tblId/report/:rptId').get(function(req, res) {
            log.info('..opening specific app report request');
            res.sendfile(app.get('appPath') + '/index.html');
        });

        app.route('/apps').get(function(req, res) {
            log.info('..opening apps home page.');
            res.sendfile(app.get('appPath') + '/index.html');
        });

        //  default page -- quickbase application dashboard
        app.route('/').get(function(req, res) {
            log.info('..opening home page.');
            res.sendfile(app.get('appPath') + '/index.html');
        });

    };

}());