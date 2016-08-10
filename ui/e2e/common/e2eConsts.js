/**
 * Module containing constants which can be used generically across domains and spec files.
 * Created by klabak on 1/4/16.
 */
(function() {
    'use strict';
    module.exports = Object.freeze({

        XLARGE_SIZE : 'xlarge',
        LARGE_SIZE  : 'large',
        MEDIUM_SIZE : 'medium',
        SMALL_SIZE  : 'small',

        XLARGE_BP_WIDTH : 1441,
        LARGE_BP_WIDTH : 1025,
        MEDIUM_BP_WIDTH : 641,
        SMALL_BP_WIDTH : 500,
        DEFAULT_HEIGHT : 1440,

        reportFieldNames : ['Record ID#', 'Text Field', 'Numeric Field', 'Numeric Currency Field', 'Numeric Percent Field', 'Numeric Rating Field',
            'Date Field', 'Date Time Field', 'Time of Day Field', 'Duration Field', 'Checkbox Field', 'Phone Number Field',
            'Email Address Field', 'URL Field'],

        TABLE1 : 0,
        TABLE2 : 1,
        TABLE3 : 2,
        TABLE4 : 3,

        invalidCredentials: 'Invalid Credentials\nYour authorization credentials are invalid or expired.\nPlease click here to return to QuickBase.',

        fieldType : {
            //Field types
            FORMULA: {
                name: 'FORMULA',
                otherInfo: ''
            },
            SCALAR: {
                name: 'SCALAR',
                otherInfo: ''
            },
            CONCRETE: {
                name: 'CONCRETE',
                otherInfo: ''
            },
            REPORT_LINK: {
                name: 'REPORT_LINK',
                otherInfo: ''
            },
            SUMMARY: {
                name: 'SUMMARY',
                otherInfo: ''
            },
            LOOKUP: {
                name: 'LOOKUP',
                otherInfo: ''
            }
        },

        dataType : {
            //Data types
            CHECKBOX        : {
                name:'CHECKBOX',
                columnName:'Checkbox',
                otherInfo:'',
            },
            TEXT            : {
                name:'TEXT',
                columnName:'Text',
                otherInfo:'',
            },
            PHONE_NUMBER    : {
                name:'PHONE_NUMBER',
                columnName:'Phone Number',
                otherInfo:'',
            },
            DATE_TIME       : {
                name:'DATE_TIME',
                columnName:'Date Time',
                otherInfo:'',
            },
            DATE            : {
                name:'DATE',
                columnName:'Date',
                otherInfo:'',
            },
            DURATION        : {
                name:'DURATION',
                columnName:'Duration',
                otherInfo:'',
            },
            TIME_OF_DAY     : {
                name:'TIME_OF_DAY',
                columnName:'Time Of Day',
                otherInfo:'',
            },
            NUMERIC         : {
                name:'NUMERIC',
                columnName:'Numeric',
                otherInfo:'',
            },
            CURRENCY        : {
                name:'CURRENCY',
                columnName:'Currency',
                otherInfo:'',
            },
            RATING          : {
                name:'RATING',
                columnName:'Rating',
                otherInfo:'',
            },
            PERCENT         : {
                name:'PERCENT',
                columnName:'Percent',
                otherInfo:'',
            },
            URL             : {
                name:'URL',
                columnName:'URL',
                otherInfo:'',
            },
            EMAIL_ADDRESS   : {
                name:'EMAIL_ADDRESS',
                columnName:'Email Address',
                otherInfo:'',
            },
            USER            : {
                name:'USER',
                columnName:'User',
                otherInfo:'',
            },
            FILE_ATTACHMENT : {
                name:'FILE_ATTACHMENT',
                columnName:'File Attachment',
                otherInfo:'',
            },
        },

        /**
         * Data Provider for the different breakpoints. Also contains the state of the leftNav at each size for assertion
         */
        NavDimensionsDataProvider : function() {
            return [
                {
                    browserWidth: e2eConsts.XLARGE_BP_WIDTH,
                    breakpointSize: 'xlarge',
                    open: true,
                    offsetWidth: '300'
                },
                {
                    browserWidth: e2eConsts.LARGE_BP_WIDTH,
                    breakpointSize: 'large',
                    open: true,
                    offsetWidth: '220'
                },
                {
                    browserWidth: e2eConsts.MEDIUM_BP_WIDTH,
                    breakpointSize: 'medium',
                    open: true,
                    offsetWidth: '200'
                }
                //{
                //    browserWidth: e2eConsts.SMALL_BP_WIDTH,
                //    breakpointSize: 'small',
                //    open: true,
                //    offsetWidth: '300'
                //}
            ];
        }
    });

}());
