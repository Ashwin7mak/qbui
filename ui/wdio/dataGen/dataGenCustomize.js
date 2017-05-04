/**
 * Standalone script for generating test data for the UI
 *
 * expects java server, experience engine and node server running
 * expects NODE_ENV to be defined e.g. NODE_ENV=local
 *
 * run from the qbui directory with `node ui/wdio/dataGen/dataGenCustomize.js`
 * or you can create a NEW IntelliJ Node configuration and point it at this script
 *
 * Do NOT run this script via WebdriverIO. It is framework agnostic. It only makes use of the service modules found
 * in qbui/ui/wdio/common to avoid code duplication.
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


// Chance library
// gen a repeatable seed for random values, so any random generated info can be reproduced
var Chance = require('chance');
let seed = new Chance().integer({min: 1, max: 1000000000});
seed = 775205028;
let chance = new Chance(seed);

// Require the e2e base and constants modules
e2eBase = require('../common/e2eBase.js')(config);
e2eConsts = require('../common/e2eConsts');
consts = require('../../common/src/constants.js');
projGen = require('./projects/projectsGen.js')(chance);

(function() {
    'use strict';

    // Bluebird Promise library
    var promise = require('bluebird');
    // Logging library
    var log = require('../../server/src/logger').getLogger();
    // Lodash library
    var _ = require('lodash');
    // App JSON object returned by the createApp API call
    var createdApp;

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
    var table12Name = 'Country';
    var table13Name = 'State';
    var table14Name = 'City';

    // set which tables to create or set to null to create all
    var tablesToCreate = [
        //table1Name,
        projGen.tableCompaniesName,
        projGen.tableProjectsName,
        projGen.tableTasksName,
        projGen.tablePeopleName,
        projGen.tableAssignmentsName,
        projGen.tableCommentsName
    ];
    // or use null to create all the tables
    //tablesToCreate = null;

    log.debug('dataGenCustomize seed: ' + seed);

    // set the range of number of entities to generate
    const  minCompany = projGen.defaultMinNumOfCompanies;
    const  maxCompany = projGen.defaultMaxNumOfCompanies;
    const  minProj = projGen.defaultMinNumOfProjects;
    const  maxProj = projGen.defaultMaxNumOfProjects;
    const  minPeople = projGen.defaultMinNumOfPeople;
    const  maxPeople = projGen.defaultMaxNumOfPeople;
    const  minTask = projGen.defaultMinNumOfTasks;
    const  maxTask = projGen.defaultMaxNumOfTasks;
    const  minAssignee = projGen.defaultMinNumOfAssignees;
    const  maxAssignee = projGen.defaultMaxNumOfAssignees;
    const  minComment = projGen.defaultMaxNumOfComments;
    const  maxComment = projGen.defaultMaxNumOfComments;


    // Generate an app and log the app and tables it created when done
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
        }
    }

    /**
     * Creates a map object of the table and field structure for a QuickBase app
     * @returns Map object to pass into the test generators package to create a JSON app object for the API
     */
    function makeAppMap() {

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
        addColumn(tableToFieldToFieldTypeMap[table2Name], e2eConsts.dataType.PHONE_NUMBER, "Phone Number without Ext", {
            dataAttr: {
                clientSideAttributes: baseTextClientRequiredProps,
                includeExtension: false
            }
        });

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
        addColumn(tableToFieldToFieldTypeMap[table5Name], e2eConsts.dataType.PHONE_NUMBER, "Phone Number without Ext", {
            required: true,
            dataAttr: {clientSideAttributes: baseTextClientRequiredProps, includeExtension: false}
        });

        // Table 6 //

        tableToFieldToFieldTypeMap[table6Name] = {};
        let baseDurationProps = {
            dataAttr: {
                clientSideAttributes: baseNumClientRequiredProps,
                type: 'DURATION'
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
        //Country table is parent to State table
        tableToFieldToFieldTypeMap[table12Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table12Name], e2eConsts.dataType.TEXT, 'Country', {unique: true});
        // State Table Table
        tableToFieldToFieldTypeMap[table13Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table13Name], e2eConsts.dataType.TEXT, 'State', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table13Name], e2eConsts.dataType.TEXT, 'Country', {unique: false});
        // City Table
        tableToFieldToFieldTypeMap[table14Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table14Name], e2eConsts.dataType.TEXT, 'City', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table14Name], e2eConsts.dataType.TEXT, 'State', {unique: false});

        tableToFieldToFieldTypeMap = projGen.genSchema(tableToFieldToFieldTypeMap, addColumn);

        return tableToFieldToFieldTypeMap;
    }

    function getTable(app, name) {
        return _.find(app.tables, {'name': name});
    }

    function configNumRecordsToCreate({app, recordsConfig, tableName, numRecords}) {
        let table = getTable(app, tableName);
        if (table) {
            recordsConfig.tablesConfig[table.name] = {};
            recordsConfig.tablesConfig[table.name].numRecordsToCreate = numRecords;
        }
    }

    function createReport(app, tableName, fids, title) {
        // Create a report that includes fields
        let table = getTable(app, tableName);
        if (table) {
            return e2eBase.reportService.createReportWithFids(app.id, table.id, fids, null, title);
        } else {
            return promise.resolve('noop');
        }
    }
    function createReportExtended(app, tableName, {fids, facetFids, sortFids, query, reportName}) {
        // Create a report that includes fields, facets, sort and group
        let table = getTable(app, tableName);
        if (table) {
            return e2eBase.reportService.createReportWithFidsAndFacetsAndSortLists(
                app.id, table.id, fids, facetFids, sortFids, query, reportName);
        } else {
            return promise.resolve('noop');
        }
    }



    function createReportFacets(app, tableName, fids, title) {
        // Create a report with facets
        let table = getTable(app, tableName);
        if (table) {
            return e2eBase.reportService.createReportWithFacets(app.id, table.id, fids, null, title);
        } else {
            return promise.resolve('noop');
        }
    }

    function createDefaultTableHome(app, tableName, reportId) {
        // Create a report that includes fields that are not editable by the user in Table 1
        let table = getTable(app, tableName);
        if (table) {
            return e2eBase.tableService.setDefaultTableHomePage(app.id, table.id, reportId);
        } else {
            return promise.resolve('noop');
        }
    }

    function createSetDefaultHome(promises, app, tableName, fids, title, reportId) {
        let table = getTable(app, tableName);
        if (table) {
            promises.push(function() {
                // Create a report with ID field in Table
                return createReport(app, tableName, fids, title);
            });
            promises.push(function() {
                // Reset default report for Table
                return createDefaultTableHome(app, tableName, reportId);
            });
        }
    }

    function createSetDefaultHomeExtended(promises, app, tableName, options, reportId) {
        let table = getTable(app, tableName);
        if (table) {
            promises.push(function() {
                // Create a report with options
                return createReportExtended(app, tableName, options);
            });
            promises.push(function() {
                // Reset default report for Table
                return createDefaultTableHome(app, tableName, reportId);
            });
        }
    }

    function editRelationshipRecords(promises, app, tableName, fieldIndexToEdit, values) {
        let table = getTable(app, tableName);
        if (table) {
            promises.push(function() {
                if (table) {
                    let fieldToEdit = table.fields[fieldIndexToEdit];
                    let editRecords = e2eBase.recordService.generateRecordsFromValues(fieldToEdit, values);
                    return e2eBase.recordService.editRecords(app.id, table.id, editRecords);
                }
            });
        }
    }

    function setupRelationship(promises, app, parentTableName, childTableName, childFieldId, masterFieldId) {
        let parentTable = getTable(app, parentTableName);
        let childTable = getTable(app, childTableName);
        if (parentTable && childTable) {
            promises.push(function() {
                return e2eBase.relationshipService.createOneToOneRelationship(
                    app, parentTable, childTable, childFieldId, masterFieldId);
            });
        }
    }

    function logTableFields(table) {
        let fields = '';
        table.fields.forEach((field, fIndex) => {
            if (fIndex > 4) {
                let smallSet = _.pick(field, ['id', 'name', 'datatypeAttributes.type']);
                fields += `${fIndex}.) ${JSON.stringify(smallSet)}\n`;
            }
        });
        log.debug(`appId:${createdApp.id} appName:${createdApp.name} tableId:${table.id} tableName:${table.name} fields: \n${fields}`);

    }

    function makeRecordsInput(app, tableName, objToFidMapper, arrayOfObjs) {
        let table = getTable(app, tableName);
        if (table) {
            // Get the appropriate fields out of the table
            let nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(table);

            // Generate the record JSON objects
            let generatedRecords = e2eBase.recordService.generateEmptyRecords(nonBuiltInFields, arrayOfObjs.length);
            e2eBase.recordService.editRecordsWithFieldsCallback(generatedRecords, (field, recordIndx) => {
                let objKey = objToFidMapper(field.id);
                return objKey ? arrayOfObjs[recordIndx][objKey] : undefined;
            });
            return generatedRecords;
        }
        return [];
    }
    function addBulkRecords(app, tableName, table, records) {
        log.debug('adding ' + records.length + ' records to ' + tableName);
        e2eBase.recordService.addBulkRecords(app, table, records);
    }
    /**
     * Calls the e2eBase and service classes to create test data via the API
     * @param _createdRecs - Print function to call when dataGen is finished
     */
    function generateNewData(_createdRecs) {

        //relationship is being created for first ten countries/states, so using any number factor of ten is good
        const numOfCountries = 30;
        const numOfStates = 30;
        const numOfCities = 30;
        //create unique set of countries/states/cities
        const countries = chance.unique(chance.country, numOfCountries, {full: true});
        const states = chance.unique(chance.state, numOfStates, {full: true});
        const cities = chance.unique(chance.city, numOfCities, {full: true});

        //used while adding the lookUp field record values
        const numOfStatesPerCountry = 3;
        const numOfCitiesPerState = 3;


        // App setup //
        let tablesMap = makeAppMap();
        if (tablesToCreate) {
            // only create the tables in tablesToCreate if specified
            //otherwise creates them all
            tablesMap = _.pick(tablesMap, tablesToCreate);
        }

        e2eBase.appService.createAppSchema(tablesMap)
        .then(function(appResponse) {
            createdApp = appResponse;

            // Users Setup first//
            // Generate and add the default set of Users to the app
            return e2eBase.userService.addDefaultUserListToApp(createdApp.id);
        }).then(function() {

            // Tables setup //
            let tableSetupPromises = [];

            // If using JS for loops with promise functions make sure to use Bluebird's Promise.each function
            // otherwise errors can be swallowed!
            createdApp.tables.forEach(function(table, index) {
                tableSetupPromises.push(function() {
                    // Create a List all report for each table
                    logTableFields(table);
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
            const recordsConfig = {numRecordsToCreate: e2eConsts.DEFAULT_NUM_RECORDS_TO_CREATE, tablesConfig: {}};
            const configNumParams = {
                app: createdApp,
                recordsConfig,
            };
            // Change # of records for some of the tables
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table3Name, numRecords:45}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table4Name, numRecords:100}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table5Name, numRecords:3}));

            //TODO: Table 6 contains records with all unique fields so don't generate any records (currently broken)
            //TODO: Enhance record data generation to handle unique and all required fields
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table6Name, numRecords:0}));

            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table7Name, numRecords:5}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table8Name, numRecords:6}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table9Name, numRecords:6}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table10Name, numRecords:6}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table11Name, numRecords:31}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table12Name, numRecords:31}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table13Name, numRecords:31}));

            //project records will be created in a different way in the next then function below, so make no records here
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: projGen.tableCompaniesName, numRecords:0}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: projGen.tablePeopleName, numRecords:0}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: projGen.tableProjectsName, numRecords:0}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: projGen.tableTasksName, numRecords:0}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: projGen.tableAssignmentsName, numRecords:0}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: projGen.tableCommentsName, numRecords:0}));

            return e2eBase.recordService.createRecords(createdApp, recordsConfig);

        }).then(function() {
            const projPromises = [];


            //for each level create records for company & proj etc tables
            // one to many ->>
            //Company ->> Projects ->> Tasks ->> Assignment ->> Comments
            //            Projects <<- Manager
            //            Assignments <<- Person <<- Manager
            // male the list of companies, for each company create a company record



            projGen.initCompanies();
            const companies = projGen.genCompanies({},  chance.integer({min:minCompany, max:maxCompany}));
            let companyRecords = makeRecordsInput(createdApp, projGen.tableCompaniesName, projGen.getCompanyPropFromFid, companies);

            companies.forEach((company, companyIndex) => {
                //write out the company record
                projPromises.push(function() {
                    return addBulkRecords(createdApp, projGen.tableCompaniesName,
                        getTable(createdApp, projGen.tableCompaniesName), [companyRecords[companyIndex]]);
                });
                // create a list of employees with this current company
                projGen.initPeople();
                let employees = projGen.genPeople({companyName : company.name}, chance.integer({min:minPeople, max:maxPeople}));
                let managers = projGen. genManagers({companyName : company.name, employees});
                let directors = projGen.genDirectors({companyName : company.name, employees}, chance.integer({min:1, max:4}));

                // set a manager for everyone
                let everyone = [].concat(employees, managers, directors);
                everyone.forEach(person => {
                    let mgr = projGen.getManager(person);
                    if (mgr !== undefined) {
                        person.manger = mgr;
                    }
                });

                let departmentsWithEmployees = _.map(_.unionBy(everyone, 'department'), 'department');

                // make records input for the employees for the company
                let employeeRecords = makeRecordsInput(createdApp, projGen.tablePeopleName, projGen.getPeoplePropFromFid, everyone);
                if (employeeRecords && employeeRecords.length) {
                    projPromises.push(function() {
                        return addBulkRecords(createdApp, projGen.tablePeopleName, getTable(createdApp, projGen.tablePeopleName), employeeRecords);
                    });
                }

                // create a set projects for the current company
                projGen.initProjects();
                const projects = projGen.genProjects({companyName: company.name, availableDepts:departmentsWithEmployees}, chance.integer({min:minProj, max:maxProj}));

                //create tasks for each project
                projects.forEach((project) => {
                    //assign a leader to the project
                    project.projectLeader = chance.pickone([].concat(managers, directors)).fullname;

                    // create a set of tasks for the project with assignee from employee list
                    projGen.initTasks(everyone);
                    const tasks = projGen.genTasks({
                        projectName: project.name,
                        dict:{num: chance.integer({min:0, max:2})}},
                        chance.integer({min:minTask, max:maxTask}));

                    //create a set of assignments for each task
                    tasks.forEach(task => {
                        const assignees = projGen.genAssignees({
                            taskName : task.name,
                            taskId : task.taskId,
                            peopleList: everyone.filter(they => they.department === project.department),
                            department: project.department, projectName: project.name, companyName: company.name},
                            chance.integer({min:minAssignee, max:maxAssignee}));

                        //add some comments for the assignments progress
                        assignees.forEach(assignment => {
                            const comments = projGen.genComments({
                                topicId: assignment.assignmentId,
                                authors:[assignment.assignee, project.projectLeader]},
                                chance.integer({min:minComment, max:maxComment}));
                            // make records input for the comments for the assignment
                            let commentRecords = makeRecordsInput(createdApp, projGen.tableCommentsName, projGen.getCommentPropFromFid, comments);
                            if (commentRecords && commentRecords.length) {
                                projPromises.push(function() {
                                    return addBulkRecords(createdApp, projGen.tableCommentsName,
                                        getTable(createdApp, projGen.tableCommentsName), commentRecords);
                                });
                            }
                        });

                        // make records input for the assignees for the task
                        let assigneeRecords = makeRecordsInput(createdApp, projGen.tableAssignmentsName, projGen.getAssigneePropFromFid, assignees);
                        if (assigneeRecords && assigneeRecords.length) {
                            projPromises.push(function() {
                                return addBulkRecords(createdApp, projGen.tableAssignmentsName,
                                    getTable(createdApp, projGen.tableAssignmentsName), assigneeRecords);
                            });
                        }
                    });

                    // make records input for the tasks for the project
                    let taskRecords = makeRecordsInput(createdApp, projGen.tableTasksName, projGen.getTaskPropFromFid, tasks);
                    if (taskRecords && taskRecords.length) {
                        projPromises.push(function() {
                            return addBulkRecords(createdApp, projGen.tableTasksName, getTable(createdApp, projGen.tableTasksName), taskRecords);
                        });
                    }
                });

                let projectRecords = makeRecordsInput(createdApp, projGen.tableProjectsName, projGen.getProjectPropFromFid, projects);
                projectRecords.forEach((projectRecord) => {
                    projPromises.push(function() {
                        return addBulkRecords(createdApp, projGen.tableProjectsName, getTable(createdApp, projGen.tableProjectsName), [projectRecord]);
                    });
                });
            });

            // Bluebird's promise.each function (executes each promise sequentially)
            return promise.each(projPromises, function(queueItem) {
                return queueItem();
            });

        }).then(function() {
            // Report Creation //
            let rptPromises = [];

            //TODO: We can change these report create calls to the generic / parameter based function in reportService
            rptPromises.push(function() {
                // Create a report that includes fields that are not editable by the user in Table 1
                return createReport(createdApp, table1Name, [1, 2, 3, 4, 5, 6, 7, 8], 'Report with Uneditable Fields');
            });
            rptPromises.push(function() {
                return createReportFacets(createdApp, table3Name, [6, 7, 8, 9]);
            });
            //setup default home pages
            createSetDefaultHome(rptPromises, createdApp, table7Name, [3, 6, 7], 'Report with ID field', 2);
            createSetDefaultHome(rptPromises, createdApp, table8Name, [3, 6, 7], 'Report with ID field', 2);
            createSetDefaultHome(rptPromises, createdApp, table11Name, [3, 6], 'Report with ID field', 2);
            createSetDefaultHome(rptPromises, createdApp, table12Name, [3, 6, 7], 'Report with ID field', 2);
            createSetDefaultHome(rptPromises, createdApp, table13Name, [3, 6, 7], 'Report with ID field', 2);
            createSetDefaultHome(rptPromises, createdApp, projGen.tableCompaniesName, [3,
                projGen.getCompanyFid('name'),
                projGen.getCompanyFid('rank'),
                projGen.getCompanyFid('email'),
                projGen.getCompanyFid('url'),
                projGen.getCompanyFid('phone')], 'Report with ID field', 2);
            createSetDefaultHome(rptPromises, createdApp, projGen.tableProjectsName, [3,
                projGen.getProjectFid('name'),
                projGen.getProjectFid('department'),
                projGen.getProjectFid('startDate'),
                projGen.getProjectFid('budget'),
                projGen.getProjectFid('projectLeader'),
                projGen.getProjectFid('companyName')], 'Report with ID field', 2);
            createSetDefaultHome(rptPromises, createdApp, projGen.tableTasksName, [3,
                projGen.getTaskFid('name'),
                projGen.getTaskFid('projectName'),
                projGen.getTaskFid('status')], 'Task Report with ID field', 2);
            createSetDefaultHomeExtended(rptPromises, createdApp, projGen.tablePeopleName, {
                fids:[3,
                    projGen.getPeopleFid('fullname'),
                    projGen.getPeopleFid('title'),
                    projGen.getPeopleFid('birthday'),
                    projGen.getPeopleFid('manager'),
                    projGen.getPeopleFid('companyName'),
                    projGen.getPeopleFid('department')
                ],
                facetFids: [
                    projGen.getPeopleFid('companyName'),
                    projGen.getPeopleFid('department'),
                    projGen.getPeopleFid('title'),
                    projGen.getPeopleFid('manager')
                ],
                sortFids: [
                    `${projGen.getPeopleFid('companyName')}:V`,
                    `${projGen.getPeopleFid('department')}:V`,
                    `${projGen.getPeopleFid('title')}`
                ],
                reportName:'Employee Report with ID field'}, 2);
            createSetDefaultHome(rptPromises, createdApp, projGen.tableAssignmentsName, [3,
                projGen.getAssigneeFid('taskName'),
                projGen.getAssigneeFid('taskId'),
                projGen.getAssigneeFid('assigneeName'),
                projGen.getAssigneeFid('department'),
                projGen.getAssigneeFid('projectName'),
                projGen.getAssigneeFid('companyName'),
            ], 'Assignments Report with ID field', 2);
            createSetDefaultHome(rptPromises, createdApp, projGen.tableCommentsName, [3,
                projGen.getCommentFid('content'),
                projGen.getCommentFid('date'),
                projGen.getCommentFid('author')], 'Comment Report with ID field', 2);

            // Bluebird's promise.each function (executes each promise sequentially)
            return promise.each(rptPromises, function(queueItem) {
                // This is an iterator that executes each Promise function in the array here
                return queueItem();
            });
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
            editRelationshipRecords(editRecordPromises, createdApp, table8Name, 6, [1, 1, 2, 2, 2]);

            // Table 10 has 2 parents, set first numeric field
            editRelationshipRecords(editRecordPromises, createdApp, table10Name, 6, [1, 1, 2, 2, 2]);

            // Table 10 has 2 parents, set second numeric field
            editRelationshipRecords(editRecordPromises, createdApp, table10Name, 7, [1, 1, 2, 2, 2]);

            // Table 11
            editRelationshipRecords(editRecordPromises, createdApp, table11Name, 5, countries);

            // Table 12 has 1 parent, set first Text field displaying the states
            editRelationshipRecords(editRecordPromises, createdApp, table12Name, 5, states);

            // Table 12 , set second Text field with countries that is the relationship with parent table(Country)
            let countriesTemp = [];
            for (let i = 0; i < 10; i++) {
                //repeating first 10 countries for n(numOfStatesPerCountry) number of times for all states
                for (let j = 0; j < numOfStatesPerCountry; j++) {
                    countriesTemp.push(countries[i]);
                }
            }
            editRelationshipRecords(editRecordPromises, createdApp, table12Name, 6, countriesTemp);

            // Table 13 has 1 parent, set first Text field displaying the city
            editRelationshipRecords(editRecordPromises, createdApp, table13Name, 5, cities);

            // Table 13, set second Text field with states that is the relationship with parent table(State)
            let statesTemp = [];
            for (let i = 0; i < 10; i++) {
                //repeating first 10 states for n(numOfCitiesPerState) number of times for all cities
                for (let j = 0; j < numOfCitiesPerState; j++) {
                    statesTemp.push(states[i]);
                }
            }
            editRelationshipRecords(editRecordPromises, createdApp, table13Name, 6, statesTemp);

            // Bluebird's promise.each function (executes each promise sequentially)
            return promise.each(editRecordPromises, function(queueItem) {
                return queueItem();
            });
        }).then(function() {
            const addRelationshipPromises = [];

            // Create table relationship, Table 8 is a child of Table 7
            setupRelationship(addRelationshipPromises, createdApp, table7Name, table8Name, 7);

            // Table 10 is a child of both Table 7 and Table 9
            setupRelationship(addRelationshipPromises, createdApp, table7Name, table10Name, 7);
            setupRelationship(addRelationshipPromises, createdApp, table9Name, table10Name, 8);

            // Create table relationship, Table 13(City) is a child of Table 12(State)
            setupRelationship(addRelationshipPromises, createdApp, table12Name, table13Name, 7, 6);

            // Create table relationship, Table 12(State) is a child of Table 11(Country)
            setupRelationship(addRelationshipPromises, createdApp, table11Name, table12Name, 7, 6);

            // Create table relationship, Project is a child of Company
            setupRelationship(addRelationshipPromises, createdApp, projGen.tableCompaniesName, projGen.tableProjectsName,
                projGen.getProjectFid('companyName'), projGen.getCompanyFid('name'));

            // Create table relationship, Task is a child of Project
            setupRelationship(addRelationshipPromises, createdApp, projGen.tableProjectsName, projGen.tableTasksName,
                projGen.getTaskFid('projectName'),  projGen.getProjectFid('name'));

            // Create table relationship, People have Assignments
            setupRelationship(addRelationshipPromises, createdApp, projGen.tablePeopleName, projGen.tableAssignmentsName,
                projGen.getAssigneeFid('assigneeName'), projGen.getPeopleFid('fullname'));

            // Create table relationship, People lead Projects
            setupRelationship(addRelationshipPromises, createdApp, projGen.tablePeopleName,  projGen.tableProjectsName,
                 projGen.getProjectFid('projectLeader'), projGen.getPeopleFid('fullname'));

            // Create table relationship, People is a child of Company
            setupRelationship(addRelationshipPromises, createdApp, projGen.tableCompaniesName, projGen.tablePeopleName,
                projGen.getPeopleFid('companyName'),  projGen.getCompanyFid('name'));

            // Create table relationship, Assignments are related to Tasks
            setupRelationship(addRelationshipPromises, createdApp, projGen.tableTasksName, projGen.tableAssignmentsName,
                projGen.getAssigneeFid('taskId'), projGen.getTaskFid('taskId'));

            // Create table relationship, Comments are related Assignments
            setupRelationship(addRelationshipPromises, createdApp, projGen.tableAssignmentsName, projGen.tableCommentsName,
                projGen.getCommentFid('topicId'), projGen.getAssigneeFid('assignmentId'));

            // Bluebird's promise.each function (executes each promise sequentially)
            return promise.each(addRelationshipPromises, function(queueItem) {
                // This is an iterator that executes each Promise function in the array here
                return queueItem();
            });
        }).then(function() {
            // Print the generated test data and endpoints
            _createdRecs();
        }).catch(function(error) {
            // Global catch that will grab any errors from chain above
            if (error) {
                log.error('Error during data seed:' + seed + ' setup:  ' + error.message);
                log.error('Stacktrace: ' + error.stack);
            } else {
                log.error('Exiting on catch null seed:' + seed + ' error: ' + console.trace());
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
        var appEndpointRequest = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbase/app/' + appId);

        var appsEndpointRequest = e2eBase.getRequestAppsPageEndpoint(realmName);

        var tableNames = '';
        createdApp.tables.forEach((table, index) => {
            tableNames += 'Table ' + index + ' Id: ' + table.id + '\n';
            tableNames += 'Table ' + index + ' Name: ' + table.name + '\n';
            tableNames += 'Table ' + index + ' Report link: ' + e2eBase.getRequestReportsPageEndpoint(realmName, appId, table.id, 1)  + '\n';
        });
        console.log('\nHere is your generated test data: \n' +
            'seed:' + seed + '\n' +
            'realmName: ' + realmName + '\n' +
            'realmId: ' + realmId + '\n' +
            'appName: ' +  createdApp.name + '\n' +
            'appId: ' + appId + '\n' +
            'To generate a session ticket for your realm paste this into your browser: \n' +
            ticketEndpointRequest + '\n\n' +
            'Access your new generated app here (must have generated a ticket first): \n' +
            appEndpointRequest + '\n\n' +
            'Access all apps here (must have generated a ticket first): \n' +
            appsEndpointRequest + '\n\n' +
            tableNames
        );
    }
}());
