/**
 * Error responses
 */

'use strict';
var consts = require('../../api/constants');

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
};
