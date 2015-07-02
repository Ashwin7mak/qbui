/**
 *
 */
(function () {
    'use strict';
    var request = require('request'),
        log = require('../logger').getLogger(module.filename),
        _ = require('lodash');

    module.exports = function (app, config, envMapper) {

        //  request helper class
        var env = app.get('env');

        var routesInEnv = envMapper.fetchAllRoutesForEnv(env);
        var allRoutes = envMapper.fetchAllRoutes();

        if (undefined === routesInEnv) {
            log.warn("No routes have been configured for env " + env);
        }

        var getFunctionForRoute;
        var postFunctionForRoute;
        var deleteFunctionForRoute;
        var putFunctionForRoute;
        var patchFunctionForRoute;
        var allFunctionForRoute;

        _.forEach(allRoutes, function (route) {

            //if this route has not been enabled for the env, then map all to a 404
            if(!_.contains(routesInEnv, route, 0)){
                log.info("Routing ALL method for route " + route + " to 404 for environment " + env);
                app.route(route).all(envMapper.fetch404Function());
                return;
            }

            getFunctionForRoute = envMapper.fetchGetFunctionForRoute(route);
            postFunctionForRoute = envMapper.fetchPostFunctionForRoute(route);
            deleteFunctionForRoute = envMapper.fetchDeleteFunctionForRoute(route);
            putFunctionForRoute = envMapper.fetchDeleteFunctionForRoute(route);
            allFunctionForRoute = envMapper.fetchAllFunctionForRoute(route);

            //if this route has an all mapping, then ignore individual mappings
            if (undefined !== allFunctionForRoute) {
                log.info("Routing ALL method for route " + route + " for environment " + env);
                app.route(route).all(allFunctionForRoute);
                return;
            }

            //map each individual mapping understanding that we may want to map the get function but not the post
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
        });
    }
}());
