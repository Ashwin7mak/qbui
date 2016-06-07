/**
 * extend lodash
 */
(function() {
    'use strict';

    var _ = require('lodash');

    _.mixin({
        /**
         * sort a hash by keys
         */
        'sortKeysBy': function (obj, comparator) {
            var keys = _.sortBy(_.keys(obj), function (key) {
                return comparator ? comparator(obj[key], key) : key;
            });
            var newList =  _.map(keys, function (key) {
                return [key, obj[key]];
            });
            var newVars = _.fromPairs(newList);
            return newVars;
        }
    });
}());