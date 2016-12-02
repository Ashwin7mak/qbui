/**
 * Error responses
 */
(function() {
    'use strict';
    var consts = require('../../../../common/src/constants');
    var log = require('../../logger').getLogger();
    var favicons = require('../../constants/favicons');

    module.exports[401] = function unauthorized(req, res) {
        var viewFilePath = '401.html';
        var statusCode = 401;
        processError(req, res, viewFilePath, statusCode);
    };

    module.exports[403] = function forbidden(req, res) {
        var viewFilePath = '403.html';
        var statusCode = 403;
        processError(req, res, viewFilePath, statusCode);
    };

    module.exports[404] = function pageNotFound(req, res) {
        var viewFilePath = '404.html';
        var statusCode = 404;
        processError(req, res, viewFilePath, statusCode);
    };

    module.exports[500] = function internalServerError(req, res) {
        var viewFilePath = '500.html';
        var statusCode = 500;
        processError(req, res, viewFilePath, statusCode);
    };

    function processError(req, res, viewFilePath, statusCode) {
        var result = {
            status: statusCode
        };

        res.status(result.status);
        //respond with json if requested - for swagger ajax
        if (req.headers.accept === consts.APPLICATION_JSON) {
            res.json(result);
        } else {
            res.render(viewFilePath, {favicons: favicons});
        }
        log.error({req: req, res: res}, 'Error fulfilling requested route.');
    }

}());
