/**
 *
 */
(function () {
    'use strict';
    var request = require('request'),
        log = require('../logger').getLogger(module.filename),
        _ = require('lodash'),
        express = require('express');


    module.exports = function (app, config, envMapper, routeMapper) {

        // This config.env refers to the node env - it is the way in which we know what routes to enable versus disable,
        // and configure anything environment specific.
        // This differs from runtime env which corresponds to process.env.NODE_ENV. This is the way node knows which
        // file to load when creating the express server. We don't want to use this variable as it makes us dependent
        // on generated config in aws. For this reason, the node code maintains it's own notion of environment independent
        // of the config file name loaded on startup
        var env = config.env;

        var allRoutes = routeMapper.fetchAllRoutes();

        if (undefined === allRoutes) {
            log.warn("No routes have been configured for env " + env);
        }

        initializeRoutes(allRoutes, app, routeMapper);

    };

    /**
     * Initialize all routes provided in the routes param. Use the envMapper to get the appropriate function to call for
     * each route
     * @param routes
     * @param app
     * @param envMapper
     */
    function initializeRoutes(routes, app, routeMapper){

        var getFunctionForRoute;
        var postFunctionForRoute;
        var deleteFunctionForRoute;
        var putFunctionForRoute;
        var patchFunctionForRoute;
        var allFunctionForRoute;

        _.forEach(routes, function (route) {

            getFunctionForRoute = routeMapper.fetchGetFunctionForRoute(route);
            postFunctionForRoute = routeMapper.fetchPostFunctionForRoute(route);
            deleteFunctionForRoute = routeMapper.fetchDeleteFunctionForRoute(route);
            putFunctionForRoute = routeMapper.fetchPutFunctionForRoute(route);
            patchFunctionForRoute = routeMapper.fetchPatchFunctionForRoute(route);
            allFunctionForRoute = routeMapper.fetchAllFunctionForRoute(route);

            //if this route has an all mapping, then ignore individual mappings
            if (undefined !== allFunctionForRoute) {
                log.info("Routing ALL method for route " + route);
                app.route(route).all(allFunctionForRoute);
                return;
            }

            //map each individual mapping understanding that we may want to map the get function but not the post
            if (undefined !== getFunctionForRoute) {
                log.info("Routing GET method for route " + route);
                app.route(route).get(getFunctionForRoute);
            }

            if (undefined !== postFunctionForRoute) {
                log.info("Routing POST method for route " + route);
                app.route(route).post(postFunctionForRoute);
            }

            if (undefined !== deleteFunctionForRoute) {
                log.info("Routing DELETE method for route " + route);
                app.route(route).delete(deleteFunctionForRoute);
            }

            if (undefined !== putFunctionForRoute) {
                log.info("Routing PUT method for route " + route);
                app.route(route).put(putFunctionForRoute);
            }

            if (undefined !== patchFunctionForRoute) {
                log.info("Routing PATCH method for route " + route);
                app.route(route).patch(patchFunctionForRoute);
            }
        });
    }
}());
