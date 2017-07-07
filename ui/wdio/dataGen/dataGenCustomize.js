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
console.time('dataGen');

// if you set realmToUse null it will randomly generated a new realm name
// change this to a string i.e. "myRealm" of an existing realm to use
var realmToUse = 'simple';

// Get the node config set by your NODE_ENV var
var config = require('../../server/src/config/environment');
if (realmToUse) {
    config.realmToUse = realmToUse;
}


// Chance library
// gen a repeatable seed for random values, so any random generated info can be reproduced
var Chance = require('chance');
let seed = new Chance().integer({min: 1, max: 1000000000});

let chance = new Chance(seed);

// Require the e2e base and constants modules
e2eBase = require('../common/e2eBase.js')(config);
e2eConsts = require('../common/e2eConsts');
consts = require('../../common/src/constants.js');
const projGen = require('./projects/projectsGen.js')(chance);
const projRecs = require('./projects/projectsRecs')(e2eBase, chance);
projRecs.init(projGen);


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
    var table5ReqName = 'All Required';
    var table6DurName = 'Durations';
    var table7UniqName = 'Unique Fields';
    var table8Par1Name = 'Parent Table 1';
    var table9Ch1Name = 'Child Table 1';
    var table10Par2Name = 'Parent Table 2';
    var table11Ch2Name = 'Child Table 2';
    var table12CntryName = 'Country';
    var table13StateName = 'State';
    var table14CityName = 'City';

    const allTables = [
        table1Name,
        table2Name,
        table3Name,
        table4Name,
        table5ReqName,
        table6DurName,
        table7UniqName,

        table8Par1Name,
        table9Ch1Name,
        table10Par2Name,
        table11Ch2Name,

        table12CntryName,
        table13StateName,
        table14CityName,

        projGen.tableCompaniesName,
        projGen.tableProjectsName,
        projGen.tableTasksName,
        projGen.tablePeopleName,
        projGen.tableAssignmentsName,
        projGen.tableCommentsName
    ];
    const companiesTables = [
        projGen.tableCompaniesName,
        projGen.tableProjectsName,
        projGen.tableTasksName,
        projGen.tablePeopleName,
        projGen.tableAssignmentsName,
        projGen.tableCommentsName
    ];
    const basicsOnly = [
        table1Name,
        table2Name,
        table3Name,
        table4Name,
        table5ReqName,
        table6DurName
    ];
    const fieldTypesOnly = [
        table1Name,
        table2Name,
        table3Name,
        table4Name,
        table5ReqName,
        table6DurName,
        table7UniqName
    ];
    const countryStateCityOnly = [
        table12CntryName,
        table13StateName,
        table14CityName
    ];
    const plainParentChildOnly = [
        table8Par1Name,
        table9Ch1Name,
        table10Par2Name,
        table11Ch2Name,
    ];

    // use tablesToCreate null or allTables to create all the tables
    let tablesToCreate = null;

    // uncomment ONE of these to create a just a subset,
    // tablesToCreate list limits which tables to create

    //tablesToCreate = companiesTables;
    //tablesToCreate = basicsOnly;
    //tablesToCreate = countryStateCityOnly;
    //tablesToCreate = fieldTypesOnly;
    //tablesToCreate = plainParentChildOnly;

    //or use concat to have a combination of tables in the app
    //tablesToCreate = companiesTables.concat(countryStateCityOnly);

    log.debug('dataGenCustomize seed: ' + seed);

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
        const defaultTextChoice = textChoices[2].coercedValue.value;
        const defaultValue = {
            coercedValue: Object.assign({},  textChoices[2].coercedValue),
            displayValue: defaultTextChoice
        };
        // Temporarily add a placeholder blank (not chosen) selection to top of list
        textChoices.unshift(emptyChoice);
        addColumn(tableToFieldToFieldTypeMap[table2Name], e2eConsts.dataType.TEXT, "Text MultiChoice",
            {
                dataAttr: {htmlAllowed: true, clientSideAttributes: Object.assign({}, baseTextClientRequiredProps)},
                multipleChoice: {
                    choices: textChoices,
                    allowNew: false,
                    sortAsGiven: false
                },
                defaultValue : defaultValue
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

        tableToFieldToFieldTypeMap[table5ReqName] = {};
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.TEXT, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.TEXT, "Text MultiChoice",
            {
                required: true,
                dataAttr: {htmlAllowed: true, clientSideAttributes: Object.assign({}, baseTextClientRequiredProps)},
                multipleChoice: {
                    choices: _.clone(textChoices),
                    allowNew: true,
                    sortAsGiven: true
                }
            });
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.TEXT, "MultiLine",
            {
                required: true,
                dataAttr: {clientSideAttributes: Object.assign({}, baseTextClientRequiredProps, {num_lines: 5})}
            });
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.NUMERIC, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.NUMERIC, "Numeric MultiChoice",
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
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.CURRENCY, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.PERCENT, null, {required: false});
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.RATING, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.DATE, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.DATE_TIME, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.TIME_OF_DAY, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.DURATION, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.CHECKBOX, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.PHONE_NUMBER, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.EMAIL_ADDRESS, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.URL, null, {required: true});
        addColumn(tableToFieldToFieldTypeMap[table5ReqName], e2eConsts.dataType.PHONE_NUMBER, "Phone Number without Ext", {
            required: true,
            dataAttr: {clientSideAttributes: baseTextClientRequiredProps, includeExtension: false}
        });

        // Table 6 //

        tableToFieldToFieldTypeMap[table6DurName] = {};
        let baseDurationProps = {
            dataAttr: {
                clientSideAttributes: baseNumClientRequiredProps,
                type: 'DURATION'
            }
        };
        addColumn(tableToFieldToFieldTypeMap[table6DurName], e2eConsts.dataType.DURATION, 'Duration default');
        addColumn(tableToFieldToFieldTypeMap[table6DurName], e2eConsts.dataType.DURATION, 'Duration A',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.WEEKS
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6DurName], e2eConsts.dataType.DURATION, 'Duration B',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.DAYS
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6DurName], e2eConsts.dataType.DURATION, 'Duration C',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.HOURS
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6DurName], e2eConsts.dataType.DURATION, 'Duration D',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.MINUTES
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6DurName], e2eConsts.dataType.DURATION, 'Duration E',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.SECONDS
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6DurName], e2eConsts.dataType.DURATION, 'Duration :HH:MM',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.HHMM
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6DurName], e2eConsts.dataType.DURATION, 'Duration :HH:MM:SS',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.HHMMSS
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6DurName], e2eConsts.dataType.DURATION, 'Duration :MM',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.MM
                }
            }));
        addColumn(tableToFieldToFieldTypeMap[table6DurName], e2eConsts.dataType.DURATION, 'Duration :MM:SS',
            Object.assign({}, baseDurationProps, {
                dataAttr: {
                    scale: consts.DURATION_CONSTS.SCALES.MMSS
                }
            }));

        // Table 7 //

        tableToFieldToFieldTypeMap[table7UniqName] = {};
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.TEXT, 'Unique Text', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.TEXT, 'Unique Text MultiChoice',
            {
                unique: true,
                dataAttr: {htmlAllowed: true, clientSideAttributes: Object.assign({}, baseTextClientRequiredProps)},
                multipleChoice: {
                    choices: _.clone(textChoices),
                    allowNew: true,
                    sortAsGiven: true
                }
            });
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.TEXT, 'Unique MultiLine',
            {
                unique: true,
                dataAttr: {clientSideAttributes: Object.assign({}, baseTextClientRequiredProps, {num_lines: 5})}
            });
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.NUMERIC, 'Unique Numeric', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.NUMERIC, 'Unique Numeric MultiChoice',
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
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.CURRENCY, 'Unique Currency', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.PERCENT, 'Unique Percent', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.RATING, 'Unique Rating', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.DATE, 'Unique Date', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.DATE_TIME, 'Unique Date Time', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.TIME_OF_DAY, 'Unique Time', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.DURATION, 'Unique Duration', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.PHONE_NUMBER, 'Unique Phone', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.EMAIL_ADDRESS, 'Unique Email', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table7UniqName], e2eConsts.dataType.URL, 'Unique URL', {unique: true});

        // Table 8 //

        // Parent table 1 is a parent to child table1 and child table2
        tableToFieldToFieldTypeMap[table8Par1Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table8Par1Name], e2eConsts.dataType.TEXT, 'Text Field', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table8Par1Name], e2eConsts.dataType.NUMERIC, 'Numeric Field', {unique: false});
        // Child table 1 is a child of Parent table 1
        tableToFieldToFieldTypeMap[table9Ch1Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table9Ch1Name], e2eConsts.dataType.TEXT, 'Text Field', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table9Ch1Name], e2eConsts.dataType.NUMERIC, 'Numeric Parent1 ID', {unique: false});
        // Parent table 2 is a parent to Child table 2
        tableToFieldToFieldTypeMap[table10Par2Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table10Par2Name], e2eConsts.dataType.TEXT, 'Text Field', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table10Par2Name], e2eConsts.dataType.NUMERIC, 'Numeric Field', {unique: false});
        // Child table 2 is a child of Parent table 1 and Parent table 2
        tableToFieldToFieldTypeMap[table11Ch2Name] = {};
        addColumn(tableToFieldToFieldTypeMap[table11Ch2Name], e2eConsts.dataType.TEXT, 'Text Field', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table11Ch2Name], e2eConsts.dataType.NUMERIC, 'Numeric Parent1 ID', {unique: false});
        addColumn(tableToFieldToFieldTypeMap[table11Ch2Name], e2eConsts.dataType.NUMERIC, 'Numeric Parent2 ID', {unique: false});
        //Country table is parent to State table
        tableToFieldToFieldTypeMap[table12CntryName] = {};
        addColumn(tableToFieldToFieldTypeMap[table12CntryName], e2eConsts.dataType.TEXT, 'Country', {unique: true});
        // State Table Table
        tableToFieldToFieldTypeMap[table13StateName] = {};
        addColumn(tableToFieldToFieldTypeMap[table13StateName], e2eConsts.dataType.TEXT, 'State', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table13StateName], e2eConsts.dataType.TEXT, 'Country', {unique: false});
        // City Table
        tableToFieldToFieldTypeMap[table14CityName] = {};
        addColumn(tableToFieldToFieldTypeMap[table14CityName], e2eConsts.dataType.TEXT, 'City', {unique: true});
        addColumn(tableToFieldToFieldTypeMap[table14CityName], e2eConsts.dataType.TEXT, 'State', {unique: false});

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

    function setupRelationship(promises, app, parentTableName, childTableName, childFieldId, masterFieldId, description) {
        let parentTable = getTable(app, parentTableName);
        let childTable = getTable(app, childTableName);
        if (parentTable && childTable) {
            promises.push(function() {
                return e2eBase.relationshipService.createOneToOneRelationship(
                    app, parentTable, childTable, childFieldId, masterFieldId, description);
            });
        }
    }

    function logTableFields(table, idx) {
        let fields = '';
        table.fields.forEach((field, fIndex) => {
            if (idx === 0 || fIndex > 4) {
                let smallSet = _.pick(field, ['id', 'name', 'datatypeAttributes.type']);
                fields += `\t${fIndex}) ${JSON.stringify(smallSet)}\n`;
            }
        });
        console.log(`Table index:${idx}) appId:${createdApp.id} appName:${createdApp.name} tableId:${table.id} tableName:${table.name} fields: \n${fields}`);

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
        //use the envvar appName if there is one otherwise generate a single word capitalized appname
        let appName = _.get(config, 'appName', chance.capitalize(chance.word()));
        let tablesMap = makeAppMap();
        if (tablesToCreate) {
            // only create the tables in tablesToCreate if specified
            //otherwise creates them all
            tablesMap = _.pick(tablesMap, tablesToCreate);
        }

        e2eBase.appService.createNamedAppSchema(tablesMap, appName)
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
                logTableFields(table, index);
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
            const recordsConfig = {numRecordsToCreate: e2eConsts.DEFAULT_NUM_RECORDS_TO_CREATE, tablesConfig: {}};
            const configNumParams = {
                app: createdApp,
                recordsConfig,
            };
            // Change # of records for some of the tables
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table3Name, numRecords:45}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table4Name, numRecords:100}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table6DurName, numRecords:3}));

            //TODO: Table 7 contains records with all unique fields so don't generate any records (currently broken)
            //TODO: Enhance record data generation to handle unique and all required fields
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table7UniqName, numRecords:0}));

            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table8Par1Name, numRecords:5}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table9Ch1Name, numRecords:6}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table10Par2Name, numRecords:6}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table11Ch2Name, numRecords:6}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table12CntryName, numRecords:31}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table13StateName, numRecords:31}));
            configNumRecordsToCreate(Object.assign({}, configNumParams, {tableName: table14CityName, numRecords:31}));

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

            // set the range of number of entities to generate for project tables
            let minMaxToGen = projGen.minMaxToGen;

            //for each level create records for company & proj etc tables
            // one to many ->>
            //Company ->> Projects ->> Tasks ->> Assignment ->> Comments
            //            Projects <<- Manager
            // Company ->> Person  ->> Assignments
            // male the list of companies, for each company create a company record

            const companyTable = getTable(createdApp, projGen.tableCompaniesName);
            if (companyTable) {
                projGen.initCompanies();
                let numCompaniesToCreate = chance.integer({min: minMaxToGen.minCompany, max: minMaxToGen.maxCompany});
                const companies = projGen.genCompanies({}, numCompaniesToCreate);
                let companyRecords = projRecs.makeRecordsInput(createdApp, projGen.tableCompaniesName,
                    projGen.getCompanyPropFromFid, companies);

                companies.forEach((company, companyIndex) => {
                    //write out the company record
                    projPromises.push(function() {
                        return projRecs.addBulkRecords(createdApp, projGen.tableCompaniesName,
                            getTable(createdApp, projGen.tableCompaniesName), [companyRecords[companyIndex]]);
                    });

                    const peopleTable = getTable(createdApp, projGen.tablePeopleName);
                    if (peopleTable) {
                        //create the employees for the company
                        let peopleSets = projRecs.genAndSetupEmployeeRecords(company, createdApp, minMaxToGen, projPromises);

                        //create the projects (tasks, assignments, comments) for the company
                        const projTable = getTable(createdApp, projGen.tableProjectsName);
                        if (projTable) {
                            projRecs.getAndSetupProjectRecords(company, peopleSets, createdApp, minMaxToGen, projPromises);
                        }
                    }
                });

                // Bluebird's promise.each function (executes each promise sequentially)
                return promise.each(projPromises, function(queueItem) {
                    return queueItem();
                });
            } else {
                return promise.resolve();
            }
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
            createSetDefaultHome(rptPromises, createdApp, table8Par1Name, [3, 6, 7], 'Report with ID field', 2);
            createSetDefaultHome(rptPromises, createdApp, table9Ch1Name, [3, 6, 7], 'Report with ID field', 2);
            createSetDefaultHome(rptPromises, createdApp, table12CntryName, [3, 6],   'Report with ID field', 2);
            createSetDefaultHome(rptPromises, createdApp, table13StateName, [3, 6, 7], 'Report with ID field', 2);
            createSetDefaultHome(rptPromises, createdApp, table14CityName, [3, 6, 7], 'Report with ID field', 2);

            createSetDefaultHome(rptPromises, createdApp, projGen.tableCompaniesName, [
                3,
                projGen.getCompanyFid('name'),
                projGen.getCompanyFid('rank'),
                projGen.getCompanyFid('email'),
                projGen.getCompanyFid('url'),
                projGen.getCompanyFid('phone')], 'Report with ID field', 2);

            createSetDefaultHome(rptPromises, createdApp, projGen.tableProjectsName, [
                3,
                projGen.getProjectFid('name'),
                projGen.getProjectFid('department'),
                projGen.getProjectFid('startDate'),
                projGen.getProjectFid('budget'),
                projGen.getProjectFid('projectLeader'),
                projGen.getProjectFid('companyName')], 'Report with ID field', 2);

            createSetDefaultHome(rptPromises, createdApp, projGen.tableTasksName, [
                3,
                projGen.getTaskFid('name'),
                projGen.getTaskFid('projectName'),
                projGen.getTaskFid('status')], 'Task Report with ID field', 2);

            createSetDefaultHomeExtended(rptPromises, createdApp, projGen.tablePeopleName, {
                fids:[3,
                    projGen.getPeopleFid('fullName'),
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
                    //projGen.getPeopleFid('manager') // don't include as there is new bug in reuse facets when too many
                ],
                sortFids: [
                    projGen.getPeopleFid('companyName'),
                    projGen.getPeopleFid('department'),
                    projGen.getPeopleFid('title')
                ],
                reportName:'Employee Report with ID field'}, 2);


            createSetDefaultHome(rptPromises, createdApp, projGen.tableAssignmentsName, [
                3,
                projGen.getAssigneeFid('taskName'),
                projGen.getAssigneeFid('taskId'),
                projGen.getAssigneeFid('assigneeName'),
                projGen.getAssigneeFid('assignmentId'),
                projGen.getAssigneeFid('department'),
                projGen.getAssigneeFid('projectName'),
                projGen.getAssigneeFid('companyName'),
            ], 'Assignments Report with ID field', 2);

            createSetDefaultHome(rptPromises, createdApp, projGen.tableCommentsName, [
                3,
                projGen.getCommentFid('content'),
                projGen.getCommentFid('date'),
                projGen.getCommentFid('author'),
                projGen.getCommentFid('topicId')
            ], 'Comment Report with ID field', 2);

            // Bluebird's promise.each function (executes each promise sequentially)
            return promise.each(rptPromises, function(queueItem) {
                // This is an iterator that executes each Promise function in the array here
                return queueItem();
            });
        }).then(function() {
            // Forms Setup //

            // Create a default form for each table (uses the app JSON)
            let allFormPromises =  e2eBase.formService.createDefaultForms(createdApp);
            return promise.each(allFormPromises, function(queueItem) {
                return queueItem;
            });
        }).then(function() {
            //// Relationships Setup //

            //TODO: Finish this
            const editRecordPromises = [];
            // Numeric key entry for the relationship's child table corresponds to a parent's recordId.
            // These need to be integers in the range of 1~n, n being the number of parent records
            // We also want these to be consistent, as opposed to randomly generated numbers, for
            // testing purposes.
            editRelationshipRecords(editRecordPromises, createdApp, table9Ch1Name, 6, [1, 1, 2, 2, 2]);

            // Child table 2 has 2 parents, set first numeric field
            editRelationshipRecords(editRecordPromises, createdApp, table11Ch2Name, 6, [1, 1, 2, 2, 2]);

            // Child table 2  has 2 parents, set second numeric field
            editRelationshipRecords(editRecordPromises, createdApp, table11Ch2Name, 7, [1, 1, 2, 2, 2]);

            // Table 12
            editRelationshipRecords(editRecordPromises, createdApp, table12CntryName, 5, countries);

            // Table 13 has 1 parent, set first Text field displaying the states
            editRelationshipRecords(editRecordPromises, createdApp, table13StateName, 5, states);

            // Table 13 , set second Text field with countries that is the relationship with parent table(Country)
            let countriesTemp = [];
            for (let i = 0; i < 10; i++) {
                //repeating first 10 countries for n(numOfStatesPerCountry) number of times for all states
                for (let j = 0; j < numOfStatesPerCountry; j++) {
                    countriesTemp.push(countries[i]);
                }
            }
            editRelationshipRecords(editRecordPromises, createdApp, table13StateName, 6, countriesTemp);

            // Table 14 has 1 parent, set first Text field displaying the city
            editRelationshipRecords(editRecordPromises, createdApp, table14CityName, 5, cities);

            // Table 14, set second Text field with states that is the relationship with parent table(State)
            let statesTemp = [];
            for (let i = 0; i < 10; i++) {
                //repeating first 10 states for n(numOfCitiesPerState) number of times for all cities
                for (let j = 0; j < numOfCitiesPerState; j++) {
                    statesTemp.push(states[i]);
                }
            }
            editRelationshipRecords(editRecordPromises, createdApp, table14CityName, 6, statesTemp);

            // Bluebird's promise.each function (executes each promise sequentially)
            return promise.each(editRecordPromises, function(queueItem) {
                return queueItem();
            });
        }).then(function() {
            const addRelationshipPromises = [];

            // Create table relationship, Table 9 is a child of Table 8
            setupRelationship(addRelationshipPromises, createdApp, table8Par1Name, table9Ch1Name, 7);

            // Table 11 is a child of both Table 8 and Table 10
            setupRelationship(addRelationshipPromises, createdApp, table8Par1Name, table11Ch2Name, 7);
            setupRelationship(addRelationshipPromises, createdApp, table10Par2Name, table11Ch2Name, 8);

            // Create table relationship, Table 14(City) is a child of Table 13(State)
            setupRelationship(addRelationshipPromises, createdApp, table13StateName, table14CityName, 7, 6, "State parent to City");

            // Create table relationship, Table 13(State) is a child of Table 12(Country)
            setupRelationship(addRelationshipPromises, createdApp, table12CntryName, table13StateName, 7, 6, "Country parent to State");

            // Create table relationship, Companies(parent) have many Projects(child)
            setupRelationship(addRelationshipPromises, createdApp, projGen.tableCompaniesName, projGen.tableProjectsName,
        projGen.getProjectFid('companyName'), projGen.getCompanyFid('name'), "Company parent to Project");

            // Create table relationship, Company(Parent) has many People(child)
            setupRelationship(addRelationshipPromises, createdApp, projGen.tableCompaniesName, projGen.tablePeopleName,
        projGen.getPeopleFid('companyName'),  projGen.getCompanyFid('name'), "Company parent to Project");


            // Create table relationship, Projects(Parent) have many Tasks(child)
            setupRelationship(addRelationshipPromises, createdApp, projGen.tableProjectsName, projGen.tableTasksName,
        projGen.getTaskFid('projectName'),  projGen.getProjectFid('name'), "Project parent to Task");

            // Create table relationship, Tasks(Parent) have many Assignments(child)
            setupRelationship(addRelationshipPromises, createdApp, projGen.tableTasksName, projGen.tableAssignmentsName,
        projGen.getAssigneeFid('taskId'), projGen.getTaskFid('taskId'), "Task parent to Assignment");

            // Create table relationship, Assignments(Parent) have many Comments(child)
            setupRelationship(addRelationshipPromises, createdApp, projGen.tableAssignmentsName, projGen.tableCommentsName,
        projGen.getCommentFid('topicId'), projGen.getAssigneeFid('assignmentId'), "Assignment parent to Comment");


            // Create table relationship, People(Parent) have many Assignments(child)
            setupRelationship(addRelationshipPromises, createdApp, projGen.tablePeopleName, projGen.tableAssignmentsName,
        projGen.getAssigneeFid('assigneeName'), projGen.getPeopleFid('fullName'), "Project Mgr parent to Assignment");

            // Create table relationship, People Managers(Parent) lead many People(child)
            setupRelationship(addRelationshipPromises, createdApp, projGen.tablePeopleName, projGen.tablePeopleName,
        projGen.getPeopleFid('manager'), projGen.getPeopleFid('fullName'), "Employee (Managers) parent to Employee(subordinates)");

            // Bluebird's promise.each function (executes each promise sequentially)
            return promise.each(addRelationshipPromises, function(queueItem) {
                // This is an iterator that executes each Promise function in the array here
                return queueItem();
            });
        }).then(function() {
            return retrieveSavedRelationships();
        }).then(function(savedRelationships) {
            return addChildReportsToTableForms(savedRelationships);
        }).then(function() {
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
     * Retrieves the relationships created for the sample app.
     */
    function retrieveSavedRelationships() {
        let appId = createdApp.id;
        let relationshipEndpoint = e2eBase.recordBase.apiBase.resolveRelationshipsEndpoint(appId);
        return new Promise((resolve, reject) => {
            e2eBase.recordBase.apiBase.executeRequest(relationshipEndpoint, consts.GET).then(function(result) {
                resolve(JSON.parse(result.body));
            }).catch(function(error) {
                log.debug(JSON.stringify(error));
                reject(error);
            });
        });
    }

    /**
     * Adds sections containing child report elements to a tab in the form associated with all tables
     * in the app
     * @param savedRelationships
     */
    function addChildReportsToTableForms(savedRelationships) {
        let appId = createdApp.id;
        let addChildReportElements = [];

        createdApp.tables.forEach((table) => {
            addChildReportElements.push(function() {
                return new Promise((resolve, reject) => {
                    const tableId = table.id;
                    let formsEndpoint = e2eBase.recordBase.apiBase.resolveFormsEndpoint(appId, tableId, 1);
                    let putFormsEndpoint = e2eBase.recordBase.apiBase.resolveFormsEndpoint(appId, tableId);

                    e2eBase.recordBase.apiBase.executeRequest(formsEndpoint, consts.GET).then(function(formsResult) {
                        var form = JSON.parse(formsResult.body);
                        if (savedRelationships) {
                            savedRelationships.forEach((relationship) => {
                                if (relationship.masterTableId === tableId) {
                                    const sections = form.tabs[0].sections;
                                    const length = Object.keys(sections).length;
                                    const childReportElement = {"ChildReportElement" : {relationshipId: relationship.id}};
                                    sections[length] = Object.assign(_.cloneDeep(sections[0]), {
                                        elements: {0: childReportElement},
                                        fields: [],
                                        orderIndex: length
                                    });
                                    const childTableName = _.find(createdApp.tables, {id:relationship.detailTableId}).name;
                                    sections[length].headerElement.FormHeaderElement.displayText = childTableName;
                                }
                            });
                        }
                        return form;
                    }).then(function(updatedForm) {
                        return e2eBase.recordBase.apiBase.executeRequest(putFormsEndpoint, consts.PUT, updatedForm);
                    }).then(function(response) {
                        resolve(response);
                    }).catch(function(error) {
                        reject(error);
                    });
                });
            });
        });
        // Bluebird's promise.each function (executes each promise sequentially)
        return promise.each(addChildReportElements, function(queueItem) {
            // This is an iterator that executes each Promise function in the array here
            return queueItem();
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
        console.timeEnd('dataGen');
    }
}());
