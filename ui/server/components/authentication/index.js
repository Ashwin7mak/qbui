/**
 * Authentication responses
 */
(function() {
    'use strict';
    var consts = require('../../api/constants');
    var log = require('../../logger').getLogger();

    module.exports.signout = function signout(req, res) {
        var viewFilePath = 'signout.html';
        var statusCode = 200;
        var message = "User is signing out";
        res.cookie('ticket', {expires: new Date(Date.now())});
        res.clearCookie('ticket');
        processAuthentication(req, res, viewFilePath, statusCode, message);
    };

    module.exports.signin = function signin(req, res) {
        var viewFilePath = 'signin.html';
        var statusCode = 200;
        var message = "User is signing in";
        //TODO: when signin is implemented on newstack, update this to create cookie
        //res.cookie('ticket',  {path: '/'});
        processAuthentication(req, res, viewFilePath, statusCode, message);
    };

    function processAuthentication(req, res, viewFilePath, statusCode, message) {
        var result = {
            status: statusCode
        };

        res.status(result.status);
        //respond with json if requested - for swagger ajax
        if (req.headers.accept === consts.APPLICATION_JSON) {
            res.json(result, result.status);
        } else {
            res.render(viewFilePath, function(err) {
                if (err) {
                    return res.json(result, result.status);
                }
                res.render(viewFilePath);
            });
        }
        log.info({req: req, res:res}, message);
    }

}());
