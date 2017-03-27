/**
 * Standalone script for generating test data for the UI
 *
 * expects java server, experience engine and node server running
 * expects NODE_ENV to be defined e.g. NODE_ENV=local
 *
 * run from qbui directory with `node ui/wdio/dataGen/dataGenCustomize.js`
 */

// jshint sub: true
// jscs:disable requireDotNotation

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
        var table1Name = 'Table 1 ';
        var table2Name = 'Table 2 ';
        var table3Name = 'Table 3 ';
        var table4Name = 'Table 4 ';
        var table5Name = 'All Required';
        var table6Name = 'Durations';
        var table7Name = 'Unique Fields';
        var table8Name = 'Parent Table 1';
        var table9Name = 'Child Table 1';
        var table10Name = 'Parent Table 2';
        var table11Name = 'Child Table 2';

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
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.TEXT);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.NUMERIC);
        var numericChoices = e2eBase.tableService.choicesSetUp(consts.NUMERIC, e2eConsts.DEFAULT_NUM_CHOICES_TO_CREATE, {
            int: true,
            min: 1,
            max: 1000
        });
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.NUMERIC, "Numeric MultiChoice",
            {
                dataAttr: {clientSideAttributes: baseNumClientRequiredProps},
                decimalPlaces: 0,
                treatNullAsZero: true,
                unitsDescription: "",
                multipleChoice: {
                    choices: numericChoices,
                    allowNew: false,
                    sortAsGiven: false
                }
            });
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.CURRENCY);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.PERCENT);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.RATING);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.DATE);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.DATE_TIME);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.TIME_OF_DAY);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.DURATION);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.CHECKBOX);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.CHECKBOX, "Yes No Checkbox",
            {dataAttr: {clientSideAttributes: checkboxYNClientProps}});
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.PHONE_NUMBER);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.EMAIL_ADDRESS);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.EMAIL_ADDRESS, "Email Only Before @",
            {dataAttr: {clientSideAttributes: emailOnlyDisplayBeforeAtSymbol}});
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.EMAIL_ADDRESS, "Email Before Underscore",
            {dataAttr: {clientSideAttributes: emailOnlyDisplayBeforeUnderscore}});
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.EMAIL_ADDRESS, "Email with Default Domain",
            {dataAttr: emailDefaultDomain});
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.URL);
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.URL, "URL Button",
            {dataAttr: urlButton});
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.URL, "URL Same Window",
            {dataAttr: urlOpenInSameWindow});
        addColumn(tableToFieldToFieldTypeMap[table1Name], e2eConsts.dataType.USER);

        // Table 2 //

        tableToFieldToFieldTypeMap[table2Name] = {};
        var textChoices = e2eBase.tableService.choicesSetUp(consts.TEXT, e2eConsts.DEFAULT_NUM_CHOICES_TO_CREATE, {
            capitalize: true,
            numWords: 2,
            randNumWords: true,
            wordType: 'randomLetters',
            wordLength: 6
        });
        // Temporarily add a placeholder blank (not chosen) selection to top of list
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
        addColumn(tableToFieldToFieldTypeMap[table2Name], e2eConsts.dataType.DATE);
        addColumn(tableToFieldToFieldTypeMap[table2Name], e2eConsts.dataType.PHONE_NUMBER, "Phone Number With Ext");
        addColumn(tableToFieldToFieldTypeMap[table2Name], e2eConsts.dataType.PHONE_NUMBER, "Phone Number without Ext", {dataAttr:{clientSideAttributes: baseTextClientRequiredProps, includeExtension: false}});

        // Table 3 //

        tableToFieldToFieldTypeMap[table3Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table3Name], e2eConsts.dataType.TEXT);
        addColumn(tableToFieldToFieldTypeMap[table3Name], e2eConsts.dataType.DATE);
        addColumn(tableToFieldToFieldTypeMap[table3Name], e2eConsts.dataType.DATE_TIME);
        addColumn(tableToFieldToFieldTypeMap[table3Name], e2eConsts.dataType.CHECKBOX);

        // Table 4 //

        tableToFieldToFieldTypeMap[table4Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table4Name], e2eConsts.dataType.TEXT, "Single line required", {required: true});
        addColumn(tableToFieldToFieldTypeMap[table4Name], e2eConsts.dataType.TEXT, "MultiLine",
            {dataAttr: {clientSideAttributes: Object.assign({}, baseTextClientRequiredProps, {num_lines: 6})}});
        addColumn(tableToFieldToFieldTypeMap[table4Name], e2eConsts.dataType.TEXT, "Max 10 chars",
            {dataAttr: {clientSideAttributes: Object.assign({}, baseTextClientRequiredProps, {max_chars: 10})}});
        addColumn(tableToFieldToFieldTypeMap[table4Name], e2eConsts.dataType.TEXT, "Wordwrap",
            {dataAttr: {clientSideAttributes: Object.assign({}, baseTextClientRequiredProps, {word_wrap: true})}});
        addColumn(tableToFieldToFieldTypeMap[table4Name], e2eConsts.dataType.TEXT, "Input width 10",
            {dataAttr: {clientSideAttributes: Object.assign({}, baseTextClientRequiredProps, {width: 10})}});
        addColumn(tableToFieldToFieldTypeMap[table4Name], e2eConsts.dataType.TEXT, "Html allowed single line",
            {dataAttr: {htmlAllowed: true}});
        addColumn(tableToFieldToFieldTypeMap[table4Name], e2eConsts.dataType.TEXT, "Html allowed multiLine",
            {
                dataAttr: {
                    htmlAllowed: true,
                    clientSideAttributes: Object.assign({}, baseTextClientRequiredProps, {num_lines: 4})
                }
            });
        var choices = e2eBase.tableService.choicesSetUp(consts.TEXT, e2eConsts.DEFAULT_NUM_CHOICES_TO_CREATE, {
            capitalize: true,
            numWords: 1,
            randNumWords: false,
            wordType: 'realEnglishNouns'
        });
        // temporarily add a placeholder blank (unchosen) selection to top of list
        // once backend is fixed to support null/empty entry for choice to clear/unset choice then
        // note numeric will also need a way to support setting null to clear the choice
        // this can happen in the client editor component
        choices.unshift(emptyChoice);
        addColumn(tableToFieldToFieldTypeMap[table4Name], e2eConsts.dataType.TEXT, "MultiChoice",
            {
                dataAttr: {htmlAllowed: true, clientSideAttributes: Object.assign({}, baseTextClientRequiredProps)},
                multipleChoice: {
                    choices: choices,
                    allowNew: false,
                    sortAsGiven: false
                }
            });

        // Table 5 //

        tableToFieldToFieldTypeMap[table5Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.TEXT, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.TEXT, "Text MultiChoice",
            {
                required: true,
                dataAttr: {htmlAllowed: true, clientSideAttributes: Object.assign({}, baseTextClientRequiredProps)},
                multipleChoice: {
                    choices: _.clone(textChoices),
                    allowNew: true,
                    sortAsGiven: true
                }
            });
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.TEXT, "MultiLine",
            {
                required: true,
                dataAttr: {clientSideAttributes: Object.assign({}, baseTextClientRequiredProps, {num_lines: 5})}
            });
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.NUMERIC, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.NUMERIC, "Numeric MultiChoice",
            {
                required: true,
                dataAttr: {clientSideAttributes: baseNumClientRequiredProps},
                decimalPlaces: 0,
                treatNullAsZero: true,
                unitsDescription: "",
                multipleChoice: {
                    choices: _.clone(numericChoices),
                    allowNew: false,
                    sortAsGiven: false
                }
            });
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.CURRENCY, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.PERCENT, null, {required: false});
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.RATING, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.DATE, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.DATE_TIME, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.TIME_OF_DAY, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.DURATION, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.CHECKBOX, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.PHONE_NUMBER, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.EMAIL_ADDRESS, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.URL, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.PHONE_NUMBER, "Phone Number without Ext", {required:true, dataAttr:{clientSideAttributes: baseTextClientRequiredProps, includeExtension: false}});

        // Table 6 //

        tableToFieldToFieldTypeMap[table6Name] = {};
        let baseDurationProps = {
            dataAttr: {
                clientSideAttributes: baseNumClientRequiredProps,
                type : 'DURATION'
            }
        };
        addColumn(tableToFieldToFieldTypeMap[table6Name], e2eConsts.dataType.DURATION, 'Duration default');
        addColumn(tableToFieldToFieldTypeMap[table6Name], e2eConsts.dataType.DURATION, 'Duration A',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.WEEKS
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6Name], e2eConsts.dataType.DURATION, 'Duration B',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.DAYS
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6Name], e2eConsts.dataType.DURATION, 'Duration C',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.HOURS
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6Name], e2eConsts.dataType.DURATION, 'Duration D',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.MINUTES
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6Name], e2eConsts.dataType.DURATION, 'Duration E',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.SECONDS
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6Name], e2eConsts.dataType.DURATION, 'Duration :HH:MM',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.HHMM
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6Name], e2eConsts.dataType.DURATION, 'Duration :HH:MM:SS',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.HHMMSS
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6Name], e2eConsts.dataType.DURATION, 'Duration :MM',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.MM
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6Name], e2eConsts.dataType.DURATION, 'Duration :MM:SS',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.MMSS
                }
            }));

        // Table 7 //

        tableToFieldToFieldTypeMap[table7Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.TEXT, 'Unique Text', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.TEXT, 'Unique Text MultiChoice',
            {
                unique: true,
                dataAttr: {htmlAllowed: true, clientSideAttributes: Object.assign({}, baseTextClientRequiredProps)},
                multipleChoice: {
                    choices: _.clone(textChoices),
                    allowNew: true,
                    sortAsGiven: true
                }
            });
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.TEXT, 'Unique MultiLine',
            {
                unique: true,
                dataAttr: {clientSideAttributes: Object.assign({}, baseTextClientRequiredProps, {num_lines: 5})}
            });
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.NUMERIC, 'Unique Numeric', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.NUMERIC, 'Unique Numeric MultiChoice',
            {
                unique: true,
                dataAttr: {clientSideAttributes: baseNumClientRequiredProps},
                decimalPlaces: 0,
                treatNullAsZero: true,
                unitsDescription: "",
                multipleChoice: {
                    choices: _.clone(numericChoices),
                    allowNew: true,
                    sortAsGiven: false
                }
            });
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.CURRENCY, 'Unique Currency', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.PERCENT, 'Unique Percent', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.RATING, 'Unique Rating', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.DATE, 'Unique Date', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.DATE_TIME, 'Unique Date Time', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.TIME_OF_DAY, 'Unique Time', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.DURATION, 'Unique Duration', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.PHONE_NUMBER, 'Unique Phone', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.EMAIL_ADDRESS, 'Unique Email', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7Name], e2eConsts.dataType.URL, 'Unique URL', {unique: true});

        // Table 8 //

        // Parent table 1 is a parent to child table1 and child table2
        tableToFieldToFieldTypeMap[table8Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table8Name], e2eConsts.dataType.TEXT, 'Text Field', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table8Name], e2eConsts.dataType.NUMERIC, 'Numeric Field', {unique: false});
        // Child table 1 is a child of Parent table 1
        tableToFieldToFieldTypeMap[table9Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table9Name], e2eConsts.dataType.TEXT, 'Text Field', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table9Name], e2eConsts.dataType.NUMERIC, 'Numeric Parent1 ID', {unique: false});
        // Parent table 2 is a parent to Child table 2
        tableToFieldToFieldTypeMap[table10Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table10Name], e2eConsts.dataType.TEXT, 'Text Field', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table10Name], e2eConsts.dataType.NUMERIC, 'Numeric Field', {unique: false});
        // Child table 2 is a child of Parent table 1 and Parent table 2
        tableToFieldToFieldTypeMap[table11Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table11Name], e2eConsts.dataType.TEXT, 'Text Field', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table11Name], e2eConsts.dataType.NUMERIC, 'Numeric Parent1 ID', {unique: false});
        addColumn(tableToFieldToFieldTypeMap[table11Name], e2eConsts.dataType.NUMERIC, 'Numeric Parent2 ID', {unique: false});

        return tableToFieldToFieldTypeMap;
    }

    /**
     * Calls the e2eBase and service classes to create test data via the API
     * @param _createdRecs - Print function to call when dataGen is finished
     */
    function generateNewData(_createdRecs) {
        // App setup //
        e2eBase.appService.createAppSchema(makeAppMap()).then(function(appResponse) {
            createdApp = appResponse;

            // Tables setup //
            let tableSetupPromises = [];

            // If using JS for loops with promise functions make sure to use Bluebird's Promise.each function
            // otherwise errors can be swallowed!
            createdApp.tables.forEach(function(table, index) {
                // Initialize table properties for generated tables
                tableSetupPromises.push(function() {
                    // Initialize table properties (via Experience Engine)
                    return e2eBase.tableService.initTableProperties(createdApp.id, table.id, table.name);
                });
                tableSetupPromises.push(function() {
                    // Create a List all report for each table
                    return e2eBase.reportService.createCustomReport(createdApp.id, table.id, 'List All Report', null, null, null, null);
                });
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
            recordsConfig.tablesConfig[createdApp.tables[e2eConsts.TABLE3].name] = {};
            recordsConfig.tablesConfig[createdApp.tables[e2eConsts.TABLE3].name].numRecordsToCreate = 45;
            recordsConfig.tablesConfig[createdApp.tables[e2eConsts.TABLE4].name] = {};
            recordsConfig.tablesConfig[createdApp.tables[e2eConsts.TABLE4].name].numRecordsToCreate = 100;
            recordsConfig.tablesConfig[createdApp.tables[e2eConsts.TABLE5].name] = {};
            recordsConfig.tablesConfig[createdApp.tables[e2eConsts.TABLE5].name].numRecordsToCreate = 3;
            //TODO: Table 6 contains records with all unique fields so don't generate any records (currently broken)
            //TODO: Enhance record data generation to handle unique and all required fields
            recordsConfig.tablesConfig[createdApp.tables[e2eConsts.TABLE6].name] = {};
            recordsConfig.tablesConfig[createdApp.tables[e2eConsts.TABLE6].name].numRecordsToCreate = 0;
            recordsConfig.tablesConfig[createdApp.tables[e2eConsts.TABLE7].name] = {};
            recordsConfig.tablesConfig[createdApp.tables[e2eConsts.TABLE7].name].numRecordsToCreate = 5;
            recordsConfig.tablesConfig[createdApp.tables[e2eConsts.TABLE8].name] = {};
            recordsConfig.tablesConfig[createdApp.tables[e2eConsts.TABLE8].name].numRecordsToCreate = 6;

            return e2eBase.recordService.createRecords(createdApp, recordsConfig);
        }).then(function() {
            // Report Creation //
            let reportSetupPromises = [];

            //TODO: We can change these report create calls to the generic / parameter based function in reportService
            reportSetupPromises.push(function() {
                // Create a report that includes fields that are not editable by the user in Table 1
                return e2eBase.reportService.createReportWithFids(createdApp.id, createdApp.tables[e2eConsts.TABLE1].id, [1, 2, 3, 4, 5, 6, 7, 8], null, 'Report with Uneditable Fields');
            });
            reportSetupPromises.push(function() {
                // Create a report with facets in Table 3
                return e2eBase.reportService.createReportWithFacets(createdApp.id, createdApp.tables[e2eConsts.TABLE3].id, [6, 7, 8, 9]);
            });
            reportSetupPromises.push(function() {
                // Create a report with ID field in Table 7
                return e2eBase.reportService.createReportWithFids(createdApp.id, createdApp.tables[e2eConsts.TABLE7].id, [3, 6, 7], null, 'Report with ID field');
            });
            reportSetupPromises.push(function() {
                // Reset default report for Table 7
                return e2eBase.tableService.setDefaultTableHomePage(createdApp.id, createdApp.tables[e2eConsts.TABLE7].id, 2);
            });
            reportSetupPromises.push(function() {
                // Create a report with ID field in Table 8
                return e2eBase.reportService.createReportWithFids(createdApp.id, createdApp.tables[e2eConsts.TABLE8].id, [3, 6, 7], null, 'Report with ID field');
            });
            reportSetupPromises.push(function() {
                // Reset default report for Table 8
                return e2eBase.tableService.setDefaultTableHomePage(createdApp.id, createdApp.tables[e2eConsts.TABLE8].id, 2);
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
            //// Relationships Setup //

            //TODO: Finish this
            const editRecordPromises = [];
            // Numeric key entry for the relationship's child table corresponds to a parent's recordId.
            // These need to be integers in the range of 1~n, n being the number of parent records
            // We also want these to be consistent, as opposed to randomly generated numbers, for
            // testing purposes.
            let fieldToEdit = createdApp.tables[e2eConsts.TABLE8].fields[6];
            let editRecords = e2eBase.recordService.generateRecordsFromValues(fieldToEdit, [1, 1, 2, 2, 2, 3]);
            editRecordPromises.push(e2eBase.recordService.editRecords(createdApp.id, createdApp.tables[e2eConsts.TABLE8].id, editRecords));

            // Table 10 has 2 parents, set first numeric field
            fieldToEdit = createdApp.tables[e2eConsts.TABLE10].fields[6];
            editRecords = e2eBase.recordService.generateRecordsFromValues(fieldToEdit, [1, 1, 2, 2, 2, 3]);
            editRecordPromises.push(e2eBase.recordService.editRecords(createdApp.id, createdApp.tables[e2eConsts.TABLE10].id, editRecords));

            // Table 10 has 2 parents, set second numeric field
            fieldToEdit = createdApp.tables[e2eConsts.TABLE10].fields[7];
            editRecords = e2eBase.recordService.generateRecordsFromValues(fieldToEdit, [1, 1, 2, 2, 2, 3]);
            editRecordPromises.push(e2eBase.recordService.editRecords(createdApp.id, createdApp.tables[e2eConsts.TABLE10].id, editRecords));

            // Create table relationship, Table 8 is a child of Table 7
            editRecordPromises.push(e2eBase.relationshipService.createOneToOneRelationship(createdApp, createdApp.tables[e2eConsts.TABLE7], createdApp.tables[e2eConsts.TABLE8], 7));

            // Table 10 is a child of both Table 7 and Table 9
            editRecordPromises.push(e2eBase.relationshipService.createOneToOneRelationship(createdApp, createdApp.tables[e2eConsts.TABLE7], createdApp.tables[e2eConsts.TABLE10], 7));
            editRecordPromises.push(e2eBase.relationshipService.createOneToOneRelationship(createdApp, createdApp.tables[e2eConsts.TABLE9], createdApp.tables[e2eConsts.TABLE10], 8));
            return Promise.all(editRecordPromises);
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
