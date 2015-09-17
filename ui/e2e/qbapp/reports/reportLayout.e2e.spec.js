// jscs:disable requireDotNotation
// jshint sub: true
(function() {
    /**
     * E2E tests for the Report layout
     * based on reportService created by klabak on 6/1/15,
     * cmartinez2 6/21/15
     */
    'use strict';

    // Uses the base / constants modules in the Node Server layer
    // Launches a new instance of the Express Server
    var consts = require('../../../server/api/constants.js');
    var recordBase = require('../../../server/api/test/recordApi.base.js')();

    // Require the generator modules in the Server layer
    var appGenerator = require('../../../test_generators/app.generator.js');
    var recordGenerator = require('../../../test_generators/record.generator.js');

    // Bluebird Promise library
    var promise = require('bluebird');
    // Node.js assert library
    var assert = require('assert');

    describe('Report Layout Tests', function() {

        var setupDone = false;
        var cleanupDone = false;
        var app;
        var recordList;
        var widthTests = [1024, 640, 1280];
        var heightTests = 2024;
        recordBase.setBaseUrl(browser.baseUrl);
        recordBase.initialize();
        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
         *
         * We want this method to act like a beforeSuite hence the use of setupDone (beforeSuite has been added in newer versions of Jasmine).
         * Have to specify the done() callback at the end of the promise chain, otherwise Protractor will not wait
         * for the promises to be resolved (should be fixed in newest version)
         */
        beforeEach(function(done) {
            if (!setupDone) {
                // Create the table schema (map object) to pass into the app generator
                var tableToFieldToFieldTypeMap = {};
                tableToFieldToFieldTypeMap['table 1'] = {};
                tableToFieldToFieldTypeMap['table 1']['Text Field'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
                tableToFieldToFieldTypeMap['table 1']['Rating Field'] = {
                    fieldType: consts.SCALAR,
                    dataType : consts.RATING
                };
                tableToFieldToFieldTypeMap['table 1']['Phone Number Field'] = {
                    fieldType: consts.SCALAR,
                    dataType : consts.PHONE_NUMBER
                };
                tableToFieldToFieldTypeMap['table 1']['Numeric'] = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};
                tableToFieldToFieldTypeMap['table 1']['Currency'] = {
                    fieldType: consts.SCALAR,
                    dataType : consts.CURRENCY
                };
                tableToFieldToFieldTypeMap['table 1']['Percent'] = {fieldType: consts.SCALAR, dataType: consts.PERCENT};
                tableToFieldToFieldTypeMap['table 1']['Url'] = {fieldType: consts.SCALAR, dataType: consts.URL};
                tableToFieldToFieldTypeMap['table 1']['Duration'] = {
                    fieldType: consts.SCALAR,
                    dataType : consts.DURATION
                };
                tableToFieldToFieldTypeMap['table 1']['Email'] = {
                    fieldType: consts.SCALAR,
                    dataType : consts.EMAIL_ADDRESS
                };
                tableToFieldToFieldTypeMap['table 1']['Rating'] = {fieldType: consts.SCALAR, dataType: consts.RATING};

                // Generate the app JSON object
                var generatedApp = appGenerator.generateAppWithTablesFromMap(tableToFieldToFieldTypeMap);

                // Create the app via the API
                createApp(generatedApp).then(function(createdApp) {

                    // Set your global app object to use in the actual test method
                    app = createdApp;

                    // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                    var nonBuiltInFields = getNonBuiltInFields(createdApp.tables[0]);
                    // Generate the record JSON objects
                    var generatedRecords = generateRecords(nonBuiltInFields, 10);

                    // Via the API create the records, a new report, then run the report.
                    // This is a promise chain since we need these actions to happen sequentially
                    addRecords(createdApp, createdApp.tables[0], generatedRecords).then(createReport).then(runReport).then(function(reportRecords) {
                        //console.log('Here are the records returned from your API report:');
                        //console.log(reportRecords);
                        recordList = reportRecords;

                        // Setup complete so set the global var so we don't run setup again
                        setupDone = true;
                        // End of the promise chain so call done here so Protractor can stop waiting;
                        done();
                    }).catch(function(error) {
                        console.log(JSON.stringify(error));
                        promise.delayed(30).then(function() {
                            done();
                        });
                        throw new Error('Error during test setup:' + error);
                    });
                });
            } else {
                done();
            }
        });


        // TODO: QBSE-13517 Move these helper functions out into a service module or base class
        /**
         * Takes a generated JSON object and creates it via the REST API. Returns the create app JSON response body.
         * Returns a promise.
         */
        function createApp(generatedApp) {
            var deferred = promise.pending();
            recordBase.createApp(generatedApp).then(function(appResponse) {
                var createdApp = JSON.parse(appResponse.body);
                assert(createdApp, 'failed to create app via the API');
                //console.log('Create App Response: ' + app);
                deferred.resolve(createdApp);
            }).catch(function(error) {
                console.log(JSON.stringify(error));
                deferred.reject(error);
            });

            return deferred.promise;
        }

        /**
         * Takes the create app JSON object and returns an array all of the non built in fields in the specified table.
         * Use the array to pass into the recordGenerator method.
         */
        function getNonBuiltInFields(createdTable) {
            var nonBuiltInFields = [];
            createdTable.fields.forEach(function(field) {
                if (field.builtIn !== true) {
                    nonBuiltInFields.push(field);
                }
            });

            return nonBuiltInFields;
        }

        /**
         * Takes an array of field objects and returns an array containing the specified number of generated record JSON objects.
         */
        function generateRecords(fields, numRecords) {
            var generatedRecords = [];
            for (var i = 0; i < numRecords; i++) {
                var generatedRecord = recordGenerator.generateRecord(fields);
                //console.log(generatedRecord);
                generatedRecords.push(generatedRecord);
            }

            return generatedRecords;
        }

        /**
         * Takes a set of generated record objects and adds them to the specified app and table
         * Returns a promise.
         */
        function addRecords(app, table, genRecords) {
            var deferred = promise.pending();
            // Resolve the proper record endpoint specific to the generated app and table
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, table.id);

            var fetchRecordPromises = [];
            genRecords.forEach(function(currentRecord) {
                fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord, null));
            });

            promise.all(fetchRecordPromises)
                    .then(function(results) {
                              deferred.resolve(results);
                          }).catch(function(error) {
                                       console.log(JSON.stringify(error));
                                       deferred.reject(error);
                                   });
            return deferred.promise;
        }

        /**
         * Generates a report and creates it in a table via the API. Returns a promise.
         */
        // TODO: QBSE-13518 Write a report generator
        function createReport() {
            var deferred = promise.pending();
            var reportJSON = {
                name      : 'Test Report',
                type      : 'TABLE',
                ownerId   : '10000',
                hideReport: false
                //"query": "{'3'.EX.'1'}"
            };
            var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);

            // TODO: QBSE-13843 Create helper GET And POST functions that extend this executeRequest function
            recordBase.apiBase.executeRequest(reportsEndpoint, 'POST', reportJSON).then(function(result) {
                //console.log('Report create result');
                var parsed = JSON.parse(result.body);
                var id = parsed.id;
                deferred.resolve(id);
            }).catch(function(error) {
                console.log(JSON.stringify(error));
                deferred.reject(error);
            });
            return deferred.promise;
        }

        /**
         * Helper function that will run an existing report in a table. Returns a promise.
         */
        function runReport(reportId) {
            var deferred = promise.pending();

            var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id, reportId);
            var runReportEndpoint = reportsEndpoint + '/results';
            recordBase.apiBase.executeRequest(runReportEndpoint, 'GET').then(function(result) {
                //console.log('Report create result');
                var responseBody = JSON.parse(result.body);
                //console.log(parsed);
                deferred.resolve(responseBody.records);
            }).catch(function(error) {
                console.log(JSON.stringify(error));
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getDimensions(reportServicePage) {
            return {
                windowSize        : browser.manage().window().getSize(),
                mainSize          : reportServicePage.mainContent.getSize(),
                mainLoc           : reportServicePage.mainContent.getLocation(),
                tableContainerSize: reportServicePage.tableContainer.getSize(),
                tableContainerLoc : reportServicePage.tableContainer.getLocation(),
                lastColumnSize    : reportServicePage.lastColumn.getSize(),
                lastColumnLoc     : reportServicePage.lastColumn.getLocation()
            };
        }

        function validateGridDimensions(result) {
            var leftPadding = 10;
            var allowedVariance = 25;
            var pointOfLastColumn = result.lastColumnLoc.x + leftPadding + result.lastColumnSize.width;
            var pointOfMainContent = result.mainLoc.x + result.mainSize.width;
            var endsDiff = Math.abs(pointOfMainContent - pointOfLastColumn);
            expect(endsDiff).toBeLessThan(allowedVariance);
        }

        /**
         * Test method. After setup completes, loads the browser, requests a session ticket, requests the list
         * of reports for that app and table, then runs / displays the report in the browser
         */
        it('Should have liquid size behavior on the grid Report page', function() {

            // Check that your setup completed properly
            // Newer versions of Jasmine allow you to fail fast if your setup fails
            expect(app).not.toBe(null);
            expect(recordList).not.toBe(null);

            // Load the page objects
            var requestReportPage = require('./requestReport.po.js');
            var reportServicePage = require('./reportService.po.js');


            // Gather the necessary values to make the requests via the browser
            var ticketEndpoint = recordBase.apiBase.resolveTicketEndpoint();
            var realmName = recordBase.apiBase.realm.subdomain;
            var realmId = recordBase.apiBase.realm.id;
            var tableId = app.tables[0].id;

            //define the window size
            browser.driver.manage().window().setSize(widthTests[0], heightTests);

            // Get a session ticket for that subdomain and realmId (stores it in the browser)
            var sessionTicketRequest = recordBase.apiBase.generateFullRequest(realmName, ticketEndpoint + realmId);
            // This is a Non-Angular page, need to set this otherwise Protractor will wait forever for Angular to load
            browser.ignoreSynchronization = true;
            browser.get(sessionTicketRequest);
            browser.ignoreSynchronization = false;

            // Load the requestReportPage
            var requestReportPageEndPoint = recordBase.apiBase.generateFullRequest(realmName, '/qbapp#//');
            browser.get(requestReportPageEndPoint);
            //browser.driver.sleep(2000);

            // Check that we have a report for our created table
            expect(requestReportPage.firstReportLinkEl.getText()).toContain(tableId);
            requestReportPage.firstReportLinkEl.click();

            // Assert columns fill width
            promise.props(getDimensions(reportServicePage)).then(validateGridDimensions).then(function() {
                //resize window smaller and recheck
                browser.driver.manage().window().setSize(widthTests[1], heightTests).then(function() {
                    browser.driver.sleep(40000);
                    promise.props(getDimensions(reportServicePage)).then(validateGridDimensions).then(function() {
                        //resize window larger and recheck
                        browser.driver.manage().window().setSize(widthTests[2], heightTests).then(function() {
                            browser.driver.sleep(5000);
                            promise.props(getDimensions(reportServicePage)).then(validateGridDimensions);
                        });
                    });
                });
            });
        });
        /**
         * Cleanup the test realm after all tests in the block. Same hack as in the setup method so it only runs once
         */
        afterEach(function(done) {
            // Checks for any JS errors in the browser console
            browser.manage().logs().get('browser').then(function(browserLog) {
                expect(browserLog.length).toEqual(0);
                if (browserLog.length) console.error('browser log: ' + JSON.stringify(browserLog));
            });
            if (!cleanupDone) {
                browser.driver.manage().window().maximize();
                recordBase.apiBase.cleanup().then(function() {
                    cleanupDone = false;
                    done();
                });
            } else {
                done();
            }
        });
    });
}());