/**
 * Generate a project with a random name, url, phone
 * Created by Claire on April 25, 2017.
 */
module.exports = function(chance) {
    'use strict';
    const DEFAULT_NUM_PROJECTS = 10;
    const MIN_OVERVIEW_PARAS =  2;
    const MAX_OVERVIEW_PARAS =  5;
    const MIN_NAME_WORDS = 2;
    const MAX_NAME_WORDS = 5;
    const START_YEAR_RANGE = {min:2016, max:2018};
    const MAX_BUDGET = 50000;
    const MIN_BUDGET = 1000;
    const rawValueGenerator = require('../../../../test_generators/rawValue.generator');

    let loremHipsum = require('lorem-hipsum');

    let loremConf  = {
        count: 1,                  // Number of words, sentences, or paragraphs to generate.
        units: 'words',            // Generate words, sentences, or paragraphs.
        sentenceLowerBound: 5,     // Minimum words per sentence.
        sentenceUpperBound: 8,    // Maximum words per sentence.
        paragraphLowerBound: 3,    // Minimum sentences per paragraph.
        paragraphUpperBound: 7,    // Maximum sentences per paragraph.
        format: 'plain',           // Plain text or html
        random: () => {            // A PRNG function. was Math.random by default
            return chance.floating({min:0, max:1, fixed: 12});
        },
    };

    chance.mixin({
        overview: function(options) {
            let paraConfig = {units: 'paragraph', count: chance.integer({min:MIN_OVERVIEW_PARAS, max: MAX_OVERVIEW_PARAS})};
            return loremHipsum(Object.assign({}, loremConf, paraConfig, options));
        },
        projectName:function(options) {
            let answer = loremHipsum(Object.assign({}, loremConf, {count: chance.integer({min:MIN_NAME_WORDS, max: MAX_NAME_WORDS})}));
            answer = chance.capitalize(answer);
            return answer;
        },
        projectDepartment : function(options) {
            if (options.availableDepts) {
                return chance.pickone(options.availableDepts);
            } else {
                return chance.department();
            }
        },
        project: function(options) {
            let name = options && options.name ? options.name : chance.projectName(options);
            let overview = options && options.overview ? options.overview : chance.overview(options);
            let startDate = options && options.date ? options.date : rawValueGenerator.generateDate(Object.assign({year: chance.integer(START_YEAR_RANGE)}, options));
            let budget = options && options.budget ? options.budget : chance.floating(Object.assign({max: MAX_BUDGET, min:MIN_BUDGET, fixed: 2}, options));
            let department = options && options.department ? options.department : chance.projectDepartment(options);
            let companyName = options && options.companyName ? options.companyName : '';
            let projectLeader = options && options.projectLeader ? options.projectLeader : '';

            return {
                name,
                overview,
                department,
                startDate,
                budget,
                projectLeader,
                companyName,
            };
        }
    });


    const fidToProp = {
        6 : 'name',
        7 : 'overview',
        8 : 'department',
        9 : 'startDate',
        10 : 'budget',
        11 : 'projectLeader',
        12 : 'companyName',
    };

    const propToFid = {
        'name' : 6,
        'overview' : 7,
        'department' : 8,
        'startDate' : 9,
        'budget' : 10,
        'projectLeader' : 11,
        'companyName' : 12,
    };

    let api = {
        init : () => {},

        getPropFromFid : function(fid) {
            return fidToProp[fid];
        },
        getFidFromProp : function(prop) {
            return propToFid[prop];
        },

        addSchemaFields: function(tableToFieldToFieldTypeMap, tableProjectsName, addColumn, multiLineProps) {
            //Project
            tableToFieldToFieldTypeMap[tableProjectsName] = {};
            addColumn(tableToFieldToFieldTypeMap[tableProjectsName], e2eConsts.dataType.TEXT, 'Name', {unique: true});
            addColumn(tableToFieldToFieldTypeMap[tableProjectsName], e2eConsts.dataType.TEXT, 'Overview', multiLineProps);
            addColumn(tableToFieldToFieldTypeMap[tableProjectsName], e2eConsts.dataType.TEXT, 'Department');
            addColumn(tableToFieldToFieldTypeMap[tableProjectsName], e2eConsts.dataType.DATE, 'Start Date');
            addColumn(tableToFieldToFieldTypeMap[tableProjectsName], e2eConsts.dataType.CURRENCY, 'Budget');
            addColumn(tableToFieldToFieldTypeMap[tableProjectsName], e2eConsts.dataType.TEXT, 'Project Lead');
            addColumn(tableToFieldToFieldTypeMap[tableProjectsName], e2eConsts.dataType.TEXT, 'Company');
        },

    };
    return api;
};
