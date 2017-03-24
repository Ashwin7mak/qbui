/**
 * E2E DataGen Setup. Make sure to comment out 'after' hook in wdio.conf.js to prevent cleanup!
 * Use this script as a smoke test to ensure that wdio is setup properly
 */
(function() {
    'use strict';

    describe('E2E DataGen Test Setup', function() {
        var testApp;
        /**
         * Setup method. Creates application via the API.
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data via API');
            return e2eBase.fullReportsSetup().then(function(response) {
                // Set your global app to use in the test functions
                testApp = response[0];
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        /**
         * Test method. Prints out the generated test data and endpoints to the console.
         */
        it('Will print out your realmName, realmId, appId and tableIds', function() {
            var realmName = e2eBase.recordBase.apiBase.realm.subdomain;
            var realmId = e2eBase.recordBase.apiBase.realm.id;
            var appId = testApp.id;
            var table1Id = testApp.tables[0].id;
            var table2Id = testApp.tables[1].id;

            // WebdriverIO tests will launch node at port 9001 by default so do a replace to the default local.js port
            var ticketEndpointRequest = e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint).replace('9001', '9000');
            var appEndpointRequest = e2eBase.getRequestAppsPageEndpoint(realmName).replace('9001', '9000');

            browser.logger.info('\nHere is your generated test data: \n' +
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
