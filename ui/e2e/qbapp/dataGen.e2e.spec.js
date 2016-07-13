/**
 * E2E test for generating test data
 * Created by klabak on 6/1/15.
 */
// jshint sub: true
// jscs:disable requireDotNotation

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000; //10 minutes max allows for adding many records

(function() {
    'use strict';
    var tableOneNumberOfRecords = 10;  // change value to how many records you want to generate for table 1

    describe('Data Generation for E2E Tests', function() {
        var app;
        var recordList;
        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
         */
        beforeAll(function(done) {
            var nonBuiltInFields;
            e2eBase.reportsBasicSetUp().then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords[0];
                recordList = appAndRecords[1];
                // Get the appropriate fields out of the third table
                nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[e2eConsts.TABLE3]);
                // Generate the record JSON objects
                var generatedRecords = e2eBase.recordService.generateRecords(nonBuiltInFields, 5);
                // Via the API create some records
                return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE3], generatedRecords);
            }).then(function() {
                // Generate 1 empty record
                var generatedEmptyRecords = e2eBase.recordService.generateEmptyRecords(nonBuiltInFields, 1);
                return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE3], generatedEmptyRecords);
            }).then(function() {
                //Create a report with facets in table 3
                return e2eBase.reportService.createReportWithFacets(app.id, app.tables[e2eConsts.TABLE3].id, [6, 7, 8, 9]);
            }).then(function() {
                done();
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                done.fail('Error during test setup beforeAll: ' + error.message);
            });
        });
        /**
         * Test method. Prints out the generated test data and endpoints to the console.
         */
        it('Will print out your realmName, realmId, appId and tableIds', function() {
            var realmName = e2eBase.recordBase.apiBase.realm.subdomain;
            var realmId = e2eBase.recordBase.apiBase.realm.id;
            var appId = app.id;
            var table1Id = app.tables[0].id;
            var table2Id = app.tables[1].id;
            console.log('\nHere is your generated test data: \n' +
                'realmName: ' + realmName + '\n' +
                'realmId: ' + realmId + '\n' +
                'appId: ' + appId + '\n' +
                'table1Id: ' + table1Id + '\n' +
                'table2Id: ' + table2Id + '\n' +
                'To generate a session ticket for your realm paste this into your browser: \n' +
                e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint) + '\n' +
                'Access your test app here (must have generated a ticket first): \n' +
                e2eBase.getRequestAppsPageEndpoint(realmName) + '\n'
            );
        });
    });
}());
