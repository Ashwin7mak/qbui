(function () {
    'use strict';

    var log = require('../logger').getLogger();

    module.exports = function (app) {

        //  default page -- qbApp dashboard
        app.route('/').get(function (req, res) {
            res.sendfile(app.get('appPath') + '/qbapp.index.html');
        });

        //  quickbase application dashboard
        app.route('/qbapp*').get(function (req, res) {
            res.sendfile(app.get('appPath') + '/qbapp.index.html');
        });

    };

}());
