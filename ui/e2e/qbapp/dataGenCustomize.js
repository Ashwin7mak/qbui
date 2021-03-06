/**
 * standalone script for generating test data on the backend
 *
 *
 * expects java server running and node server running
 *
 * expects NODE_ENV to be defined e.g. NODE_ENV=local
 *
 * run from qbui directory with `node ui/e2e/qbapp/dataGenCustomize.js`
 *
 * */
// jshint sub: true
// jscs:disable requireDotNotation

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
        var numericChoices = e2eBase.choicesSetUp(consts.NUMERIC, e2eConsts.DEFAULT_NUM_CHOICES_TO_CREATE, {
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

        tableToFieldToFieldTypeMap[table2Name] = {};
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

        addColumn(tableToFieldToFieldTypeMap[table2Name], e2eConsts.dataType.DATE);
        addColumn(tableToFieldToFieldTypeMap[table2Name], e2eConsts.dataType.PHONE_NUMBER, "Phone Number With Ext");
        addColumn(tableToFieldToFieldTypeMap[table2Name], e2eConsts.dataType.PHONE_NUMBER, "Phone Number without Ext", {dataAttr:{clientSideAttributes: baseTextClientRequiredProps, includeExtension: false}});

        tableToFieldToFieldTypeMap[table3Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table3Name], e2eConsts.dataType.TEXT);
        addColumn(tableToFieldToFieldTypeMap[table3Name], e2eConsts.dataType.DATE);
        addColumn(tableToFieldToFieldTypeMap[table3Name], e2eConsts.dataType.DATE_TIME);
        addColumn(tableToFieldToFieldTypeMap[table3Name], e2eConsts.dataType.CHECKBOX);

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

        var choices = e2eBase.choicesSetUp(consts.TEXT, e2eConsts.DEFAULT_NUM_CHOICES_TO_CREATE, {
            capitalize: true,
            numWords: 1,
            randNumWords: false,
            wordType: 'realEnglishNouns'
        });
        //temporarily add a placeholder blank(unchosen) selection to top of list
        //once backend is fixed to support null/empty entry for choice to clear/unset choice then
        //note numeric will also need a way to support setting null to clear the choice
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


        tableToFieldToFieldTypeMap[table6Name] = {};
        let baseDurationProps = {
            dataAttr: {
                clientSideAttributes: baseNumClientRequiredProps,
                type : 'DURATION',
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

    function generateNewData(_createdRecs) {
        e2eBase.tablesSetUp(makeAppMap()).then(function(appResponse) {
            app = appResponse;
            // Initialize table properties for generated tables
            app.tables.forEach(function(table, index) {
                return e2eBase.tableServiceWdio.initTableProperties(app.id, table.id, table.name);
            });
        }).then(function() {
            var recordsConfig = {numRecordsToCreate: e2eConsts.DEFAULT_NUM_RECORDS_TO_CREATE, tablesConfig: {}};
            // change # of records for some of the tables
            recordsConfig.tablesConfig[app.tables[e2eConsts.TABLE3].name] = {};
            recordsConfig.tablesConfig[app.tables[e2eConsts.TABLE3].name].numRecordsToCreate = 45;
            recordsConfig.tablesConfig[app.tables[e2eConsts.TABLE4].name] = {};
            recordsConfig.tablesConfig[app.tables[e2eConsts.TABLE4].name].numRecordsToCreate = 100;
            recordsConfig.tablesConfig[app.tables[e2eConsts.TABLE5].name] = {};
            recordsConfig.tablesConfig[app.tables[e2eConsts.TABLE5].name].numRecordsToCreate = 3;
            recordsConfig.tablesConfig[app.tables[e2eConsts.TABLE7].name] = {};
            recordsConfig.tablesConfig[app.tables[e2eConsts.TABLE7].name].numRecordsToCreate = 5;
            recordsConfig.tablesConfig[app.tables[e2eConsts.TABLE8].name] = {};
            recordsConfig.tablesConfig[app.tables[e2eConsts.TABLE8].name].numRecordsToCreate = 6;
            recordsConfig.tablesConfig[app.tables[e2eConsts.TABLE7].name] = {};
            recordsConfig.tablesConfig[app.tables[e2eConsts.TABLE7].name].numRecordsToCreate = 5;
            recordsConfig.tablesConfig[app.tables[e2eConsts.TABLE8].name] = {};
            recordsConfig.tablesConfig[app.tables[e2eConsts.TABLE8].name].numRecordsToCreate = 6;
            var createdResults = e2eBase.recordsSetUp(app, recordsConfig);

            return createdResults.then(function(results) {
                console.log(JSON.stringify(createdResults));
                // after all the promises in results are done then call done callback to report complete
                return Promise.all(results.allPromises);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                console.log('Error during createRecords  ' + error.message);
                console.log('stacktrace:' + error.stack);
            });
        }).then(function() {
            // Generate 1 empty record
            var nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[e2eConsts.TABLE3]);
            var generatedEmptyRecords = e2eBase.recordService.generateEmptyRecords(nonBuiltInFields, 1);
            return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE3], generatedEmptyRecords);
        }).then(function() {
            // Create a report that includes fields that are not editable by the user
            return e2eBase.reportService.createReportWithFids(app.id, app.tables[e2eConsts.TABLE1].id, [1, 2, 3, 4, 5, 6, 7, 8], null, 'Report with Uneditable Fields');
        }).then(function() {
            //Create a report with facets in table 3
            return e2eBase.reportService.createReportWithFacets(app.id, app.tables[e2eConsts.TABLE3].id, [6, 7, 8, 9]);
        }).then(function() {
            //Create a report with ID field in table 7
            return e2eBase.reportService.createReportWithFids(app.id, app.tables[e2eConsts.TABLE7].id, [3, 6, 7], null, 'Report with ID field');
        }).then(function() {
            //Reset default report for table 7
            return e2eBase.tableService.setDefaultTableHomePage(app.id, app.tables[e2eConsts.TABLE7].id, 2);
        }).then(function() {
            //Create a report with ID field in table 8
            return e2eBase.reportService.createReportWithFids(app.id, app.tables[e2eConsts.TABLE8].id, [3, 6, 7], null, 'Report with ID field');
        }).then(function() {
            //Reset default report for table 8
            return e2eBase.tableService.setDefaultTableHomePage(app.id, app.tables[e2eConsts.TABLE8].id, 2);
        }).then(function() {
            const promises = [];
            // Numeric key entry for the relationship's child table corresponds to a parent's recordId.
            // These need to be integers in the range of 1~n, n being the number of parent records
            // We also want these to be consistent, as opposed to randomly generated numbers, for
            // testing purposes.
            let fieldToEdit = app.tables[e2eConsts.TABLE8].fields[6];
            let editRecords = e2eBase.recordService.generateRecordsFromValues(fieldToEdit, [1, 1, 2, 2, 2, 3]);
            promises.push(e2eBase.recordService.editRecords(app.id, app.tables[e2eConsts.TABLE8].id, editRecords));

            // TABLE10 has 2 parents, set first numeric field
            fieldToEdit = app.tables[e2eConsts.TABLE10].fields[6];
            editRecords = e2eBase.recordService.generateRecordsFromValues(fieldToEdit, [1, 1, 2, 2, 2, 3]);
            promises.push(e2eBase.recordService.editRecords(app.id, app.tables[e2eConsts.TABLE10].id, editRecords));

            // TABLE10 has 2 parents, set 2nd numeric field
            fieldToEdit = app.tables[e2eConsts.TABLE10].fields[7];
            editRecords = e2eBase.recordService.generateRecordsFromValues(fieldToEdit, [1, 1, 2, 2, 2, 3]);
            promises.push(e2eBase.recordService.editRecords(app.id, app.tables[e2eConsts.TABLE10].id, editRecords));

            // Create tables relationship, table 8 is a child of table 7
            promises.push(e2eBase.relationshipService.createOneToOneRelationship(app, app.tables[e2eConsts.TABLE7], app.tables[e2eConsts.TABLE8], 7));

            // table 10 is a child of both table 7 and table 9
            promises.push(e2eBase.relationshipService.createOneToOneRelationship(app, app.tables[e2eConsts.TABLE7], app.tables[e2eConsts.TABLE10], 7));
            promises.push(e2eBase.relationshipService.createOneToOneRelationship(app, app.tables[e2eConsts.TABLE9], app.tables[e2eConsts.TABLE10], 8));
            return Promise.all(promises);
        }).then(function() {
            //set table home pages to 1st report
            // Create a default form for each table (uses the app JSON)
            return e2eBase.formService.createDefaultForms(app);
        }).then(function() {
            // print the generated test data and endpoints
            _createdRecs();
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
}());
