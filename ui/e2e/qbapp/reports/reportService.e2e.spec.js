/**
 * E2E tests for the Report Service
 * Created by klabak on 6/1/15.
 */
'use strict';

// Uses the base / constants modules in the Node Server layer
// Launches a new instance of the Express Server
var consts = require('../../../server/api/constants.js');
var config = require('../../../server/config/environment/local.js');
var app = require('../../../server/app');
var recordBase = require('../../../server/api/test/recordApi.base.js')(config);

// Require the generator modules in the Server layer
var appGenerator = require('../../../test_generators/app.generator.js');
var recordGenerator = require('../../../test_generators/record.generator.js');

// Bluebird Promise library
var Promise = require('bluebird');
// Node.js assert library
var assert = require('assert');

describe('Report Service E2E Tests', function (){

    var setupDone = false;
    var cleanupDone = false;
    var app;
    var recordList;

    /**
     * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
     *
     * We want this method to act like a beforeSuite hence the use of setupDone (beforeSuite has been added in newer versions of Jasmine).
     * Have to specify the done() callback at the end of the promise chain, otherwise Protractor will not wait
     * for the promises to be resolved (should be fixed in newest version)
     */
    beforeEach(function (done) {
        if (!setupDone) {
            // Create the table schema (map object) to pass into the app generator
            var tableToFieldToFieldTypeMap = {};
            tableToFieldToFieldTypeMap['table 1'] = {};
            tableToFieldToFieldTypeMap['table 1']['Text Field'] = consts.TEXT;
            tableToFieldToFieldTypeMap['table 1']['Multi Text Field'] = consts.MULTI_LINE_TEXT;
            tableToFieldToFieldTypeMap['table 1']['Phone Number Field'] = consts.PHONE_NUMBER;

            // Generate the app JSON object
            var generatedApp = appGenerator.generateAppWithTablesFromMap(tableToFieldToFieldTypeMap);

            // Create the app via the API
            createApp(generatedApp).then(function (createdApp) {

                // Set your global app object to use in the actual test method
                app = createdApp;

                // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                var nonBuiltInFields = getNonBuiltInFields(createdApp.tables[0]);
                // Generate the record JSON objects
                var generatedRecords = generateRecords(nonBuiltInFields, 10);

                // Via the API create the records, a new report, then run the report.
                // This is a promise chain since we need these actions to happen sequentially
                addRecords(createdApp, createdApp.tables[0], generatedRecords).then(createReport).then(runReport).then(function (reportRecords) {
                    //console.log('Here are the records returned from your API report:');
                    //console.log(reportRecords);
                    recordList = reportRecords;

                    // Setup complete so set the global var so we don't run setup again
                    setupDone = true;
                    // End of the promise chain so call done here so Protractor can stop waiting;
                    done();
                }).catch(function (error){
                    console.log(JSON.stringify(error));
                    throw new Error('Error during test setup:' + error);
                    done();
                });
            });
        }
        else { done(); }
    });


    // TODO: QBSE-13517 Move these helper functions out into a service module or base class
    /**
     * Takes a generated JSON object and creates it via the REST API. Returns the create app JSON response body.
     * Returns a promise.
     */
    function createApp(generatedApp){
        var deferred = Promise.pending();
        recordBase.createApp(generatedApp).then(function (appResponse) {
            var createdApp = JSON.parse(appResponse.body);
            assert(createdApp, 'failed to create app via the API');
            //console.log('Create App Response: ' + app);
            deferred.resolve(createdApp);
        }).catch(function(error){
            console.log(JSON.stringify(error));
            deferred.reject(error);
        });

        return deferred.promise;
    };

    /**
     * Takes the create app JSON object and returns an array all of the non built in fields in the specified table.
     * Use the array to pass into the recordGenerator method.
     */
    function getNonBuiltInFields(createdTable){
        var nonBuiltInFields = [];
        createdTable.fields.forEach(function (field) {
            if(field.builtIn !== true){
                nonBuiltInFields.push(field);
            }
        });

        return nonBuiltInFields;
    };

    /**
     * Takes an array of field objects and returns an array containing the specified number of generated record JSON objects.
     */
    function generateRecords(fields, numRecords){
        var generatedRecords = [];
        for (var i = 0; i < numRecords; i++) {
            var generatedRecord = recordGenerator.generateRecord(fields);
            //console.log(generatedRecord);
            generatedRecords.push(generatedRecord);
        };

        return generatedRecords;
    };

    /**
     * Takes a set of generated record objects and adds them to the specified app and table
     * Returns a promise.
     */
    function addRecords(app, table, genRecords){
        var deferred = Promise.pending();
        // Resolve the proper record endpoint specific to the generated app and table
        var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, table.id);

        var fetchRecordPromises = [];
        genRecords.forEach(function (currentRecord) {
            fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord, null));
        });

        Promise.all(fetchRecordPromises)
            .then(function (results) {
                deferred.resolve(results);
            }).catch(function (error) {
                console.log(JSON.stringify(error));
                deferred.reject(error);
            });
        return deferred.promise;
    };

    /**
     * Generates a report and creates it in a table via the API. Returns a promise.
     */
    // TODO: QBSE-13518 Write a report generator
    function createReport(){
        var deferred = Promise.pending();
        var reportJSON = {
            "name": "Test Report",
            "type": "TABLE",
            "ownerId": "1000000",
            "hideReport": false
            //"query": "{'3'.EX.'1'}"
        };
        var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);

        // TODO: QBSE-13843 Create helper GET And POST functions that extend this executeRequest function
        recordBase.apiBase.executeRequest(reportsEndpoint, 'POST', reportJSON).then(function(result){
            //console.log('Report create result');
            var parsed = JSON.parse(result.body);
            var id = parsed.id;
            deferred.resolve(id);
        }).catch(function (error) {
            console.log(JSON.stringify(error));
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /**
     * Helper function that will run an existing report in a table. Returns a promise.
     */
    function runReport(reportId){
        var deferred = Promise.pending();

        var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id, reportId);
        var runReportEndpoint = reportsEndpoint + '/results';
        recordBase.apiBase.executeRequest(runReportEndpoint, 'GET').then(function(result){
            //console.log('Report create result');
            var responseBody = JSON.parse(result.body);
            //console.log(parsed);
            deferred.resolve(responseBody.records);
        }).catch(function (error) {
            console.log(JSON.stringify(error));
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /**
     * Helper function that will get all of the field column headers from the report. Returns an array of strings.
     */
    function getReportColumnHeaders(reportServicePage){
        var deferred = Promise.pending();
        var fieldColHeaders = [];
        reportServicePage.columnHeaderElList.then(function(result){
            for(var i = 0; i < result.length; i++){
                result[i].getText().then(function(value){
                    // The getText call above is returning the text value with a new line char on the end, need to remove it
                    var subValue = value.replace(/(\r\n|\n|\r)/gm,'');
                    fieldColHeaders.push(subValue.trim());
                });
            }
        }).then(function(){
            deferred.resolve(fieldColHeaders);
        });
        return deferred.promise;
    };

    /**
     * Helper function that will convert an array of strings to uppercase
     */
    function stringArrayToUpperCase(array){
        var upperArray = [];
        array.forEach(function (lowerString){
            var res = lowerString.toUpperCase();
            upperArray.push(res);
        });
        return upperArray;
    };

    /**
     * Function that will compare actual and expected record values
     */
    function assertRecordValues(actualRecords, expectedRecords) {

        // Check that we have the same number of records to compare
        expect(actualRecords.length).toEqual(expectedRecords.length);

        // Gather the record values
        var actualRecordList = [];

        // Each row of the repeater (one record) is returned as a string of values.
        // Split on the new line char and create a new array.
        actualRecords.forEach(function (recordString) {
            var record = recordString.split('\n');
            actualRecordList.push(record);
        });

        // Sort expected records by recordID
        expectedRecords.sort(function (a, b) {
            return parseInt(a[0].value) - parseInt(b[0].value);
        });

        // Loop through the expected recordList
        for (var k = 0; k < expectedRecords.length; k++) {
            // Grab the expected record
            var expectedRecord = expectedRecords[k];
            // Get the record Id to look for
            var expectedRecIdValue = expectedRecord[0].value;

            // Grab actual record to compare recordIds
            var actualRecord = actualRecordList[k];
            // Get the record Id
            var actualRecIdValue = actualRecord[0];

            // If the record Ids match, compare the other fields in the records
            if (expectedRecIdValue === Number(actualRecIdValue)) {
                //console.log('Comparing record values for records with ID: ' + expectedRecIdValue);
                for (var j = 1; j < expectedRecord.length; j++) {
                    //console.log('Comparing expected field value:' + expectedRecord[j].value
                    //+ ' with actual field value: ' + actualRecord[j]);
                    expect(expectedRecord[j].value).toEqual(actualRecord[j]);
                }
            }
        }
    };

    /**
     * Test method. After setup completes, loads the browser, requests a session ticket, requests the list
     * of reports for that app and table, then runs / displays the report in the browser
     */
    it('Should request a session ticket and load the Report page', function () {

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
        var appId = app.id;
        var tableId = app.tables[0].id;

        // Get a session ticket for that subdomain and realmId (stores it in the browser)
        var sessionTicketRequest = 'http://' + realmName + '.localhost:9000' + ticketEndpoint + realmId;
        // This is a Non-Angular page, need to set this otherwise Protractor will wait forever for Angular to load
        browser.ignoreSynchronization = true;
        browser.get(sessionTicketRequest);
        browser.ignoreSynchronization = false;

        // Load the requestReportPage
        var requestReportPageEndPoint = 'http://' + realmName + '.localhost:9000/qbapp#//';
        browser.get(requestReportPageEndPoint);
        browser.driver.sleep(2000);

        // Check that we have a report for our created table
        expect(requestReportPage.firstReportLinkEl.getText()).toContain(tableId);
        requestReportPage.firstReportLinkEl.click();

        // Now on the Reports Service page
        browser.driver.sleep(10000);
        // Assert report name
        var reportName = 'Test Report';
        reportServicePage.reportTitleEl.getText(function (text){
            expect(text).toEqual(reportName + ' Report');
        });

        // Assert column headers
        var fieldNames = ['Record ID#', 'Text Field', 'Multi Text Field', 'Phone Number Field'];
        getReportColumnHeaders(reportServicePage).then(function(resultArray){
            // UI is currently using upper case to display the field names in columns
            var upperFieldNames = stringArrayToUpperCase(fieldNames);
            expect(resultArray).toEqual(upperFieldNames);
        });

        // Check all record values
        reportServicePage.recordElList.getText().then(function(uiRecords) {
            assertRecordValues(uiRecords, recordList);
        });
    });

    /**
    * Cleanup the test realm after all tests in the block. Same hack as in the setup method so it only runs once
    */
    afterEach(function (done) {
        if (!cleanupDone) {
            recordBase.apiBase.cleanup().then(function () {
                cleanupDone = false;
                done();
            });
        }
        else { done(); }
    });
});