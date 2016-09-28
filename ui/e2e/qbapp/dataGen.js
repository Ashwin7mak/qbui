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

e2eConsts = require('../common/e2eConsts');
consts = require('../../common/src/constants.js');

(function() {
    'use strict';
    var realmToUse = 'localhost';       // change this to a string i.e. "myRealm" of an existing realm to use
                                       // if you leave realmToUse null it will randomly generated a new realm name

    var config = require('../../server/src/config/environment');
    if (realmToUse) {
        config.realmToUse = realmToUse;
    }

    //Require the e2e base class and constants modules
    var e2eBase = require('../common/e2eBase.js')(config);

    var chance = require('chance').Chance();

    var app;
    var recordList;

    e2eBase.setBaseUrl(config.DOMAIN);
    e2eBase.initialize();

    generateNewData(() => {
        createdRecs();
    });

    function addColumn(table, type) {
        table[type.columnName] = {
            fieldType: consts.SCALAR,
            dataType: type.name
        };
    }

    function makeAppMap() {
        var table1Name = 'Table 1 '; // or random name  chance.capitalize(chance.word({syllables: 4}));
        var table2Name = 'Table 2 '; // or random name  chance.capitalize(chance.word({syllables: 4}));
        var table3Name = 'Table 3 '; // or random name  chance.capitalize(chance.word({syllables: 3}));
        var table4Name = 'Table 4 '; // or random name  chance.capitalize(chance.word({syllables: 3}));

        // Create the table schema (map object) to pass into the app generator
        var tableToFieldToFieldTypeMap = {};
        tableToFieldToFieldTypeMap[table1Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.TEXT);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.NUMERIC);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.CURRENCY);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.PERCENT);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.RATING);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.DATE);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.DATE_TIME);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.TIME_OF_DAY);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.DURATION);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.CHECKBOX);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.PHONE_NUMBER);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.EMAIL_ADDRESS);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.URL);

        tableToFieldToFieldTypeMap[table2Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table2Name], e2eConsts.dataType.TEXT);
        addColumn(tableToFieldToFieldTypeMap[table2Name], e2eConsts.dataType.DATE);
        addColumn(tableToFieldToFieldTypeMap[table2Name], e2eConsts.dataType.PHONE_NUMBER);

        tableToFieldToFieldTypeMap[table3Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table3Name], e2eConsts.dataType.TEXT);
        addColumn(tableToFieldToFieldTypeMap[table3Name], e2eConsts.dataType.DATE);
        addColumn(tableToFieldToFieldTypeMap[table3Name], e2eConsts.dataType.DATE_TIME);
        addColumn(tableToFieldToFieldTypeMap[table3Name], e2eConsts.dataType.CHECKBOX);

        tableToFieldToFieldTypeMap[table4Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table4Name], e2eConsts.dataType.TEXT);

        return tableToFieldToFieldTypeMap;
    }

    function generateNewData(done) {
        var nonBuiltInFields;
        e2eBase.reportsBasicSetUp(makeAppMap()).then(function(appAndRecords) {
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
            return e2eBase.tableService.setDefaultTableHomePage(app.id, app.tables[e2eConsts.TABLE3].id);
        }).then(function() {
            done();
        }).catch(function(error) {
            // Global catch that will grab any errors from chain above
            // Will appropriately fail the beforeAll method so other tests won't run
            console.log('Error during setup  ' + error.message);
        });
    }

    /**
     *  Prints out the generated test data and endpoints to the console.
     */
    function createdRecs() {
        var realmName = e2eBase.recordBase.apiBase.realm.subdomain;
        var realmId = e2eBase.recordBase.apiBase.realm.id;
        var appId = app.id;
        // Protractor tests will launch node at port 9001 by default so do a replace to the default local.js port
        var ticketEndpointRequest = e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint).replace('9001', '9000');
        var appEndpointRequest = e2eBase.getRequestAppsPageEndpoint(realmName).replace('9001', '9000');

        var tableNames = '';
        app.tables.forEach((table, index) => {
            tableNames += 'table' + index + 1 + 'Id:' + table.id + '\n';
            tableNames += 'table' + index + 1 + 'Name:' + table.name + '\n';
        });
        console.log('\nHere is your generated test data: \n' +
            'realmName: ' + realmName + '\n' +
            'realmId: ' + realmId + '\n' +
            'appId: ' + appId + '\n' +
            'appName: ' +  app.name + '\n' +
            tableNames +
            'To generate a session ticket for your realm paste this into your browser: \n' +
            ticketEndpointRequest + '\n' +
            'Access your test app here (must have generated a ticket first): \n' +
            appEndpointRequest + '\n'
        );
    }
}());
