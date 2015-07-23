(function () {
    'use strict';
    var log = require('../logger').getLogger();

    module.exports = function (app) {

        //  specific quickbase report request
        app.route('/qbapp/report/apps/:appId/tables/:tblId/report/:rptId').get(function (req, res) {
            log.info('..opening quickbase report request');
            res.sendfile(app.get('appPath') + '/report.index.html');
        });

        //  quickbase application dashboard
        app.route('/qbapp*').get(function (req, res) {
            log.info('..opening angular qbapp dashboard.');
            res.sendfile(app.get('appPath') + '/qbapp.index.html');
        });

        //  default page -- quickbase application dashboard
        app.route('/').get(function (req, res) {
            log.info('..opening angular qbapp dashboard.');
            res.sendfile(app.get('appPath') + '/qbapp.index.html');
        });

    };

}());
