/**
 * E2E test which verifies language preferences are maintained when switching from one app to another. See MB-443.
 * Based on dataGen.e2e.spec.js, Created by gedwards on 10/3/16.
 */
// jshint sub: true
// jscs:disable requireDotNotation

jasmine.DEFAULT_TIMEOUT_INTERVAL = 3 * 60 * 1000; // 3 minute max

(function() {
    'use strict';
    var tableOneNumberOfRecords = 1;  // change value to how many records you want to generate for table 1

    describe('Report Language test', function() {
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
                //set report home page
                return e2eBase.tableService.setDefaultTableHomePage(app.id, app.tables[e2eConsts.TABLE1].id);
            }).then(function() {
                var basicApp = e2eBase.appService.generateAppFromMap(e2eBase.makeBasicMap());
                return e2eBase.appService.createApp(basicApp);
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

            // Protractor tests will launch node at port 9001 by default so do a replace to the default local.js port
            var ticketEndpointRequest = e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint).replace('9001', '9000');
            var appEndpointRequest = e2eBase.getRequestAppsPageEndpoint(realmName).replace('9001', '9000');

            console.log('\nHere is your generated test data: \n' +
                'realmName: ' + realmName + '\n' +
                'realmId: ' + realmId + '\n' +
                'appId: ' + appId + '\n' +
                'table1Id: ' + table1Id + '\n' +
                'table2Id: ' + table2Id + '\n' +
                'To generate a session ticket for your realm paste this into your browser: \n' +
                ticketEndpointRequest + '\n' +
                'Access your test app here (must have generated a ticket first): \n' +
                appEndpointRequest + '\n'
            );
        });

        /**
         * TODO:####
         */
        it('can change user\'s language settings', function() {

        });
    });
}());
