/**
 * e2e base module that initializes the domain service modules as well as the base class defined in the server layer
 * Currently recordApi.base.js is the server module which communicates with the Java API.
 * This module needs to be 'required' by all wdio tests (make sure to run the initialize function and set the baseUrl).
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');

    module.exports = function(config) {
        var recordBase = require('../../server/test/api/recordApi.base.js')(config);
        var e2eUtils = require('./e2eUtils.js');
        var appService = require('./services/appService.js');
        var recordService = require('./services/recordService.js');
        var tableService = require('./services/tableService.js');
        var reportService = require('./services/reportService.js');
        var formService = require('./services/formService.js');
        var userService = require('./services/userService.js');
        var roleService = require('./services/roleService.js');

        var e2eBase = {
            // Instantiate recordBase module to use for your tests
            recordBase: recordBase,
            /**
             * Set the baseUrl we want to use to reach out for testing
             * Only run this if you do NOT pass in a config object when requiring the e2eBase module (see wdio config files)
             * Run this BEFORE initialize function below
             * @param baseUrl - The url where your nodejs server is running. example: http://localhost:9001 for e2e tests
             */
            setBaseUrl: function(baseUrl) {
                recordBase.setBaseUrl(baseUrl);
            },
            /**
             * Initialize recordApi.base.js and api.base.js in the Mocha layer (qbui/server package)
             * Only run this if you do NOT pass in a config object when requiring the e2eBase module (see wdio config files)
             * Make sure to run this AFTER setBaseUrl to avoid authentication errors due to ticket for wrong realm
             */
            initialize: function() {
                recordBase.initialize();
            },
            // Initialize the service modules to use the same base class
            appService: appService(recordBase),
            recordService: recordService(recordBase),
            tableService: tableService(recordBase),
            reportService: reportService(recordBase),
            formService: formService(recordBase),
            userService: userService(recordBase),
            roleService: roleService(recordBase),
            // Initialize the utils class
            e2eUtils: e2eUtils(),
            // Common variables
            ticketEndpoint: recordBase.apiBase.resolveTicketEndpoint(),
            // Checks for any JS errors in the browser, resets the browser window size and cleans up the test realm and app
            cleanup: function() {
                //Checks for any JS errors in the browser console
                //browser.manage().logs().get('browser').then(function(browserLog) {
                //    // TODO: Errors in the console need to fix
                //    //expect(browserLog.length).toEqual(0);
                //    if (browserLog.length) {
                //        console.error('Browser console had errors: ' + JSON.stringify(browserLog));
                //    }
                //});
                //Cleanup the realm and app
                return e2eBase.recordBase.apiBase.cleanup();
            },
            // Helper method to get the proper URL for loading the dashboard page containing a list of apps and tables for a realm
            getRequestAppsPageEndpoint: function(realmName) {
                var requestAppsPageEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbase/apps/');
                return requestAppsPageEndPoint;
            },
            // Helper method to get the proper URL for loading the table home page containing a list of tables for a realm for an app
            getRequestTableEndpoint: function(realmName, appId, tableId) {
                var requestTableEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbase/app/' + appId + '/table/' + tableId);
                return requestTableEndPoint;
            },
            // Helper method to get the proper URL for loading the reports page for particular app and particular table for a realm
            getRequestReportsPageEndpoint: function(realmName, appId, tableId, reportId) {
                var requestReportsPageEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbase/app/' + appId + '/table/' + tableId + '/report/' + reportId + '');
                return requestReportsPageEndPoint;
            },
            // Get the proper URL for loading the session ticket page in the browser
            getSessionTicketRequestEndpoint: function(realmName, realmId, ticketEndpoint) {
                var sessionTicketRequestEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, ticketEndpoint + realmId);
                return sessionTicketRequestEndPoint;
            },

            /*
             * Setup method that generates an application, table, report and a specified number of records
             * Creates an App, 1 2 Tables with all Field Types, 10 Records, 1 List All Report with all Features and 1 Form to go with it
             */
            defaultAppSetup: function(tableToFieldToFieldTypeMap, numberOfRecords) {
                var createdApp;
                var MIN_RECORDSCOUNT = 11;

                // Use map of tables passed in or create default
                if (!tableToFieldToFieldTypeMap) {
                    tableToFieldToFieldTypeMap  = e2eConsts.createDefaultTableMap();
                }

                // Use num of records to generate or use 25 by default to enable paging
                if (!numberOfRecords) {
                    numberOfRecords  = e2eConsts.MAX_PAGING_SIZE + 5;
                }

                // Generate the app JSON object
                var generatedApp = e2eBase.appService.generateAppFromMap(tableToFieldToFieldTypeMap);
                // Create the app via the API
                return e2eBase.appService.createApp(generatedApp).then(function(app) {
                    createdApp = app;
                    e2eBase.userService.generateDefaultUserList(createdApp.id);

                    // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                    var table1NonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(createdApp.tables[0]);
                    // Generate the record JSON objects
                    var table1GeneratedRecords = e2eBase.recordService.generateRecords(table1NonBuiltInFields, numberOfRecords);
                    // Add 1 duplicate record
                    var clonedArray = JSON.parse(JSON.stringify(table1GeneratedRecords));
                    var dupRecord = clonedArray[0];
                    // Edit the numeric field so we can check the second level sort (ex: 6.7)
                    dupRecord.forEach(function(field) {
                        if (field.id === 7) {
                            field.value = 1.90;
                        }
                        if (field.id === 11) {
                            field.value = '1977-12-12';
                        }
                    });
                    // Add the new record back in to create
                    table1GeneratedRecords.push(dupRecord);
                    if (numberOfRecords < MIN_RECORDSCOUNT) {
                        // Via the API create the records, a new report, then run the report.
                        return e2eBase.recordService.addRecords(createdApp, createdApp.tables[0], table1GeneratedRecords);
                    } else {
                        // Via the API create the bulk records
                        return e2eBase.recordService.addBulkRecords(createdApp, createdApp.tables[0], table1GeneratedRecords);
                    }
                }).then(function() {
                    // Create a List all report for the first table
                    return e2eBase.reportService.createDefaultReport(createdApp.id, createdApp.tables[0].id, 'Table 1 List All Report', null, null, null, null);
                }).then(function() {
                    // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                    var table1NonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(createdApp.tables[0]);
                    // Generate 1 empty record for Table 1
                    var generatedEmptyRecords = e2eBase.recordService.generateEmptyRecords(table1NonBuiltInFields, 1);
                    return e2eBase.recordService.addRecords(createdApp, createdApp.tables[0], generatedEmptyRecords);
                }).then(function() {
                    // Create the above for table 2
                    if (createdApp.tables[1]) {
                        // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                        var table2NonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(createdApp.tables[1]);
                        // Generate the record JSON objects
                        var table2GeneratedRecords = e2eBase.recordService.generateRecords(table2NonBuiltInFields, numberOfRecords);
                        // Via the API create the records, a new report, then run the report.
                        return e2eBase.recordService.addRecords(createdApp, createdApp.tables[1], table2GeneratedRecords).then(function() {
                            return e2eBase.reportService.createDefaultReport(createdApp.id, createdApp.tables[1].id, 'Table 2 List All Report', null, null, null, null);
                        });
                    }
                }).then(function() {
                    //Create forms for both tables
                    return e2eBase.formService.createDefaultForms(createdApp);
                }).then(function() {
                    // Set default table homepage for Table 1
                    return e2eBase.tableService.setDefaultTableHomePage(createdApp.id, createdApp.tables[0].id, 1);
                }).then(function() {
                    // Set default table homepage for Table 2
                    return e2eBase.tableService.setDefaultTableHomePage(createdApp.id, createdApp.tables[1].id, 1);
                }).then(function() {
                    // Return the createdApp object
                    return createdApp;
                }).catch(function(e) {
                    // Catch any errors and reject the promise with it
                    return Promise.reject(new Error('Error during defaultAppSetup: ' + e.message));
                });
            },

            /*
             * Setup function that will create you all currently supported report types. Calls the default setup functions as well.
             * @param numRecords is how many records will be generated per table
             */
            fullReportsSetup: function(numRecords) {
                var createdApp;

                return this.defaultAppSetup(null, numRecords).then(function(createdAppResponse) {
                    createdApp = createdAppResponse;

                    var TEXT_FID = 6;
                    var NUMERIC_FID = 7;
                    var DATE_FID = 11;
                    var CHECKBOX_FID = 15;

                    // We know the structure of table 1 so can hard code here to generate some more report types
                    // Only show Text, Numeric, Date and Checkbox fields on the report
                    var fids = [TEXT_FID, NUMERIC_FID, DATE_FID, CHECKBOX_FID];
                    // TODO: Going to have to extend this for grouping once implementation is complete
                    // Second level sort, first ascending on the Text field and then descending on the Numeric field
                    var sortList = [
                        {
                            "fieldId": TEXT_FID,
                            "sortOrder": "asc",
                            "groupType": null
                        },
                        {
                            "fieldId": NUMERIC_FID,
                            "sortOrder": "desc",
                            "groupType": null
                        }
                    ];
                    // Use the Text field and Checkbox field for facets
                    var facetFids = [TEXT_FID, CHECKBOX_FID];
                    var reportIds = [];

                    //TODO: Had issue using promise.all here, it wasn't creating all the reports even though was getting responses from all 4 calls
                    // Create report with fids
                    return e2eBase.reportService.createDefaultReport(createdApp.id, createdApp.tables[0].id, 'Report with Custom Fields', fids, null, null, null)
                        .then(function(rid1) {
                            reportIds.push(rid1);
                            // Create report with sortList
                            return e2eBase.reportService.createDefaultReport(createdApp.id, createdApp.tables[0].id, 'Report with Sorting', null, sortList, null, null);
                        }).then(function(rid2) {
                            reportIds.push(rid2);
                            // Create report with facetFids
                            return e2eBase.reportService.createDefaultReport(createdApp.id, createdApp.tables[0].id, 'Report with Facets', null, null, facetFids, null);
                        }).then(function(rid3) {
                            reportIds.push(rid3);
                            // Create report with all params defined
                            return e2eBase.reportService.createDefaultReport(createdApp.id, createdApp.tables[0].id, 'Report with Custom Fields, Sorting, and Facets', fids, sortList, facetFids, null);
                        }).then(function(rid4) {
                            reportIds.push(rid4);
                            return reportIds;
                        });
                }).then(function(reportIds) {
                    // Return back the list of reportIds
                    return [createdApp, reportIds];
                }).catch(function(e) {
                    // Catch any errors and reject the promise with it
                    return Promise.reject(new Error('Error during fullReportsSetup: ' + e.message));
                });
            },

            // Setup method for app schema. Creates the table / field mapping to be generated by basicSetup
            tablesSetUp: function(tableToFieldToFieldTypeMap) {
                //use map of tables passed in
                if (!tableToFieldToFieldTypeMap) {
                    return Promise.reject(new Error("no map of tables to build defined"));
                } else {
                    // Create the app schema via the API
                    return e2eBase.appService.createAppSchema(tableToFieldToFieldTypeMap);
                }
            },

            // Setup method for app data. Creates the records and reports
            recordsSetUp: function(app, recordsConfig) {
                var services = {
                    recordService : this.recordService,
                    tableService : this.tableService,
                    reportService : this.reportService,
                    formService : this.formService
                };
                return e2eBase.recordService.createRecords(app, recordsConfig, services);
            },

            /**
             * Random generate a set of choices for a multi choice field
             * @param type the type of data to generate TEXT or NUMBER
             * @param numChoices - how many choices to generate
             * @param options - optional how to generate the choices
             * TEXT type options
             * {
             *      capitalize: boolean - capitalize the 1st word of each choice, default false,
             *      numWords: number - the number of words in each choice, default 1,
             *      wordType: 'realEnglishNouns' or 'realEnglishNouns' or 'randomLetters' - whether the words generated are
             *                 real english words, nouns or random letters default is realEnglishNouns
             *
             *      randNumWords: boolean - whether the number of words is same for each choice or treated as a maximum
             *                    and each is random number of words, default false,
             *
             *      if wordType is randomLetters the following options apply
             *      wordLength or syllables (optional one or the other not both, if both throws error, default 1 - 3 syllables)
             *                 wordLength : the 1-number of characters in each word
             *                 syllables : the 1-number of syllables in each word
             *
             * }
             * NUMERIC type options {
             *        int: boolean - int or float, default true,
             *        max: the larger number to randomly generate, default - MAX_INT for int or MAX_INT/10000 for float
             *        min: the smallest number to randomly generate, default - MIN_INT for int , -MAX_INT/10000 for float
             * }
             *
             * later other choice types may be added see - https://team.quickbase.com/db/bixuxqie3?a=dr&rid=12
             * @returns {*}
             */
            choicesSetUp(type, numChoices, options) {
                return this.tableService.generateChoices(type, numChoices, options);
            }

        };
        return e2eBase;
    };
}());
