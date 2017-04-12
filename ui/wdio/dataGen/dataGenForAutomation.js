/**
 * Created by msyed on 4/5/17.
 */
/**
 * This is a custom script for generating a Demo app named 'Automation Demo'
 * Unlike other 'dataGen' scripts, this generates a named app with a single named tabled (Project Request)
 * Columns in this table are also named and have some of the columns have meaningful data, rather than random data.
 *
 * expects java server, experience engine and node server running
 * expects NODE_ENV to be defined e.g. NODE_ENV=local
 *
 * run from qbui directory with `node ui/wdio/dataGen/dataGenForAutomation.js`
 */

// if you set realmToUse null it will randomly generated a new realm name
// change this to a string i.e. "myRealm" of an existing realm to use
var realmToUse = 'localhost';

// Get the node config set by your NODE_ENV var
var config = require('../../server/src/config/environment');
if (realmToUse) {
    config.realmToUse = realmToUse;
}

// Require the e2e base and constants modules
e2eBase = require('../common/e2eBase.js')(config);
e2eConsts = require('../common/e2eConsts');
consts = require('../../common/src/constants.js');

(function() {
    'use strict';

    // Bluebird Promise library
    var promise = require('bluebird');
    // Logging library
    var log = require('../../server/src/logger').getLogger();
    // Lodash library
    var _ = require('lodash');
    // Chance library
    var chance = require('chance').Chance();

    // App JSON object returned by the createApp API call
    var createdApp;

    // Generate an app and console log the app and tables it created when done
    generateNewData(() => {
        createdRecs();
    });

    // Utility function for appending to the table map object
    function addColumn(table, type, name, settings) {
        // Optionally supplied specific field name otherwise use the fields type
        let fieldName = name || type.columnName;

        table[fieldName] = {
            fieldType: consts.SCALAR,
            dataType: type.name
        };
        // Optional add supplied attrs
        if (settings) {
            table[fieldName] = Object.assign({}, table[fieldName], settings);
            console.log('SETTINGS!!: ', table[fieldName]);
        }
    }

    /**
     * Creates a map object of the table and field structure for a QuickBase app
     * @returns Map object to pass into the test generators package to create a JSON app object for the API
     */
    function makeAppMap() {
        // Table Names
        var table1Name = 'Project Request';

        // Convenience reusable settings
        var baseNumClientRequiredProps = {
            width: 50,
            bold: false,
            word_wrap: false,
            separator_start: 4
        };
        let baseTextClientRequiredProps = {
            width: 50,
            bold: false,
            word_wrap: false
        };
        let checkboxYNClientProps = {
            width: 50,
            bold: false,
            word_wrap: false,
            display_graphic: false
        };
        let emailOnlyDisplayBeforeAtSymbol = {
            width: 50,
            bold: false,
            word_wrap: false,
            format: 'UP_TO_AT_SIGN'
        };
        let emailOnlyDisplayBeforeUnderscore = {
            width: 50,
            bold: false,
            word_wrap: false,
            format: 'UP_TO_UNDERSCORE'
        };
        let emailDefaultDomain = {
            defaultDomain: "quickbase.dev",
            clientSideAttributes: Object.assign({}, baseTextClientRequiredProps)
        };
        let urlButton = {
            clientSideAttributes: Object.assign({show_as_button: true}, baseTextClientRequiredProps)
        };
        let urlOpenInSameWindow = {
            clientSideAttributes: Object.assign({open_in_new_window: false}, baseTextClientRequiredProps)
        };
        var emptyChoice = {
            coercedValue: {value: ''},
            displayValue: ''
        };

        // Create the table schema (map object) to pass into the app generator

        // Table 1 //

        var tableToFieldToFieldTypeMap = {};
        tableToFieldToFieldTypeMap[table1Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.TEXT, "Request Name");
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.TEXT, "Company");
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.CHECKBOX, "Approved?");
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.TEXT, "Project Type",
            {
                dataAttr: {htmlAllowed: true, clientSideAttributes: Object.assign({}, baseTextClientRequiredProps)},
                multipleChoice: {
                    choices: [
                        {
                            "coercedValue": {
                                "value": ""
                            },
                            "displayValue": ""
                        },
                        {
                            "coercedValue": {
                                "value": "Work Order Request"
                            },
                            "displayValue": "Work Order Request"
                        },
                        {
                            "coercedValue": {
                                "value": "Maintenance Request"
                            },
                            "displayValue": "Maintenance Request"
                        },
                        {
                            "coercedValue": {
                                "value": "Misc. Request"
                            },
                            "displayValue": "Misc. Request"
                        }
                    ],
                    allowNew: false,
                    sortAsGiven: false
                }
            });

        return tableToFieldToFieldTypeMap;
    }

    /**
     * Calls the e2eBase and service classes to create test data via the API
     * @param _createdRecs - Print function to call when dataGen is finished
     */
    function generateNewData(_createdRecs) {
        let appName = "Automation Demo";
        // App setup //
        e2eBase.appService.createNamedAppSchema(makeAppMap(), appName).then(function(appResponse) {
            createdApp = appResponse;

            // Tables setup //
            let tableSetupPromises = [];

            // If using JS for loops with promise functions make sure to use Bluebird's Promise.each function
            // otherwise errors can be swallowed!
            createdApp.tables.forEach(function(table, index) {
                tableSetupPromises.push(function() {
                    // Set the default table homepage for each
                    return e2eBase.tableService.setDefaultTableHomePage(createdApp.id, table.id, 1);
                });
            });

            // Bluebird's promise.each function (executes each promise sequentially)
            return promise.each(tableSetupPromises, function(queueItem) {
                // This is an iterator that executes each Promise function in the array here
                return queueItem();
            });
        }).then(function() {
            // Record Creation //

            // Set the number of records to create for each table by default
            var recordsConfig = {numRecordsToCreate: e2eConsts.DEFAULT_NUM_RECORDS_TO_CREATE, tablesConfig: {}};
            // Change # of records for some of the tables
            var table1Name = 'Project Request';
            recordsConfig.tablesConfig[createdApp.tables[table1Name]] = {};
            recordsConfig.tablesConfig[createdApp.tables[table1Name]].numRecordsToCreate = 20;
            return e2eBase.recordService.createRecords(createdApp, recordsConfig);
        }).then(function() {
            // Report Creation //
            let reportSetupPromises = [];

            //TODO: We can change these report create calls to the generic / parameter based function in reportService
            reportSetupPromises.push(function() {
                // Create a report with facets in Table 1
                return e2eBase.reportService.createReportWithFacets(createdApp.id, createdApp.tables[e2eConsts.TABLE1].id, [6, 7, 8, 9]);
            });
            // Bluebird's promise.each function (executes each promise sequentially)
            return promise.each(reportSetupPromises, function(queueItem) {
                // This is an iterator that executes each Promise function in the array here
                return queueItem();
            });
        }).then(function() {
            // Users Setup //

            // Generate and add the default set of Users to the app
            return e2eBase.userService.addDefaultUserListToApp(createdApp.id);
        }).then(function() {
            // Forms Setup //

            // Create a default form for each table (uses the app JSON)
            return e2eBase.formService.createDefaultForms(createdApp);
        }).then(function() {
            // Print the generated test data and endpoints
            _createdRecs();
        }).catch(function(error) {
            // Global catch that will grab any errors from chain above
            if (error) {
                log.error('Error during data setup:  ' + error.message);
                log.error('Stacktrace: ' + error.stack);
            } else {
                log.error('Exiting on catch null error: ' + console.trace());
            }
        });
    }

    /**
     *  Prints out the generated test data and endpoints to the console.
     */
    function createdRecs() {
        var realmName = e2eBase.recordBase.apiBase.realm.subdomain;
        var realmId = e2eBase.recordBase.apiBase.realm.id;
        var appId = createdApp.id;

        var ticketEndpointRequest = e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint);
        var appEndpointRequest = e2eBase.getRequestAppsPageEndpoint(realmName);

        var tableNames = '';
        createdApp.tables.forEach((table, index) => {
            tableNames += 'Table ' + index + ' Id: ' + table.id + '\n';
            tableNames += 'Table ' + index + ' Name: ' + table.name + '\n';
            tableNames += 'Table ' + index + ' Report link: ' + e2eBase.getRequestReportsPageEndpoint(realmName, appId, table.id, 1)  + '\n';
        });
        console.log('\nHere is your generated test data: \n' +
            'realmName: ' + realmName + '\n' +
            'realmId: ' + realmId + '\n' +
            'appName: ' +  createdApp.name + '\n' +
            'appId: ' + appId + '\n' +
            'To generate a session ticket for your realm paste this into your browser: \n' +
            ticketEndpointRequest + '\n' +
            'Access your test app here (must have generated a ticket first): \n' +
            appEndpointRequest + '\n\n' +
            tableNames
        );
    }
}());
