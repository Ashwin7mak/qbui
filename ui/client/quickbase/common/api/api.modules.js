(function() {
    'use strict';

    //  define the quickBase angular apps module
    //
    angular.module('qbse.api',
        [
            'qbse.helper',
            'restangular',
            'ngCookies',
            'angular-uuid-generator'
        ]).
        config( function(RestangularProvider) {
            RestangularProvider.setBaseUrl('api/api/v1');
        }).
        //  run blocks are executed after the config and injector...
        run(['uuid','Restangular','apiConstants', '$cookies', 'qbUtility', function(uuid, Restangular, apiConstants, $cookie, qbUtility) {
            //  include the ticket and a sessionid on every Restangular request
            var headers = {};
            //  generate a uuid for this session id.
            headers[apiConstants.SESSION_HDR] = uuid.v1();

            //  get the ticket from the cookies...and add to the header if found
            var ticket = $cookie.get(apiConstants.TICKET_COOKIE);
            if (ticket) {
                headers[apiConstants.TICKET_HDR] = ticket;
            }

            Restangular.setDefaultHeaders(headers);

            Restangular.setErrorInterceptor(function(response) {
                //  most likely cause is someone manually editing the url
                if (response.status === 400 || response.status === 404) {
                    qbUtility.redirect('/pageNotFound');
                    return false;
                }

                //  Will redirect all 401(unauthorized) and 403(forbidden) exceptions to unauthorized error page (for now).
                //  TODO: jira-12366 / sub-task: qbse-12503 and qbse-12504
                if (response.status === 401 || response.status === 403) {
                    qbUtility.redirect('/unauthorized');
                    return false;
                }

                //  NOTE: not sure if we should be intercepting all 500 exceptions..for now will do so
                if (response.status === 500) {
                    qbUtility.redirect('/internalServerError');
                    return false;
                }

                return true;
            });
        }]);
})();
