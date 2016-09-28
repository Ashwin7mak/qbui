/**
 * e2e base module that initializes the domain service modules as well as the base class defined in the server layer
 * Currently recordApi.base.js is the server module which communicates with the Java API.
 * This module needs to be 'required' by all Protractor tests (make sure to run the initialize function and set the baseUrl).
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

        var e2eBase = {
            // Delegate to recordBase to initialize
            recordBase: recordBase,
            // Create a realm
            setUp: function() {
                let defaultBase = config ? config.DOMAIN : 'http://localhost:9000';
                this.setBaseUrl(typeof browser !== 'undefined' ? browser.baseUrl : defaultBase);
                this.initialize();
            },
            initialize: function() {
                recordBase.initialize();
            },
            // Set the baseUrl we want to use to reach out for testing
            setBaseUrl: function(baseUrlConfig) {
                recordBase.setBaseUrl(baseUrlConfig);
            },
            // Initialize the service modules to use the same base class
            appService: appService(recordBase),
            recordService: recordService(recordBase),
            tableService: tableService(),
            reportService: reportService(recordBase),
            formService: formService(recordBase),
            // Initialize the utils class
            e2eUtils: e2eUtils(),
            // Common variables
            ticketEndpoint: recordBase.apiBase.resolveTicketEndpoint(),
            // Checks for any JS errors in the browser, resets the browser window size and cleans up the test realm and app
            cleanup: function(done) {
                //Checks for any JS errors in the browser console
                //browser.manage().logs().get('browser').then(function(browserLog) {
                //    // TODO: Errors in the console need to fix
                //    //expect(browserLog.length).toEqual(0);
                //    if (browserLog.length) {
                //        console.error('Browser console had errors: ' + JSON.stringify(browserLog));
                //    }
                //});
                //Cleanup the realm and app
                e2eBase.recordBase.apiBase.cleanup().then(function() {
                    done();
                });
            },
            // Helper method to get the proper URL for loading the dashboard page containing a list of apps and tables for a realm
            getRequestAppsPageEndpoint: function(realmName) {
                var requestAppsPageEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/apps/');
                return requestAppsPageEndPoint;
            },
            // Helper method to get the proper URL for loading the table home page containing a list of tables for a realm for an app
            getRequestTableEndpoint: function(realmName, appId, tableId) {
                var requestTableEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/app/' + appId + '/table/' + tableId);
                return requestTableEndPoint;
            },
            // Helper method to get the proper URL for loading the reports page for particular app and particular table for a realm
            getRequestReportsPageEndpoint: function(realmName, appId, tableId, reportId) {
                var requestReportsPageEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/app/' + appId + '/table/' + tableId + '/report/' + reportId + '');
                return requestReportsPageEndPoint;
            },
            // Get the proper URL for loading the session ticket page in the browser
            getSessionTicketRequestEndpoint: function(realmName, realmId, ticketEndpoint) {
                var sessionTicketRequestEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, ticketEndpoint + realmId);
                return sessionTicketRequestEndPoint;
            },
            // Resize the browser window to the given pixel width and height. Returns a promise
            resizeBrowser: function(width, height) {
                var deferred = Promise.pending();
                // Define the window size if there is a browser object
                if (typeof browser !== 'undefined') {
                    browser.driver.manage().window().getSize().then(function(dimension) {
                        // Currently our breakpoints only change when browser width is changed so don't need to check height (yet)
                        if (dimension.width === width) {
                            // Do nothing because we are already at the current width
                            deferred.resolve();
                        } else {
                            // Resize browser if not at same width
                            browser.driver.manage().window().setSize(width, height).then(function() {
                                e2eBase.sleep(browser.params.mediumSleep).then(function() {
                                    deferred.resolve();
                                });
                            });
                        }
                    });
                    return deferred.promise;
                } else {
                    return deferred.resolve();
                }
            },

            // Setup method that generates an application, table, report and a specified number of records
            basicSetup: function(tableToFieldToFieldTypeMap, numberOfRecords) {
                var createdApp;
                var MIN_RECORDSCOUNT = 11;
                e2eBase.setUp();
                // Generate the app JSON object
                var generatedApp = e2eBase.appService.generateAppFromMap(tableToFieldToFieldTypeMap);
                // Create the app via the API
                return e2eBase.appService.createApp(generatedApp).then(function(app) {
                    createdApp = app;
                    // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                    var table1NonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(createdApp.tables[0]);
                    // Generate the record JSON objects
                    var table1GeneratedRecords = e2eBase.recordService.generateRecords(table1NonBuiltInFields, numberOfRecords);
                    //Add 1 duplicate record
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
                        e2eBase.recordService.addRecords(createdApp, createdApp.tables[0], table1GeneratedRecords);
                    } else {
                        // Via the API create the bulk records
                        e2eBase.recordService.addBulkRecords(createdApp, createdApp.tables[0], table1GeneratedRecords);
                    }

                    if (createdApp.tables[1]) {
                        // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                        var table2NonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(createdApp.tables[1]);
                        // Generate the record JSON objects
                        var table2GeneratedRecords = e2eBase.recordService.generateRecords(table2NonBuiltInFields, numberOfRecords);
                        // Via the API create the records, a new report, then run the report.
                        e2eBase.recordService.addRecords(createdApp, createdApp.tables[1], table2GeneratedRecords);
                        e2eBase.reportService.createReport(createdApp.id, createdApp.tables[1].id);
                    }
                }).then(function() {
                    //Create a form
                    return e2eBase.formService.createForm(createdApp.id, createdApp.tables[0].id);
                }).then(function() {
                    //TODO: Creating / running a report can be run async so break it out of this chain into a separate function
                    return e2eBase.reportService.createReport(createdApp.id, createdApp.tables[0].id);
                }).then(function(reportId) {
                    return e2eBase.reportService.runReport(createdApp.id, createdApp.tables[0].id, reportId);
                }).then(function(reportRecords) {
                    // Return back the created app and records
                    // Pass it back in an array as promise.resolve can only send back one object
                    return  [createdApp, reportRecords];
                }).catch(function(error) {
                    console.error(JSON.stringify(error));
                });
            },

            makeBasicMap() {
                // Create the table schema (map object) to pass into the app generator
                var tableToFieldToFieldTypeMap = {};
                tableToFieldToFieldTypeMap['Table 1'] = {};
                tableToFieldToFieldTypeMap['Table 1'][e2eConsts.reportFieldNames[1]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.TEXT
                };
                tableToFieldToFieldTypeMap['Table 1'][e2eConsts.reportFieldNames[2]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.NUMERIC
                };
                tableToFieldToFieldTypeMap['Table 1'][e2eConsts.reportFieldNames[3]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.CURRENCY
                };
                tableToFieldToFieldTypeMap['Table 1'][e2eConsts.reportFieldNames[4]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.PERCENT
                };
                tableToFieldToFieldTypeMap['Table 1'][e2eConsts.reportFieldNames[5]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.RATING
                };
                tableToFieldToFieldTypeMap['Table 1'][e2eConsts.reportFieldNames[6]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.DATE
                };
                tableToFieldToFieldTypeMap['Table 1'][e2eConsts.reportFieldNames[7]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.DATE_TIME
                };
                tableToFieldToFieldTypeMap['Table 1'][e2eConsts.reportFieldNames[8]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.TIME_OF_DAY
                };
                tableToFieldToFieldTypeMap['Table 1'][e2eConsts.reportFieldNames[9]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.DURATION
                };
                tableToFieldToFieldTypeMap['Table 1'][e2eConsts.reportFieldNames[10]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.CHECKBOX
                };
                tableToFieldToFieldTypeMap['Table 1'][e2eConsts.reportFieldNames[11]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.PHONE_NUMBER
                };
                tableToFieldToFieldTypeMap['Table 1'][e2eConsts.reportFieldNames[12]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.EMAIL_ADDRESS
                };
                tableToFieldToFieldTypeMap['Table 1'][e2eConsts.reportFieldNames[13]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.URL
                };
                tableToFieldToFieldTypeMap['Table 2'] = {};
                tableToFieldToFieldTypeMap['Table 2'][e2eConsts.reportFieldNames[2]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.TEXT
                };
                tableToFieldToFieldTypeMap['Table 2'][e2eConsts.reportFieldNames[6]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.DATE
                };
                tableToFieldToFieldTypeMap['Table 2'][e2eConsts.reportFieldNames[12]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.PHONE_NUMBER
                };
                tableToFieldToFieldTypeMap['Table 3'] = {};
                tableToFieldToFieldTypeMap['Table 3'][e2eConsts.reportFieldNames[1]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.TEXT
                };
                tableToFieldToFieldTypeMap['Table 3'][e2eConsts.reportFieldNames[6]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.DATE
                };
                tableToFieldToFieldTypeMap['Table 3'][e2eConsts.reportFieldNames[7]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.DATE_TIME
                };
                tableToFieldToFieldTypeMap['Table 3'][e2eConsts.reportFieldNames[10]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.CHECKBOX
                };
                tableToFieldToFieldTypeMap['Table 4'] = {};
                tableToFieldToFieldTypeMap['Table 4'][e2eConsts.reportFieldNames[1]] = {
                    fieldType: consts.SCALAR,
                    dataType: consts.TEXT
                };
                return tableToFieldToFieldTypeMap;
            },

            // Setup method that generates an application, table, report and a specified number of records
            // Creates an App, 1 2 Tables with all Field Types, 10 Records, 1 List All Report with all Features and 1 Form to go with it
            defaultSetup: function(tableToFieldToFieldTypeMap, numberOfRecords) {
                var createdApp;
                // Use map of tables passed in or create basic
                if (!tableToFieldToFieldTypeMap) {
                    tableToFieldToFieldTypeMap  = this.createDefaultTableMap();
                }

                // Use num of records to generate or use 10 by default
                if (!numberOfRecords) {
                    numberOfRecords  = 10;
                }

                e2eBase.setUp();
                // Generate the app JSON object
                var generatedApp = e2eBase.appService.generateAppFromMap(tableToFieldToFieldTypeMap);
                // Create the app via the API
                return e2eBase.appService.createApp(generatedApp).then(function(app) {
                    createdApp = app;
                    // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                    var table1NonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(createdApp.tables[0]);
                    // Generate the record JSON objects
                    var table1GeneratedRecords = e2eBase.recordService.generateRecords(table1NonBuiltInFields, numberOfRecords);

                    // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                    var table2NonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(createdApp.tables[1]);
                    // Generate the record JSON objects
                    var table2GeneratedRecords = e2eBase.recordService.generateRecords(table2NonBuiltInFields, numberOfRecords);

                    var createAppPromises = [];
                    // Via the API create records
                    createAppPromises.push(e2eBase.recordService.addRecords(createdApp, createdApp.tables[0], table1GeneratedRecords));
                    createAppPromises.push(e2eBase.recordService.addRecords(createdApp, createdApp.tables[1], table2GeneratedRecords));
                    // Create a list all report for each table
                    createAppPromises.push(e2eBase.reportService.createDefaultReport(createdApp.id, createdApp.tables[0].id, 'Table 1 List All Report', null, null, null, null));
                    createAppPromises.push(e2eBase.reportService.createDefaultReport(createdApp.id, createdApp.tables[1].id, 'Table 2 List All Report', null, null, null, null));
                    // Create a default form for each table
                    createAppPromises.push(e2eBase.formService.createDefaultForms(createdApp));

                    //TODO: Roles and Permissions
                    //TODO: Table Homepage

                    return Promise.all(createAppPromises);
                }).then(function() {
                    // Return back the created app response object
                    return createdApp;
                }).catch(function(e) {
                    // Catch any errors and reject the promise with it
                    return Promise.reject(new Error('Error during defaultSetup: ', e));
                });
            },

            //TODO Move this into e2eConsts.js
            /*
             * Creates a mapping for two tables with all supported field types that can be passed into the test generators package
             */
            createDefaultTableMap() {
                var table1Name = 'Table 1';
                var table2Name = 'Table 2';

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



            // Setup method for the reports spec files. Creates the table / field mapping to be generated by basicSetup
            reportsBasicSetUp: function(tableToFieldToFieldTypeMap, numRecords) {
                var deferred = Promise.pending();
                var app;
                var recordList;

                //use map of tables passed in or create basic
                if (!tableToFieldToFieldTypeMap) {
                    tableToFieldToFieldTypeMap  = this.makeBasicMap();
                }

                //use num of records to generate or use 10 by default
                if (!numRecords) {
                    numRecords  = 10;
                }

                // Call the basic app setup function
                e2eBase.basicSetup(tableToFieldToFieldTypeMap, numRecords).then(function(results) {
                    // Set your global objects to use in the test functions
                    app = results[0];
                    recordList = results[1];
                    // Return back the created app and records
                    // Pass it back in an array as promise.resolve can only send back one object
                    var appAndRecords = [app, recordList, e2eConsts.reportFieldNames];
                    deferred.resolve(appAndRecords);
                }).catch(function(error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            // Setup method for app schema. Creates the table / field mapping to be generated by basicSetup
            tablesSetUp: function(tableToFieldToFieldTypeMap) {
                //use map of tables passed in
                if (!tableToFieldToFieldTypeMap) {
                    return Promise.reject(new Error("no map of tables to build defined"));
                } else {
                    // Create the app schema via the API
                    e2eBase.setUp();
                    return e2eBase.appService.createAppSchema(tableToFieldToFieldTypeMap);
                }
            },

            // Setup method for app data. Creates the records and reports
            recordsSetUp: function(app, recordsConfig) {
                var services = {
                    recordService : this.recordService,
                    tableService : this.tableService,
                    reportService : this.reportService,
                    formService : this.formService,
                };
                return e2eBase.appService.createRecords(app, recordsConfig, services);
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
            },

            // Helper method to sleep a specified number of seconds
            sleep: function(ms) {
                var deferred = Promise.pending();
                try {
                    browser.driver.sleep(ms);
                    deferred.resolve();
                } catch (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                }
                return deferred.promise;
            }
        };
        return e2eBase;
    };
}());
