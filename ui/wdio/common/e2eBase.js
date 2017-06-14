/**
 * e2e base module that initializes the domain service modules as well as the base class defined in the Node server layer
 * Currently recordApi.base.js is the server module which communicates with the Java API.
 * This module needs to be 'required' by all wdio tests (make sure to run the initialize function and set the baseUrl).
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');
    // Logging library
    var log = require('../../server/src/logger').getLogger();

    module.exports = function(config) {
        var recordBase = require('../../server/test/api/recordApi.base.js')(config);
        let AutomationApi = require('../../server/test/api/automationsApi.js');
        var e2eUtils = require('./e2eUtils.js');
        var appService = require('./services/appService.js');
        var recordService = require('./services/recordService.js');
        var tableService = require('./services/tableService.js');
        var reportService = require('./services/reportService.js');
        var formService = require('./services/formService.js');
        var userService = require('./services/userService.js');
        var roleService = require('./services/roleService.js');
        var relationshipService = require('./services/relationshipService.js');
        let AutomationsService = require('./services/automationsService.js');

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
            relationshipService: relationshipService(recordBase),
            automationsService: new AutomationsService(new AutomationApi(recordBase.apiBase)),
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
                return e2eBase.recordBase.apiBase.cleanup().catch(function(error) {
                    log.error('Error during cleanup: ' + JSON.stringify(error));
                    return promise.reject(error);
                });
            },
            // Helper method to get the proper URL for loading the dashboard page containing a list of apps and tables for a realm
            getRequestAppsPageEndpoint: function(realmName) {
                var requestAppsPageEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbase/apps/');
                return requestAppsPageEndPoint;
            },
            // Helper method to get the proper URL for loading the app in an realm
            getRequestAppPageEndpoint: function(realmName, appId) {
                var requestAppsPageEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbase/app/' + appId);
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
            // Helper method to get the proper URL for loading the user management page containing a list of users for an app
            getRequestUsersEndpoint: function(realmName, appId) {
                var requestUsersEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbase/app/' + appId + '/users/');
                return requestUsersEndPoint;
            },

            /**
             * Setup method that generates an app, table, list all report, forms, default table homepage, a set of users and a specified number of records
             * @param tableToFieldToFieldTypeMap - Map containing the structure of the app, tables and fields
             * @param numberOfRecords - Number of records to create per table in the app
             * @returns A promise function returning the created JSON app object from the createApp API call
             */
            basicAppSetup: function(tableToFieldToFieldTypeMap, numberOfRecords) {
                var createdApp;

                // Use map of tables passed in or create default
                if (!tableToFieldToFieldTypeMap) {
                    tableToFieldToFieldTypeMap  = e2eConsts.createDefaultTableMap();
                }

                // Use num of records to generate or use the default
                if (!numberOfRecords) {
                    numberOfRecords  = e2eConsts.DEFAULT_NUM_RECORDS_TO_CREATE;
                }

                // Generate the app JSON object
                var generatedApp = e2eBase.appService.generateAppFromMap(tableToFieldToFieldTypeMap);
                // Create the app via the API
                return e2eBase.appService.createApp(generatedApp).then(function(appResponse) {
                    // Set the global app object for use below
                    createdApp = appResponse;

                    let tableSetupPromises = [];
                    // If using JS for loops with promise functions make sure to use Bluebird's Promise.each function
                    // otherwise errors can be swallowed!
                    createdApp.tables.forEach(function(table, index) {
                        // Load an array with the promise functions you want to execute
                        tableSetupPromises.push(function() {
                            // Generate and add records to each table (include a dupe and an empty record)
                            return e2eBase.recordService.addRecordsToTable(createdApp, index, numberOfRecords, true, true);
                        });
                        tableSetupPromises.push(function() {
                            // Create a List all report for each table
                            return e2eBase.reportService.createCustomReport(createdApp.id, table.id, 'List All Report', null, null, null, null);
                        });
                        tableSetupPromises.push(function() {
                            // Set the default table homepage for each
                            return e2eBase.tableService.setDefaultTableHomePage(createdApp.id, table.id, 1);
                        });
                    });
                    // Bluebird's promise.each function (executes each promise sequentially)
                    return promise.each(tableSetupPromises, function(queueItem) {
                        // This is an iterator that executes each Promise function in the array here
                        return queueItem();
                    });
                }).then(function() {
                    // Generate and add the default set of Users to the app
                    return e2eBase.userService.addDefaultUserListToApp(createdApp.id);
                }).then(function() {
                    // Create forms for both tables
                    return e2eBase.formService.createDefaultForms(createdApp);
                }).then(function() {
                    // Create a relationship between the 3rd and 4th tables (Child Table's Numeric Field relates to Parent Table's Record ID)
                    if (createdApp.tables[2] && createdApp.tables[3]) {
                        return e2eBase.relationshipService.createOneToOneRelationship(createdApp, createdApp.tables[2], createdApp.tables[3], 7);
                    }
                }).then(function() {
                    return e2eBase.relationshipService.retrieveSavedRelationships(createdApp);
                }).then(function(savedRelationships) {
                    return e2eBase.relationshipService.addChildReportsToTableForms(createdApp, savedRelationships);
                }).then(function() {
                    // Return the createdApp object
                    return createdApp;
                }).catch(function(error) {
                    // Catch any errors and reject the promise with it
                    log.error('Error during basicAppSetup');
                    return promise.reject(error);
                });
            },

            createApp: function(app) {
                return e2eBase.appService.createApp(app).then(function(appResponse) {
                    //add more functionality as needed
                    return appResponse;
                }).catch(function(error) {
                    log.error('Error during app creation.');
                    return promise.reject(error);
                });
            },

            /*
             * Setup method that generates an application, and a table
             * Creates an App, i tables with passed Field Types, empty Records
             */
            createAppWithEmptyRecordsInTable: function(tableToFieldToFieldTypeMap) {
                var createdApp;

                // Use map of tables passed in or create default
                if (!tableToFieldToFieldTypeMap) {
                    tableToFieldToFieldTypeMap = e2eConsts.createDefaultTableMap();
                }

                // Generate the app JSON object
                var generatedApp = e2eBase.appService.generateAppFromMap(tableToFieldToFieldTypeMap);
                // Create the app via the API
                return e2eBase.appService.createApp(generatedApp).then(function(appResponse) {
                    // Set the global app object for use below
                    createdApp = appResponse;
                }).then(function() {
                    // Return the createdApp object
                    return createdApp;
                }).catch(function(error) {
                    // Catch any errors and reject the promise with it
                    log.error('Error during createAppWithEmptyRecordsInTable');
                    return promise.reject(error);
                });
            },

            /**
             * Setup function that will create you all currently supported report types. Calls the basicAppSetup function as well.
             * @param numRecords - How many records will be generated per table
             * @returns A promise function that resolves to an array containing the createApp JSON object and an array of created reportIds
             */
            fullReportsSetup: function(numRecords) {
                var createdApp;

                return this.basicAppSetup(null, numRecords).then(function(createdAppResponse) {
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

                    // Array of promise functions
                    let createReportPromises = [];

                    // Load the array with the promise functions you want to execute
                    createReportPromises.push(function() {
                        // Create report with fids
                        return e2eBase.reportService.createCustomReport(createdApp.id, createdApp.tables[0].id, 'Report with Custom Fields', fids, null, null, null);
                    });
                    createReportPromises.push(function() {
                        // Create report with sortList
                        return e2eBase.reportService.createCustomReport(createdApp.id, createdApp.tables[0].id, 'Report with Sorting', null, sortList, null, null);
                    });
                    createReportPromises.push(function() {
                        // Create report with sortList
                        return e2eBase.reportService.createCustomReport(createdApp.id, createdApp.tables[0].id, 'Report with Sorting', null, sortList, null, null);
                    });
                    createReportPromises.push(function() {
                        // Create report with all params defined
                        return e2eBase.reportService.createCustomReport(createdApp.id, createdApp.tables[0].id, 'Report with Custom Fields, Sorting, and Facets', fids, sortList, facetFids, null);
                    });

                    // Create an array to collect the results of each promise call (in this case each create report call returns a reportId)
                    let reportIds = [];

                    // Bluebird's promise.each function (executes each promise sequentially)
                    return promise.each(createReportPromises, function(queueItem) {
                        // This is an iterator that executes each Promise function in the array here
                        return queueItem().then(function(result) {
                            // Collect the returned ids from each create report API call
                            reportIds.push(result);
                        });
                    }).then(function() {
                        // Return your array for use later
                        return reportIds;
                    });
                }).then(function(reportIds) {
                    // Return back the created app and list of reportIds
                    return [createdApp, reportIds];
                }).catch(function(error) {
                    // Catch any errors and reject the promise with it
                    log.error('Error during fullReportsSetup');
                    return promise.reject(error);
                });
            }
        };
        return e2eBase;
    };
}());
