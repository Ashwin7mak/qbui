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
        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
         */
        beforeAll(function(done) {
            //Create the table schema (map object) to pass into the app generator
            /*eslint-disable dot-notation */
            var tableToFieldToFieldTypeMap = {};
            tableToFieldToFieldTypeMap['table 1'] = {};
            tableToFieldToFieldTypeMap['table 1']['Text Field'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            tableToFieldToFieldTypeMap['table 1']['Numeric'] = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};
            tableToFieldToFieldTypeMap['table 1']['Currency'] = {fieldType: consts.SCALAR, dataType : consts.CURRENCY};
            tableToFieldToFieldTypeMap['table 1']['Percent'] = {fieldType: consts.SCALAR, dataType: consts.PERCENT};
            tableToFieldToFieldTypeMap['table 1']['Rating Field'] = {fieldType: consts.SCALAR, dataType : consts.RATING};
            tableToFieldToFieldTypeMap['table 1']['Date Field'] = {fieldType: consts.SCALAR, dataType : consts.DATE};
            tableToFieldToFieldTypeMap['table 1']['Date Time Field'] = {fieldType: consts.SCALAR, dataType : consts.DATE_TIME};
            tableToFieldToFieldTypeMap['table 1']['Time of Day Field'] = {fieldType: consts.SCALAR, dataType : consts.TIME_OF_DAY};
            tableToFieldToFieldTypeMap['table 1']['Duration'] = {fieldType: consts.SCALAR, dataType : consts.DURATION};
            tableToFieldToFieldTypeMap['table 1']['Checkbox Field'] = {fieldType: consts.SCALAR, dataType : consts.CHECKBOX};
            tableToFieldToFieldTypeMap['table 1']['Phone Number Field'] = {fieldType: consts.SCALAR, dataType : consts.PHONE_NUMBER};
            tableToFieldToFieldTypeMap['table 1']['Email'] = {fieldType: consts.SCALAR, dataType : consts.EMAIL_ADDRESS};
            tableToFieldToFieldTypeMap['table 1']['Url'] = {fieldType: consts.SCALAR, dataType: consts.URL};
            tableToFieldToFieldTypeMap['table 2'] = {};
            tableToFieldToFieldTypeMap['table 2']['Text Field'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            tableToFieldToFieldTypeMap['table 2']['Rating Field'] = {fieldType: consts.SCALAR, dataType : consts.RATING};
            tableToFieldToFieldTypeMap['table 2']['Phone Number Field'] = {fieldType: consts.SCALAR, dataType : consts.PHONE_NUMBER};
            //Call the basic app setup function
            e2eBase.basicSetup(tableToFieldToFieldTypeMap, tableOneNumberOfRecords)
                .then(function(results) {
                    //Set your global objects to use in the test functions
                    app = results[0];
                    //Check that your setup completed properly
                    //This will fail the test if setup did not complete properly so at least it doesn't run
                    if (!app) {
                        throw new Error('app not created successfully');
                    }
                    done();
                })
                .catch(function(err) {
                    done.fail(err);
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
