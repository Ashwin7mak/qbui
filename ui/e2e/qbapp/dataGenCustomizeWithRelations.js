/**
 * standalone script for generating test data with relationship on the backend
 *Two tables are created, named 'Master Table' and 'Child Table'
 * Releationship: 'Record ID#' field of Master Table is Primary Key and 'Numeric FK' field of Child Table  is foriegn key
 *
 * expects java server running and node server running
 *
 * expects NODE_ENV to be defined e.g. NODE_ENV=local
 *
 * run from qbui directory with `node ui/e2e/qbapp/dataGenCustomizeWithRelations.js`
 *
 * */

e2eConsts = require('../common/e2eConsts');
consts = require('../../common/src/constants.js');

(function() {
    'use strict';
    var realmToUse = 'localhost';       // change this to a string i.e. "myRealm" of an existing realm to use
    // if you set realmToUse null it will randomly generated a new realm name

    var config = require('../../server/src/config/environment');
    if (realmToUse) {
        config.realmToUse = realmToUse;
    }

    //Require the e2e base class and constants modules
    var e2eBase = require('../common/e2eBase.js')(config);
    var _ = require('lodash');
    var chance = require('chance').Chance();

    var app;

    //generate an app and console log the app and tables it created when done
    generateNewData(() => {
        createdRecs();
    });

    function addColumn(table, type, name, settings) {

        //optionally supplied specific field name otherwise use the fields type
        let fieldName = name || type.columnName;

        table[fieldName] = {
            fieldType: consts.SCALAR,
            dataType: type.name
        };

        // optional add supplied attrs
        if (settings) {
            table[fieldName] = Object.assign({}, table[fieldName], settings);
            console.log('SETTINGS!!: ', table[fieldName]);
        }
    }

    function makeAppMap() {
        var table1Name = 'Master Table ';
        var table2Name = 'Child Table ';

        // convenience reusable settings
        var baseNumClientRequiredProps = {
            width: 50,
            bold: false,
            word_wrap: false,
            separator_start: 4
        };
        let baseTextClientRequiredProps = {
            width: 50,
            bold: false,
            word_wrap: false,
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
        var tableToFieldToFieldTypeMap = {};
        tableToFieldToFieldTypeMap[table1Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.TEXT);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.NUMERIC);

        tableToFieldToFieldTypeMap[table2Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table2Name], e2eConsts.dataType.TEXT);
        addColumn(tableToFieldToFieldTypeMap[table2Name], e2eConsts.dataType.NUMERIC, "Numeric FK");
        var textChoices = e2eBase.choicesSetUp(consts.TEXT, e2eConsts.DEFAULT_NUM_CHOICES_TO_CREATE, {
            capitalize: true,
            numWords: 2,
            randNumWords: true,
            wordType: 'randomLetters',
            wordLength: 6
        });
        //temporarily add a placeholder blank(unchosen) selection to top of list
        textChoices.unshift(emptyChoice);
        addColumn(tableToFieldToFieldTypeMap[table2Name], e2eConsts.dataType.TEXT, "Text MultiChoice",
            {
                dataAttr: {htmlAllowed: true, clientSideAttributes: Object.assign({}, baseTextClientRequiredProps)},
                multipleChoice: {
                    choices: textChoices,
                    allowNew: false,
                    sortAsGiven: false
                }
            });

        return tableToFieldToFieldTypeMap;
    }

    function generateNewData(done) {
        e2eBase.tablesSetUp(makeAppMap()).then(function(createdApp) {
            // Set your global objects to use in the test functions
            app = createdApp;

            var recordsConfig = {numRecordsToCreate: e2eConsts.DEFAULT_NUM_RECORDS_TO_CREATE, tablesConfig: {}};
            var createdResults = e2eBase.recordsSetUp(app, recordsConfig);

            createdResults.then(function(results) {
                console.log(JSON.stringify(createdResults));
                // after all the promises in results are done then call done callback to report complete
                return Promise.all(results.allPromises);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                console.log('Error during createRecords  ' + error.message);
                console.log('stacktrace:' + error.stack);
            });
            createRelationship();
        }).then(function() {
            //set table home pages to 1st report
            // Create a default form for each table (uses the app JSON)
            e2eBase.formService.createDefaultForms(app);
            done();
        }).catch(function(error) {
            // Global catch that will grab any errors from chain above
            if (error) {
                console.log('Error during setup  ' + error.message);
                console.log('stacktrace:' + error.stack);
            } else {
                console.log('exiting on catch null error' + console.trace());
            }
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
            tableNames += 'table' + index + ' Id:' + table.id + '\n';
            tableNames += 'table' + index + ' Name:' + table.name + '\n';
            tableNames += 'table' + index + ' Report link:' + e2eBase.getRequestReportsPageEndpoint(realmName, appId, table.id, 1)  + '\n';

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

    /**
     * Creates a relationship between Master and Child tables
     *
     */
    function createRelationship()  {
        var FK_FIELD_NAME = 'Numeric FK';
        var RECORD_ID_NAME = 'Record ID#';
        var masterTableId = app.tables[0].id;
        var detailTableId = app.tables[1].id;
        var masterTablePkField = null;
        var detailTableFkField = null;
        app.tables[0].fields.forEach(function(field) {
            if (field.name === RECORD_ID_NAME) {
                masterTablePkField = field;
            }
        });

        app.tables[1].fields.forEach(function(field) {
            if (field.name === FK_FIELD_NAME) {
                detailTableFkField = field;
            }
        });

        var relationshipToCreate = {
            appId        : app.id,
            masterTableId: masterTableId,
            masterFieldId: masterTablePkField.id,
            detailTableId: detailTableId,
            detailFieldId: detailTableFkField.id,
            description  : 'Referential integrity relationship between Master / Child Tables'
        };
        e2eBase.recordBase.createRelationship(relationshipToCreate).then(function(relResponse) {
            var relationship = JSON.parse(relResponse.body);
            console.log('Relationship Created with ID: ' + relationship.id);

        });
    }
}());
