(function () {
    'use strict';

    module.exports = function (app, config) {

        //  request helper class
        var requestHelper = require('../api/quickbase/requestHelper')(config);

        //  default page -- realm dashboard
        app.route('/').get(function (req, res) {
            requestHelper.logRoute(req);
            res.sendfile(app.get('appPath') + '/realm.index.html');
        });

        //  realm dashboard
        app.route('/realm').get(function (req, res) {
            requestHelper.logRoute(req);
            res.sendfile(app.get('appPath') + '/realm.index.html');
        });

        //  quickbase application dashboard
        app.route('/qbapp').get(function (req, res) {
            requestHelper.logRoute(req);
            res.sendfile(app.get('appPath') + '/qbapp.index.html');
        });

    };

}());
