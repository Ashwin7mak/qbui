(function() {
    'use strict';

    /**
     * Strip object and functions from main object, and stringify the simpler form.
     *
     * @param object
     * @returns string of simplified version of object
     */
    module.exports = simpleStringify;
    function simpleStringify(object) {
        var simpleObject = {};
        for (var prop in object) {
            if (!object.hasOwnProperty(prop)) {
                continue;
            }
            if (typeof(object[prop]) == 'object') {
                continue;
            }
            if (typeof(object[prop]) == 'function') {
                continue;
            }
            simpleObject[prop] = object[prop];
        }
        var cleanedJson = JSON.stringify(simpleObject);
        return cleanedJson;
    }
}());
