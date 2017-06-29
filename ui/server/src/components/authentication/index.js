/**
 * Authentication responses
 */
(function() {
    'use strict';
    var consts = require('../../../../common/src/constants');
    var favicons = require('../../constants/favicons');
    var CommonUrlUtils = require('../../../../common/src/commonUrlUtils');
    var log = require('../../logger').getLogger();
    let routeHelper = require('../../routes/routeHelper');
    let ob32Utils = require('../../utility/ob32Utils');
    const URL = require('url');

    module.exports = function(config) {
        let requestHelper = require('../../api/quickbase/requestHelper')(config);

        function processAuthentication(req, res, viewFilePath, statusCode, message) {
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
            log.info({req: req, res: res}, message);
        }

        /**
         * Based on the URL the user wants to redirect and the legacyBaseUrl specified in
         * the config, to we will return true if the root domains are the same
         * (e.g., quickbase-dev.com, quickbase.com, etc..) otherwise false
         * @param redirectUrl
         * @returns {boolean}
         */
        function isValidRedirect(redirectUrl) {
            const legacyBaseUrl = requestHelper.getLegacyHostTopTwoDomain();
            if (legacyBaseUrl === "") {
                return false;
            }
            // Legacy Base URL will be used in a regex so make sure dots are handled as literals
            const urlRegex = new RegExp(`.*${legacyBaseUrl.replace(/\./g, '\\.')}`);

            // We will verify that the redirect url is on the same
            // domain of legacy stack url specified in the config
            // (e.g., legacyBase is quickbase-dev.com, only redirect on that domain is OK)
            const redirect = URL.parse(redirectUrl);
            if (redirect && redirect.hostname && urlRegex.test(redirect.hostname)) {
                return true;
            }
            return false;
        }

        return {
            signout: function signout(req, res) {
                const isFederated = req.cookies && req.cookies[consts.COOKIES.ISFEDERATED];
                const viewFilePath = 'signout.html';
                const statusCode = 200;
                const message = "User is signing out";
                const hostname = requestHelper.getRequestHost(req, true, false);
                const nsTicketDomain = "." + CommonUrlUtils.getDomain(hostname);
                res.cookie(consts.COOKIES.TICKET, "", {domain: hostname, expires: new Date(0)});
                res.cookie(consts.COOKIES.V2TOV3, "", {domain: hostname, expires: new Date(0)});
                res.cookie(consts.COOKIES.NSTICKET, "", {domain: nsTicketDomain, expires: new Date(0)});
                res.clearCookie(consts.COOKIES.TICKET);
                res.clearCookie(consts.COOKIES.V2TOV3);
                res.clearCookie(consts.COOKIES.NSTICKET);

                // If federated then SignOut of the legacy and land in that legacy sign in page
                if (isFederated && req.headers.accept !== consts.APPLICATION_JSON && req.headers.accept !== consts.APPLICATION_XML) {

                    // Pull the legacy stack url from configs
                    let legacyBase = requestHelper.getLegacyHost();

                    if (legacyBase && legacyBase.length !== 0) {

                        if (legacyBase.charAt(0) === '.') {
                            legacyBase = legacyBase.substring(1);
                        }

                        // Clear the federation cookies because we are no longer signed in here
                        res.cookie(consts.COOKIES.ISFEDERATED, "", {domain: legacyBase, expires: new Date(0), httpOnly: true, secure: true});
                        res.clearCookie(consts.COOKIES.ISFEDERATED);

                        // Redirect
                        var redirectUrl = requestHelper.getLegacyRealmBase(req) + routeHelper.getSignoutLegacyStackRoute();
                        res.redirect(redirectUrl);
                        log.info({req: req, res: res});

                        return;
                    }
                }

                processAuthentication(req, res, viewFilePath, statusCode, message);
            },

            signin: function signin(req, res) {
                var viewFilePath = 'signin.html';
                var statusCode = 200;
                var message = "User is signing in";
                //TODO: when signin is implemented on newstack, update this to create cookie
                //res.cookie(cookies.TICKET,  {path: '/'});
                processAuthentication(req, res, viewFilePath, statusCode, message);
            },

            /**
             * Take the TICKET from the <REALMHOST>_TICKET cookies on the <HOSTNAME>.com domain (e.g., quickbase.com)
             * generated from Legacy Stack NSLoginRedirect endpoint and put it into the TICKET cookie on the
             * <REALMHOST>.v3.<HOSTNAME>.com domain (e.g., team.v3.quickbase.com)
             * @param req
             * @param res
             */
            federation: function ticketFederation(req, res) {
                let hostname = requestHelper.getRequestHost(req, true, false);
                let realmHost = CommonUrlUtils.getSubdomain(hostname);
                let legacyTicketCookieName = `${realmHost}_${consts.COOKIES.TICKET}`;

                // Get the Ticket from the realm-specific cookie
                let ticket = req.cookies[legacyTicketCookieName];

                // Throw a 401 error if we are missing the ticket
                if (ticket === undefined || ticket === null) {
                    let statusCode = 401;
                    return processAuthentication(req, res, "401.html", statusCode, "Missing Ticket");
                }

                // Pull the legacy stack url from configs
                let legacyBase = requestHelper.getLegacyHost();
                if (!legacyBase || legacyBase.length === 0) {
                    let statusCode = 500;
                    return processAuthentication(req, res, "500.html", statusCode, "Legacy stack URL not valid");
                } else if (legacyBase.charAt(0) === '.') {
                    // Remove leading dot
                    legacyBase = legacyBase.substring(1);
                }

                // Expire the realm-specific cookie
                res.cookie(legacyTicketCookieName, "",
                    {
                        domain: legacyBase,
                        expires: new Date(0),
                        httpOnly: true,
                        secure: true
                    });

                // Copy and set the new stack TICKET cookie as a session cookie
                res.cookie(consts.COOKIES.TICKET, ticket,
                    {
                        domain: hostname,
                        expires: 0,
                        httpOnly: true,
                        secure: true
                    });

                // Set the response redirect. If the redirect url does not exist, we will redirect
                // to the legacy stack's 'My Apps' page. If the redirect url is not to a quickbase domain, we will also
                // redirect to the 'My Apps' page.
                let redirectUrl = req.query.url;
                if (!redirectUrl || redirectUrl.length === 0 || !isValidRedirect(redirectUrl))  {
                    redirectUrl = requestHelper.getLegacyRealmBase(req) + routeHelper.getMyAppsLegacyStackRoute();
                }
                res.redirect(redirectUrl);
                log.info({req: req, res: res});
            },

            /**
             * The client code will ask the server for the legacy stack URL in order to redirect to the sign in page.
             * This is needed to support TICKET federation in various environments where the legacy stack URL is
             * specifed in server configs.
             *
             * @param req
             * @param res
             */
            legacyUrl: function legacyRedirectUrl(req, res) {
                let result = {
                    status: 200,
                    legacyUrl: requestHelper.getLegacyRealmBase(req)
                };
                res.json(result, result.status);
            }
        };
    };
}());
