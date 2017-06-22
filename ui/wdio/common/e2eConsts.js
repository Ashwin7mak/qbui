/**
 * Module containing constants which can be used generically across domains and spec files.
 * Created by klabak on 1/4/16.
 */
(function() {
    'use strict';
    // Use client constants if we can
    var clientConsts = require('./../../common/src/constants');

    module.exports = Object.freeze({

        XLARGE_SIZE : 'xlarge',
        LARGE_SIZE  : 'large',
        MEDIUM_SIZE : 'medium',
        SMALL_SIZE  : 'small',

        XLARGE_BP_WIDTH : 2048,
        LARGE_BP_WIDTH : 1025,
        MEDIUM_BP_WIDTH : 641,
        SMALL_BP_WIDTH : 500,
        DEFAULT_HEIGHT : 1536,

        //Wait time Objects
        shortWaitTimeMs : 5000,
        mediumWaitTimeMs : 15000,
        longWaitTimeMs : 30000,
        extraLongWaitTimeMs : 150000,

        userTableFieldNames : ['Name', 'Role', 'Email', 'User name'],

        reportFieldNames : ['Record ID#', 'Text Field', 'Numeric Field', 'Numeric Currency Field', 'Numeric Percent Field', 'Numeric Rating Field',
            'Date Field', 'Date Time Field', 'Time Of Day Field', 'Duration Field', 'Checkbox Field', 'Phone Number Field',
            'Email Address Field', 'Url Field', 'User Field'],

        GET_ANOTHER_RECORD : 'Get another record',

        TABLE1 : 0,
        TABLE2 : 1,
        TABLE3 : 2,
        TABLE4 : 3,
        TABLE5 : 4,
        TABLE6 : 5,
        TABLE7 : 7,
        TABLE8 : 8,
        TABLE9 : 9,
        TABLE10 : 10,
        TABLE11 : 11,
        TABLE12 : 12,
        TABLE13 : 13,

        MAX_PAGING_SIZE : clientConsts.PAGE.DEFAULT_NUM_ROWS,
        DEFAULT_NUM_RECORDS_TO_CREATE : 10,
        DEFAULT_NUM_CHOICES_TO_CREATE : 12,
        DEFAULT_ADMIN_ROLE : 12,

        ADMIN_USERID : 10000,

        ADMIN_ROLEID : 12,
        PARTICIPANT_ROLEID : 11,
        VIEWER_ROLEID : 10,
        NONE_ROLEID : 9,

        user1 :  {
            id: null,
            firstName: 'Steve',
            lastName: 'rodgers',
            screenName: 'Captain America',
            email: 'captain_america@quickbase.com'
        },
        user2 :  {
            id: null,
            screenName: 'spiderman',
            email: 'spiderman@quickbase.com'
        },
        user3 :  {
            id: null,
            firstName: 'Henry',
            lastName: 'King Sr.',
            screenName: 'Brainwave',
            email: 'brainwave@quickbase.com'
        },
        user4 :  {
            id: null,
            email: 'super.man@quickbase.com'
        },

        invalidCredentials: 'Invalid Credentials\nYour authorization credentials are invalid or expired.\nPlease click here to return to QuickBase.',

        fieldType : {
            //Field types
            FORMULA: {
                name: 'FORMULA'
            },
            SCALAR: {
                name: 'SCALAR'
            },
            CONCRETE: {
                name: 'CONCRETE'
            },
            REPORT_LINK: {
                name: 'REPORT_LINK'
            },
            SUMMARY: {
                name: 'SUMMARY'
            },
            LOOKUP: {
                name: 'LOOKUP'
            }
        },

        dataType : {
            //Data types
            CHECKBOX: {
                name:'CHECKBOX',
                columnName:'Checkbox'
            },
            TEXT: {
                name:'TEXT',
                columnName:'Text'
            },
            PHONE_NUMBER: {
                name:'PHONE_NUMBER',
                columnName:'Phone Number'
            },
            DATE_TIME: {
                name:'DATE_TIME',
                columnName:'Date Time'
            },
            DATE: {
                name:'DATE',
                columnName:'Date'
            },
            DURATION: {
                name:'DURATION',
                columnName:'Duration'
            },
            TIME_OF_DAY: {
                name:'TIME_OF_DAY',
                columnName:'Time Of Day'
            },
            NUMERIC: {
                name:'NUMERIC',
                columnName:'Numeric'
            },
            CURRENCY: {
                name:'CURRENCY',
                columnName:'Currency'
            },
            RATING: {
                name:'RATING',
                columnName:'Rating'
            },
            PERCENT: {
                name:'PERCENT',
                columnName:'Percent'
            },
            URL: {
                name:'URL',
                columnName:'URL'
            },
            EMAIL_ADDRESS: {
                name:'EMAIL_ADDRESS',
                columnName:'Email Address'
            },
            USER: {
                name:'USER',
                columnName:'User'
            },
            FILE_ATTACHMENT : {
                name:'FILE_ATTACHMENT',
                columnName:'File Attachment'
            }
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
        },

        /*
         * Creates a mapping for five tables with all supported field types that can be passed into the test generators package
         */
        createDefaultTableMap() {
            let table1Name = 'Table 1', table2Name = 'Table 2', table3Name = 'Parent Table A',
                table4Name = 'Child Table A', table5Name = 'GrandChild Table A';

            // Create the table schema (map object) to pass into the app generator
            var tableToFieldToFieldTypeMap = {};
            tableToFieldToFieldTypeMap[table1Name] = {};
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[1]] = {
                fieldType: consts.SCALAR,
                dataType: consts.TEXT
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[2]] = {
                fieldType: consts.SCALAR,
                dataType: consts.NUMERIC
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[3]] = {
                fieldType: consts.SCALAR,
                dataType: consts.CURRENCY
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[4]] = {
                fieldType: consts.SCALAR,
                dataType: consts.PERCENT
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[5]] = {
                fieldType: consts.SCALAR,
                dataType: consts.RATING
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[6]] = {
                fieldType: consts.SCALAR,
                dataType: consts.DATE
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[7]] = {
                fieldType: consts.SCALAR,
                dataType: consts.DATE_TIME
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[8]] = {
                fieldType: consts.SCALAR,
                dataType: consts.TIME_OF_DAY
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[9]] = {
                fieldType: consts.SCALAR,
                dataType: consts.DURATION
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[10]] = {
                fieldType: consts.SCALAR,
                dataType: consts.CHECKBOX
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[11]] = {
                fieldType: consts.SCALAR,
                dataType: consts.PHONE_NUMBER
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[12]] = {
                fieldType: consts.SCALAR,
                dataType: consts.EMAIL_ADDRESS
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[13]] = {
                fieldType: consts.SCALAR,
                dataType: consts.URL
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[14]] = {
                fieldType: consts.SCALAR,
                dataType: consts.USER
            };
            tableToFieldToFieldTypeMap[table2Name] = {};
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[1]] = {
                fieldType: consts.SCALAR,
                dataType: consts.TEXT
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[2]] = {
                fieldType: consts.SCALAR,
                dataType: consts.NUMERIC
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[3]] = {
                fieldType: consts.SCALAR,
                dataType: consts.CURRENCY
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[4]] = {
                fieldType: consts.SCALAR,
                dataType: consts.PERCENT
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[5]] = {
                fieldType: consts.SCALAR,
                dataType: consts.RATING
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[6]] = {
                fieldType: consts.SCALAR,
                dataType: consts.DATE
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[7]] = {
                fieldType: consts.SCALAR,
                dataType: consts.DATE_TIME
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[8]] = {
                fieldType: consts.SCALAR,
                dataType: consts.TIME_OF_DAY
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[9]] = {
                fieldType: consts.SCALAR,
                dataType: consts.DURATION
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[10]] = {
                fieldType: consts.SCALAR,
                dataType: consts.CHECKBOX
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[11]] = {
                fieldType: consts.SCALAR,
                dataType: consts.PHONE_NUMBER
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[12]] = {
                fieldType: consts.SCALAR,
                dataType: consts.EMAIL_ADDRESS
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[13]] = {
                fieldType: consts.SCALAR,
                dataType: consts.URL
            };
            tableToFieldToFieldTypeMap[table3Name] = {};
            tableToFieldToFieldTypeMap[table3Name][e2eConsts.reportFieldNames[1]] = {
                fieldType: consts.SCALAR,
                dataType: consts.TEXT
            };
            tableToFieldToFieldTypeMap[table3Name][e2eConsts.reportFieldNames[2]] = {
                fieldType: consts.SCALAR,
                dataType: consts.NUMERIC
            };
            tableToFieldToFieldTypeMap[table4Name] = {};
            tableToFieldToFieldTypeMap[table4Name][e2eConsts.reportFieldNames[1]] = {
                fieldType: consts.SCALAR,
                dataType: consts.TEXT
            };
            tableToFieldToFieldTypeMap[table4Name]['Parent Record ID'] = {
                fieldType: consts.SCALAR,
                dataType: consts.NUMERIC
            };
            tableToFieldToFieldTypeMap[table5Name] = {};
            tableToFieldToFieldTypeMap[table5Name][e2eConsts.reportFieldNames[1]] = {
                fieldType: consts.SCALAR,
                dataType: consts.TEXT
            };
            tableToFieldToFieldTypeMap[table5Name]['Parent Record ID'] = {
                fieldType: consts.SCALAR,
                dataType: consts.NUMERIC
            };

            return tableToFieldToFieldTypeMap;
        },

        /*
         * Creates a mapping for two tables with all supported field types that can be passed into the test generators package
         */
        basicTableMap() {
            let table1Name = 'Table 1', table2Name = 'Table 2';

            // Create the table schema (map object) to pass into the app generator
            var tableToFieldToFieldTypeMap = {};
            tableToFieldToFieldTypeMap[table1Name] = {};
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[1]] = {
                fieldType: consts.SCALAR,
                dataType: consts.TEXT,
                unique: true,
                required: true
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[2]] = {
                fieldType: consts.SCALAR,
                dataType: consts.NUMERIC,
                required: true
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[3]] = {
                fieldType: consts.SCALAR,
                dataType: consts.CURRENCY,
                unique: true,
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[4]] = {
                fieldType: consts.SCALAR,
                dataType: consts.PERCENT,
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[5]] = {
                fieldType: consts.SCALAR,
                dataType: consts.RATING,
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[6]] = {
                fieldType: consts.SCALAR,
                dataType: consts.DATE
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[7]] = {
                fieldType: consts.SCALAR,
                dataType: consts.DATE_TIME
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[8]] = {
                fieldType: consts.SCALAR,
                dataType: consts.TIME_OF_DAY
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[9]] = {
                fieldType: consts.SCALAR,
                dataType: consts.DURATION
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[10]] = {
                fieldType: consts.SCALAR,
                dataType: consts.CHECKBOX
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[11]] = {
                fieldType: consts.SCALAR,
                dataType: consts.PHONE_NUMBER
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[12]] = {
                fieldType: consts.SCALAR,
                dataType: consts.EMAIL_ADDRESS
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[13]] = {
                fieldType: consts.SCALAR,
                dataType: consts.URL
            };
            tableToFieldToFieldTypeMap[table1Name][e2eConsts.reportFieldNames[14]] = {
                fieldType: consts.SCALAR,
                dataType: consts.USER
            };
            tableToFieldToFieldTypeMap[table2Name] = {};
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[1]] = {
                fieldType: consts.SCALAR,
                dataType: consts.TEXT
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[2]] = {
                fieldType: consts.SCALAR,
                dataType: consts.NUMERIC
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[3]] = {
                fieldType: consts.SCALAR,
                dataType: consts.CURRENCY
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[4]] = {
                fieldType: consts.SCALAR,
                dataType: consts.PERCENT
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[5]] = {
                fieldType: consts.SCALAR,
                dataType: consts.RATING
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[6]] = {
                fieldType: consts.SCALAR,
                dataType: consts.DATE
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[7]] = {
                fieldType: consts.SCALAR,
                dataType: consts.DATE_TIME
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[8]] = {
                fieldType: consts.SCALAR,
                dataType: consts.TIME_OF_DAY
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[9]] = {
                fieldType: consts.SCALAR,
                dataType: consts.DURATION
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[10]] = {
                fieldType: consts.SCALAR,
                dataType: consts.CHECKBOX
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[11]] = {
                fieldType: consts.SCALAR,
                dataType: consts.PHONE_NUMBER
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[12]] = {
                fieldType: consts.SCALAR,
                dataType: consts.EMAIL_ADDRESS
            };
            tableToFieldToFieldTypeMap[table2Name][e2eConsts.reportFieldNames[13]] = {
                fieldType: consts.SCALAR,
                dataType: consts.URL
            };
            return tableToFieldToFieldTypeMap;
        },
    });

}());
