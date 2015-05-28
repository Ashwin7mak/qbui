(function() {
    'use strict';

        //  define the quickBase angular apps module
    angular.module('qbse.api',
        [
            'restangular',
            'ngCookies'
        ]).
        config( function(RestangularProvider) {
            //TODO move baseUrl  to constants
            RestangularProvider.setBaseUrl('/api/v1');

            RestangularProvider.setErrorInterceptor(function(response) {
                //  most likely cause is someone manually editing the url
                if (response.status === 400 || response.status === 404) {
                    window.location.href = '/pageNotFound';
                    return false;
                }

                //  Will redirect all 401(unauthorized) and 403(forbidden) exceptions to unauthorized error page (for now).
                //  TODO: post lighthouse: if unauthorized, provide mechanism to callback
                //  TODO: to the original request after a successful login...for 403..need to define??
                if (response.status === 401 || response.status === 403) {
                    window.location.href = '/unauthorized';
                    return false;
                }

                //  TODO: not sure if we should be intercepting all 500 exceptions
                if (response.status === 500) {
                    window.location.href = '/internalServerError';
                    return false;
                }

                return true;
            });
        });
})();
