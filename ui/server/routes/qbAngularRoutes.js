(function () {
    'use strict';

    var log = require('../logger').getLogger(module.filename);

    module.exports = function (app) {

        //  default page -- realm dashboard
        app.route('/').get(function (req, res) {
            log.logRequest(req);
            res.sendfile(app.get('appPath') + '/realm.index.html');
        });

        //  realm dashboard
        app.route('/realm').get(function (req, res) {
            log.logRequest(req);
            res.sendfile(app.get('appPath') + '/realm.index.html');
        });

        //  quickbase application dashboard
        app.route('/qbapp').get(function (req, res) {
            log.logRequest(req);
            res.sendfile(app.get('appPath') + '/qbapp.index.html');
        });

    };

}());
