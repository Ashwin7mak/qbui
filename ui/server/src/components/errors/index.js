/**
 * Error responses
 */
(function() {
    'use strict';
    var consts = require('../../../../common/src/constants');
    var favicons = require('../../constants/favicons');
    var log = require('../../logger').getLogger();

    module.exports = function(config) {
        let requestHelper = require('../../../src/api/quickbase/requestHelper')(config);

        function renderView(req, res, viewFilePath, statusCode) {
            var result = {
                status: statusCode
            };

            res.status(result.status);
            //respond with json if requested - for swagger ajax
            if (req.headers.accept === consts.APPLICATION_JSON) {
                res.json(result, result.status);
            } else {
                res.render(viewFilePath, {favicons: favicons, legacyBase: requestHelper.getLegacyHost()}, function(err) {
                    if (err) {
                        return res.json(result, result.status);
                    }
                    res.render(viewFilePath, {favicons: favicons, legacyBase: requestHelper.getLegacyHost()});
                });
            }
            log.error({req: req, res:res}, 'Error fulfilling requested route.');
        }

        return  {
            401: function(req, res) {
                var viewFilePath = '401.html';
                var statusCode = 401;
                renderView(req, res, viewFilePath, statusCode);
            },
            403: function(req, res) {
                var viewFilePath = '403.html';
                var statusCode = 403;
                renderView(req, res, viewFilePath, statusCode);
            },
            404: function(req, res) {
                var viewFilePath = '404.html';
                var statusCode = 404;
                renderView(req, res, viewFilePath, statusCode);
            },
            500: function(req, res) {
                var viewFilePath = '500.html';
                var statusCode = 500;
                renderView(req, res, viewFilePath, statusCode);
            },
            notAvailable: function(req, res) {
                var viewFilePath = 'notAvailable.html';
                var statusCode = 200;
                renderView(req, res, viewFilePath, statusCode);
            }
        };
    };
}());
