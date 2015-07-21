(function () {
    'use strict';

    module.exports = function (app) {

        //  quickbase application dashboard
        app.route('/qbapp*').get(function (req, res) {
            res.sendfile(app.get('appPath') + '/qbapp.index.html');
        });

        //  default page -- qbApp dashboard
        app.route('/').get(function (req, res) {
            res.sendfile(app.get('appPath') + '/qbapp.index.html');
        });

    };

}());
