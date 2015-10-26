/**
 * Module containing helper functions which can be used generically across domains and spec files.
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    module.exports = function() {
        var e2eUtils = {
            /**
             * Helper function that will convert an array of strings to uppercase
             */
            stringArrayToUpperCase: function(array) {
                // Modify the array inline instead of creating a new one
                var index;
                for (index = 0; index < array.length; ++index) {
                    array[index] = array[index].toUpperCase();
                }
                return array;
            }
        };
        return e2eUtils;
    };
}());
