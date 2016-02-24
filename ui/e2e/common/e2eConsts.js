/**
 * Module containing constants which can be used generically across domains and spec files.
 * Created by klabak on 1/4/16.
 */
(function() {
    'use strict';
    module.exports = Object.freeze({
        XLARGE_BP_WIDTH : 1441,
        LARGE_BP_WIDTH : 1025,
        MEDIUM_BP_WIDTH : 641,
        SMALL_BP_WIDTH : 400,
        DEFAULT_HEIGHT : 1440,

        reportFieldNames : ['Record ID#', 'Text Field', 'Numeric Field', 'Numeric Currency Field', 'Numeric Percent Field', 'Numeric Rating Field',
            'Date Field', 'Date Time Field', 'Time of Day Field', 'Duration Field', 'Checkbox Field', 'Phone Number Field',
            'Email Address Field', 'URL Field'],

        /**
         * Data Provider for the different breakpoints. Also contains the state of the leftNav at each size for assertion
         */
        NavDimensionsDataProvider : function() {
            return [
                {
                    browserWidth: e2eConsts.XLARGE_BP_WIDTH,
                    breakpointSize: 'xlarge',
                    open: true,
                    clientWidth: '399'
                },
                {
                    browserWidth: e2eConsts.LARGE_BP_WIDTH,
                    breakpointSize: 'large',
                    open: true,
                    clientWidth: '299'
                },
                {
                    browserWidth: e2eConsts.MEDIUM_BP_WIDTH,
                    breakpointSize: 'medium',
                    open: true,
                    clientWidth: '199'
                },
                {
                    browserWidth: e2eConsts.SMALL_BP_WIDTH,
                    breakpointSize: 'small',
                    open: false,
                    clientWidth: '39'
                }
            ];
        }
    });

}());
