/**
 * Module containing helper functions which can be used generically across domains and spec files.
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    module.exports = function() {
        var e2eUtils = {
            /**
             * Function that will return you the proper browser window configuration
             * based on the breakpoint size you pass it
             */
            getBrowserBreakpointDimensions: function(breakpointSize) {
                if (breakpointSize === e2eConsts.XLARGE_SIZE) {
                    return {
                        breakpointSize: e2eConsts.XLARGE_SIZE,
                        browserWidth: e2eConsts.XLARGE_BP_WIDTH,
                        browserHeight: e2eConsts.DEFAULT_HEIGHT
                    };
                } else if (breakpointSize === e2eConsts.LARGE_SIZE) {
                    return {
                        breakpointSize: e2eConsts.LARGE_SIZE,
                        browserWidth: e2eConsts.LARGE_BP_WIDTH,
                        browserHeight: e2eConsts.DEFAULT_HEIGHT
                    };
                } else if (breakpointSize === e2eConsts.MEDIUM_SIZE) {
                    return {
                        breakpointSize: e2eConsts.MEDIUM_SIZE,
                        browserWidth: e2eConsts.MEDIUM_BP_WIDTH,
                        browserHeight: e2eConsts.DEFAULT_HEIGHT
                    };
                } else if (breakpointSize === e2eConsts.SMALL_SIZE) {
                    return {
                        breakpointSize: e2eConsts.SMALL_SIZE,
                        browserWidth: e2eConsts.SMALL_BP_WIDTH,
                        browserHeight: e2eConsts.DEFAULT_HEIGHT
                    };
                }
            },
            /**
             * Function that will return you a formatted string containing the current date time
             */
            getCurrentTimestamp: function() {
                var currentDate = new Date();
                var dateTime = (currentDate.getMonth() + 1) + '/' +
                    currentDate.getDate() + '/' +
                    currentDate.getFullYear() + ' @ ' +
                    currentDate.getHours() + ':' +
                    currentDate.getMinutes() + ':' +
                    currentDate.getSeconds();
                return dateTime;
            },
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
