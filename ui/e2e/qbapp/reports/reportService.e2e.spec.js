/**
 * E2E tests for the Report Service
 * Created by klabak on 6/1/15.
 */
'use strict';

var consts = require('../../../server/api/constants.js');
var config = require('../../../server/config/environment/local.js');
var app = require('../../../server/app');
var recordBase = require('../../../server/api/test/recordApi.base.js')(config);

var appGenerator = require('../../../test_generators/app.generator.js');
var recordGenerator = require('../../../test_generators/record.generator.js');

var Promise = require('bluebird');
var assert = require('assert');

var jsonBigNum = require('json-bignum');
var BigDecimal = require('bigdecimal');

describe('Report Service E2E Tests', function (){

    var setupDone = false;
    var cleanupDone = false;
    var app;
    var records;

    /**
     * Setup method. Generates JSON for an app, table, a set of records and a report. Then creates them via the REST API.
     *
     * We this to act like a beforeSuite hence the use of setupDone (this is fixed in newer versions of Jasmine).
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
            //tableToFieldToFieldTypeMap['table 1']['Date Field'] = consts.DATE;

            // Generate the app JSON object
            var generatedApp = appGenerator.generateAppWithTablesFromMap(tableToFieldToFieldTypeMap);

            // Create the app via the API
            createApp(generatedApp).then(function (createdApp) {

                //TODO: Verify app here (or in the helper method)

                // Set your global app object to use in the actual test method
                app = createdApp;

                // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                var nonBuiltInFields = getNonBuiltInFields(createdApp);
                // Generate the record JSON objects
                var generatedRecords = generateRecords(nonBuiltInFields, 10);

                // Via the API create the records, a new report, then run the report.
                // This is a promise chain since we need these actions to happen sequentially
                addRecords(createdApp, generatedRecords).then(createReport).then(runReport).then(function (records) {
                    console.log("Here are the records returned from your report:");
                    console.log(records);

                    //TODO: Verify the records here then set the global object

                    // Setup complete so set the global var so we don't run setup again
                    setupDone = true;
                    // End of the promise chain so call done here so Protractor can stop waiting;
                    done();
                }).catch(function (error){
                    console.log(JSON.stringify(error));
                    throw new Error("Error during test setup:" + error);
                    done();
                });
            });
        }
        else { done(); }
    });

    function createApp(generatedApp){
        var deferred = Promise.pending();
        recordBase.createApp(generatedApp).then(function (appResponse) {
            var createdApp = JSON.parse(appResponse.body);
            assert(createdApp, 'failed to create app via the API');
            //console.log("Create App Response: " + app);
            deferred.resolve(createdApp);
        }).catch(function(error){
            console.log(JSON.stringify(error));
            deferred.reject(error);
        });

        return deferred.promise;
    };

    function getNonBuiltInFields(createdApp){
        var nonBuiltInFields = [];
        createdApp.tables[0].fields.forEach(function (field) {
            if(field.builtIn !== true){
                nonBuiltInFields.push(field);
            }
        });

        return nonBuiltInFields;
    };

    function generateRecords(fields, numRecords){
        var generatedRecords = [];
        for (var i = 0; i < numRecords; i++) {
            var generatedRecord = recordGenerator.generateRecord(fields);
            //console.log(generatedRecord);
            generatedRecords.push(generatedRecord);
        };

        return generatedRecords;
    };

    function addRecords(app, genRecords){
        var deferred = Promise.pending();
        // Resolve the proper record endpoint specific to the generated app and table
        var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);

        var fetchRecordPromises = [];
        genRecords.forEach(function (currentRecord) {
            fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord, null));
        });

        Promise.all(fetchRecordPromises)
            .then(function (results) {
                for (var i = 0; i < results.length; i++) {
                    //console.log("Here is fetched record response " + i);
                    //console.log(results[i]);
                    //TODO: Assert values are the same between genRecords and createdRecords
                }
                deferred.resolve(app);
            }).catch(function (error) {
                console.log(JSON.stringify(error));
                deferred.reject(error);
            });
        return deferred.promise;
    };

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

        recordBase.apiBase.executeRequest(reportsEndpoint, 'POST', reportJSON).then(function(result){
            //console.log("Report create result");
            var parsed = JSON.parse(result.body);

            var id = parsed.id;
            deferred.resolve(id);
        }).catch(function (error) {
            console.log(JSON.stringify(error));
            deferred.reject(error);
        });
        return deferred.promise;
    };

    function runReport(reportId){
        var deferred = Promise.pending();

        var reportsEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id, reportId);
        var runReportEndpoint = reportsEndpoint + '/results';
        recordBase.apiBase.executeRequest(runReportEndpoint, 'GET').then(function(result){
            //console.log("Report create result");
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
     * Test method. After setup completes, loads the browser, requests a session ticket, requests the list
     * of reports for that app and table, then runs / displays the report in the browser
     */
    it('Should request a session ticket and load the Report page', function () {

        // Check that your setup completed properly
        // Newer versions of Jasmine allow you to fail fast if your setup fails
        expect(app).not.toBe(null);
        //TODO: Check that your records aren't null

        // Load the page object model
        var requestReportPage = require('./requestReport.po.js');
        var directReportLinksPage = require('./directReportLinks.po.js');

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

        // Enter in the appId, tableId and click the 'Go' button
        browser.driver.sleep(2000);
        requestReportPage.appIdInputEl.sendKeys(appId);
        requestReportPage.tableIdInputEl.sendKeys(tableId);
        requestReportPage.goButtonEl.click();

        // Now on Direct Links page. Choose the first link to run the Report
        browser.driver.sleep(2000);
        directReportLinksPage.firstReportLinkEl.click();

        // Now on the Reports page
        //TODO: Assert the report is being shown
        //TODO: Check the values shown on the page match your expected records
        browser.driver.sleep(10000);
    });

    /**
    * Cleanup the test realm after all tests in the block. Same hack as in the setup method so it only runs once
    */
    afterEach(function (done) {
        if (!cleanupDone) {
            //Realm deletion takes time, bump the timeout
            //this.timeout(20000);
            recordBase.apiBase.cleanup().then(function () {
                cleanupDone = false;
                done();
            });
        }
        else { done(); }
    });

});