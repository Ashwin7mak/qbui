(function() {
    'use strict';
    var log = require('../logger').getLogger();

    module.exports = function(app) {

        app.route('/home').get(function(req, res) {
            log.info('..opening home page.');
            res.sendfile(app.get('appPath') + '/index.html');
        });

        //  default page -- quickbase application dashboard
        app.route('/').get(function(req, res) {
            log.info('..opening home page.');
            res.sendfile(app.get('appPath') + '/index.html');
        });

    };

}());