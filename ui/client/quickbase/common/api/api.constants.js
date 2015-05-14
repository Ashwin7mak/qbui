(function() {
    'use strict';
    /**
     * define the QuickBase API constants for client use
     **/
    angular
        //
        .module('qbse.api')
        .constant('apiConstants', {
            //Field types
            CURRENCY           : 'CURRENCY',
            DATE               : 'DATE',
            DATE_TIME          : 'DATE_TIME',
            EMAIL_ADDRESS      : 'EMAIL_ADDRESS',
            FORMULA_CURRENCY   : 'FORMULA_CURRENCY',
            FORMULA_DATE       : 'FORMULA_DATE',
            FORMULA_DATE_TIME  : 'FORMULA_DATE_TIME',
            FORMULA_NUMERIC    : 'FORMULA_NUMERIC',
            FORMULA_PERCENT    : 'FORMULA_PERCENT',
            FORMULA_TIME_OF_DAY: 'FORMULA_TIME_OF_DAY',
            NUMERIC            : 'NUMERIC',
            PERCENT            : 'PERCENT',
            PHONE_NUMBER       : 'PHONE_NUMBER',
            TEXT               : 'TEXT',
            TIME_OF_DAY        : 'TIME_OF_DAY',
            URL                : 'URL'
        });
})();