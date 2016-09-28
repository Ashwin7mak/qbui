/**
 * E2E Smoke Test
 *
 */

(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var ReportFacetsPage = requirePO('reportFacets');
    var reportServicePage = new ReportServicePage();
    var reportFacetsPage = new ReportFacetsPage();

    describe('E2E Smoke Test Setup', function() {
        var app;

        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report.
         * Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain to let Jasmine know we are done with async calls
         */
        beforeAll(function(done) {
            e2eBase.defaultSetup().then(function(createdApp) {
                // Set your global objects to use in the test functions
                app = createdApp;
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
    });
}());
