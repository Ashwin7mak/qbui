/**
 *
 */
(function () {
    'use strict';
    var request = require('request'),
        log = require('../logger').getLogger(module.filename),
        _ = require('lodash');

    module.exports = function (app, config) {

        //  request helper class
        var env = app.get('env');
        var envMapper = require('./qbEnvironmentRouteMapper')(config);

        var routes = envMapper.fetchAllRoutesForEnv(env);

        if (undefined === routes) {
            log.warn("No routes have been configured for env " + env);
            return;
        }

        var getFunctionForRoute;
        var postFunctionForRoute;
        var deleteFunctionForRoute;
        var putFunctionForRoute;
        var patchFunctionForRoute;
        var allFunctionForRoute;

        _.forEach(routes, function (route) {

            getFunctionForRoute = envMapper.fetchGetFunctionForRoute(route);
            postFunctionForRoute = envMapper.fetchPostFunctionForRoute(route);
            deleteFunctionForRoute = envMapper.fetchDeleteFunctionForRoute(route);
            putFunctionForRoute = envMapper.fetchDeleteFunctionForRoute(route);
            allFunctionForRoute = envMapper.fetchAllFunctionForRoute(route);

            if (undefined !== getFunctionForRoute) {
                log.info("Routing GET method for route " + route + " for environment " + env);
                app.route(route).get(getFunctionForRoute);
            }else{
                log.info("Routing GET method for route " + route + " to 404 for environment " + env);
                app.route(route).get(envMapper.fetch404Function());
            }

            if (undefined !== postFunctionForRoute) {
                log.info("Routing POST method for route " + route + " for environment " + env);
                app.route(route).post(postFunctionForRoute);
            }else{
                log.info("Routing POST method for route " + route + " to 404 for environment " + env);
                app.route(route).post(envMapper.fetch404Function());
            }

            if (undefined !== deleteFunctionForRoute) {
                log.info("Routing DELETE method for route " + route + " for environment " + env);
                app.route(route).delete(deleteFunctionForRoute);
            }else{
                log.info("Routing DELETE method for route " + route + " to 404 for environment " + env);
                app.route(route).delete(envMapper.fetch404Function());
            }

            if (undefined !== putFunctionForRoute) {
                log.info("Routing PUT method for route " + route + " for environment " + env);
                app.route(route).put(putFunctionForRoute);
            }else{
                log.info("Routing PUT method for route " + route + " to 404 for environment " + env);
                app.route(route).put(envMapper.fetch404Function());
            }

            if (undefined !== patchFunctionForRoute) {
                log.info("Routing PATCH method for route " + route + " for environment " + env);
                app.route(route).patch(patchFunctionForRoute);
            }else{
                log.info("Routing PATCH method for route " + route + " to 404 for environment " + env);
                app.route(route).patch(envMapper.fetch404Function());
            }

            if (undefined !== allFunctionForRoute) {
                log.info("Routing ALL method for route " + route + " for environment " + env);
                app.route(route).all(allFunctionForRoute);
            }else{
                log.info("Routing ALL method for route " + route + " to 404 for environment " + env);
                app.route(route).all(envMapper.fetch404Function());
            }
        });
    }
}());
