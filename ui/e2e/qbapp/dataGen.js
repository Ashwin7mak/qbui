/**
 * standalone script for generating test data on the backend
 *
 *
 * expects java server running and node server running
 *
 * expects NODE_ENV to be defined e.g. NODE_ENV=local
 *
 * run from qbui directory with `node ui/e2e/qbapp/dataGen.js`
 *
 * */
// jshint sub: true
// jscs:disable requireDotNotation


(function() {
    'use strict';
    var tableOneNumberOfRecords = 10;  // change value to how many records you want to generate for table 1
    var tableTwoNumberOfRecords = 10; // change value to how many records you want to generate for table 2
    var realmToUse = 'cider';       // change this to a string i.e. "myRealm" of an existing realm to use
                                       // if you leave realmToUse null it will randomly generated a new realm name

    var config = require('../../server/config/environment');
    if (realmToUse) {
        config.realmToUse = realmToUse;
    }

    //Require the e2e base class and constants modules
    var e2eBase = require('../common/e2eBase.js')(config);
    var consts = require('../../server/api/constants.js');

    var promise = require('bluebird');
    var chance = require('chance').Chance();

    var app;
    e2eBase.setBaseUrl(config.DOMAIN);
    e2eBase.initialize();

    generateData();

    /**
     *  Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
     */
    function generateData() {
        //Create the table schema (map object) to pass into the app generator
        /*eslint-disable dot-notation */
        var tableToFieldToFieldTypeMap = {};
        var table1Name = chance.capitalize(chance.word({syllables: 1}));
        var table2Name = chance.capitalize(chance.word({syllables: 1}));
        tableToFieldToFieldTypeMap[table1Name] = {};
        tableToFieldToFieldTypeMap[table1Name]['Text Field'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
        tableToFieldToFieldTypeMap[table1Name]['Numeric'] = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};
        tableToFieldToFieldTypeMap[table1Name]['Currency'] = {fieldType: consts.SCALAR, dataType : consts.CURRENCY};
        tableToFieldToFieldTypeMap[table1Name]['Percent'] = {fieldType: consts.SCALAR, dataType: consts.PERCENT};
        tableToFieldToFieldTypeMap[table1Name]['Rating Field'] = {fieldType: consts.SCALAR, dataType : consts.RATING};
        tableToFieldToFieldTypeMap[table1Name]['Date Field'] = {fieldType: consts.SCALAR, dataType : consts.DATE};
        tableToFieldToFieldTypeMap[table1Name]['Date Time Field'] = {fieldType: consts.SCALAR, dataType : consts.DATE_TIME};
        tableToFieldToFieldTypeMap[table1Name]['Time of Day Field'] = {fieldType: consts.SCALAR, dataType : consts.TIME_OF_DAY};
        tableToFieldToFieldTypeMap[table1Name]['Duration'] = {fieldType: consts.SCALAR, dataType : consts.DURATION};
        tableToFieldToFieldTypeMap[table1Name]['Checkbox Field'] = {fieldType: consts.SCALAR, dataType : consts.CHECKBOX};
        tableToFieldToFieldTypeMap[table1Name]['Phone Number Field'] = {fieldType: consts.SCALAR, dataType : consts.PHONE_NUMBER};
        tableToFieldToFieldTypeMap[table1Name]['Email'] = {fieldType: consts.SCALAR, dataType : consts.EMAIL_ADDRESS};
        tableToFieldToFieldTypeMap[table1Name]['Url'] = {fieldType: consts.SCALAR, dataType: consts.URL};
        tableToFieldToFieldTypeMap[table2Name] = {};

        tableToFieldToFieldTypeMap[table2Name]['Text Field'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
        tableToFieldToFieldTypeMap[table2Name]['Rating Field'] = {fieldType: consts.SCALAR, dataType : consts.RATING};
        tableToFieldToFieldTypeMap[table2Name]['Phone Number Field'] = {fieldType: consts.SCALAR, dataType : consts.PHONE_NUMBER};
        //Call the basic app setup function
        createAnApp(tableToFieldToFieldTypeMap, tableOneNumberOfRecords).then(function(results) {
            //Set your global objects to use in the test functions
            app = results[0];
            //Check that your setup completed properly
            //There's no fail fast option using beforeAll yet in Jasmine to prevent other tests from running
            //This will fail the test if setup did not complete properly so at least it doesn't run
            if (!app) {
                throw new Error('test app / recordList was not created properly during setup');
            }
            //Get the appropriate fields out of the second table
            var nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[1]);
            //Generate the record JSON objects
            var generatedRecords = e2eBase.recordService.generateRecords(nonBuiltInFields, tableTwoNumberOfRecords);
            //Via the API create the records, a new report
            //This is a promise chain since we need these actions to happen sequentially
            e2eBase.recordService.addRecords(app, app.tables[1], generatedRecords).then(function() {
                var reportName = chance.capitalize(chance.word({syllables: 2})) + " for table-" +
                    app.tables[1].name + "- app-" + app.name;
                e2eBase.reportService.createReport(app.id, app.tables[1].id, undefined, reportName).then(function() {
                    createdRecs();
                });
            });
        });
    }

    function createAnApp(tableToFieldToFieldTypeMap, numberOfRecords) {
        var deferred = promise.pending();
        //Generate the app JSON object
        var generatedApp = e2eBase.appService.generateAppFromMap(tableToFieldToFieldTypeMap);
        //Create the app via the API
        e2eBase.appService.createApp(generatedApp).then(function(createdApp) {
            //Get the appropriate fields out of the Create App response (specifically the created field Ids)
            var nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(createdApp.tables[0]);
            //Generate the record JSON objects
            var generatedRecords = e2eBase.recordService.generateRecords(nonBuiltInFields, numberOfRecords);
            //Via the API create the records, a new report, then run the report.
            //This is a promise chain since we need these actions to happen sequentially
            e2eBase.recordService.addRecords(createdApp, createdApp.tables[0], generatedRecords).then(function() {
                var reportName = chance.capitalize(chance.word({syllables: 2})) + " for table-" +
                    createdApp.tables[0].name + "- app" + createdApp.name;
                e2eBase.reportService.createReport(createdApp.id, createdApp.tables[0].id, undefined, reportName).then(function(reportId) {
                    e2eBase.reportService.runReport(createdApp.id, createdApp.tables[0].id, reportId).then(function(reportRecords) {
                        //Return back the created app and records
                        //Pass it back in an array as promise.resolve can only send back one object
                        var appAndRecords = [createdApp, reportRecords];
                        deferred.resolve(appAndRecords);
                    }).catch(function(error) {
                        console.error(JSON.stringify(error));
                        deferred.reject(error);
                    });
                });
            });
        });
        return deferred.promise;
    }

    /**
     *  Prints out the generated test data and endpoints to the console.
     */
    function createdRecs() {
        var realmName = e2eBase.recordBase.apiBase.realm.subdomain;
        var realmId = e2eBase.recordBase.apiBase.realm.id;
        var appId = app.id;
        var table1Id = app.tables[0].id;
        var table2Id = app.tables[1].id;
        console.log('\nHere is your generated test data: \n' +
            'realmName: ' + realmName + '\n' +
            'realmId: ' + realmId + '\n' +
            'appId: ' + appId + '\n' +
            'appName: ' +  app.name + '\n' +
            'table1Id: ' + table1Id + '\n' +
            'table1Name: ' + app.tables[0].name + '\n' +
            'table2Id: ' + table2Id + '\n' +
            'table2Name: ' + app.tables[1].name + '\n' +
            'To generate a session ticket for your realm paste this into your browser: \n' +
                e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint) + '\n' +
            'Access your test app here (must have generated a ticket first): \n' +
                e2eBase.getRequestAppsPageEndpoint(realmName) + '\n'
        );
    }
}());
