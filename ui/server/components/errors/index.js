/**
 * Error responses
 */
(function() {
'use strict';
var consts = require('../../api/constants');
var log = require('../../logger').getLogger();

module.exports[403] = function unauthorized(req, res) {
    var viewFilePath = '403';
    var statusCode = 403;
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
    log.logRequest(req, __filename);
};

module.exports[404] = function pageNotFound(req, res) {
    var viewFilePath = '404';
    var statusCode = 404;
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
    log.logRequest(req, __filename);

};

module.exports[500] = function internalServerError(req, res) {
    var viewFilePath = '500';
    var statusCode = 500;
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
    log.logRequest(req, __filename);
};

}());