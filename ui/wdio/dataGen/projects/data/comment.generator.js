/**
 * Generate a comment with a text, date, person
 * Created by Claire on May 4, 2017.
 */
module.exports = function(chance) {
    'use strict';
    const rawValueGenerator = require('../../../../test_generators/rawValue.generator');
    let loremHipsum = require('lorem-hipsum');

    let loremConf  = {
        count: 1,                  // Number of words, sentences, or paragraphs to generate.
        units: 'sentences',        // Generate words, sentences, or paragraphs.
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
        commentText: function(options) {
            let sentConfig = {units: 'sentences', count: chance.integer({min:1, max: 2})};
            return loremHipsum(Object.assign({}, loremConf, sentConfig, options));
        },
        comment: function(options) {
            let topicId = options && options.topicId ? options.topicId : '';
            let content = options && options.commentText ? options.commentText : chance.commentText(options);
            let date = options && options.date ? options.date : rawValueGenerator.generateDateTime();
            let author = options && options.authors ? chance.pickone(options.authors) : '';

            return {
                topicId,
                content,
                date,
                author,
            };
        }
    });


    const fidToProp = {
        6 : 'topicId',
        7 : 'content',
        8 : 'date',
        9 : 'author',
    };

    const propToFid = {
        'topicId' : 6,
        'content' : 7,
        'date' : 8,
        'author' : 9,
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
            //Comment
            tableToFieldToFieldTypeMap[tableProjectsName] = {};
            addColumn(tableToFieldToFieldTypeMap[tableProjectsName], e2eConsts.dataType.TEXT, 'Topic Id');
            addColumn(tableToFieldToFieldTypeMap[tableProjectsName], e2eConsts.dataType.TEXT, 'Content', multiLineProps);
            addColumn(tableToFieldToFieldTypeMap[tableProjectsName], e2eConsts.dataType.DATE_TIME, 'Date');
            addColumn(tableToFieldToFieldTypeMap[tableProjectsName], e2eConsts.dataType.TEXT, 'Author');
        }
    };
    return api;
};
