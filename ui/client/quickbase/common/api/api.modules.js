(function() {
    'use strict';

        //  define the quickBase angular apps module
    angular.module('qbse.api',
        [
            'qbse.helper',
            'restangular',
            'ngCookies'
        ]).
        config( function(RestangularProvider) {
            RestangularProvider.setBaseUrl('api/api/v1');

            RestangularProvider.setErrorInterceptor(function(response) {
                //  most likely cause is someone manually editing the url
                if (response.status === 400 || response.status === 404) {
                    window.location.href = '/pageNotFound';
                    return false;
                }

                //  Will redirect all 401(unauthorized) and 403(forbidden) exceptions to unauthorized error page (for now).
                //  TODO: jira-12366 / sub-task: qbse-12503 and qbse-12504
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
