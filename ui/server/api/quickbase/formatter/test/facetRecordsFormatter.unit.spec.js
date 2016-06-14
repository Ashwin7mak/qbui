'use strict';

var facetRecordsFormatter = require('..//facetRecordsFormatter')();
var recordFormatter = require('../recordFormatter')();
var assert = require('assert');
var errorCodes = require('../../../errorCodes');
var constants = require('../../../../../common/src/constants');

/**
 * Unit tests for query formatter
 */
describe('Facet formatter unit test', function() {
    //Generates and returns a random string of specified length
    function generateRandomString(size) {
        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var text = '';
        for (var i = 0; i < size; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    function setUpDateFacet(id, facetDates, field) {
        var facetRecords = [];
        var facetValues = {
            value: {
                min: '',
                max: ''
            }
        };
        facetDates.forEach(function(value) {
            var record = [{id:id, value:value}];
            facetRecords.push(record);
            var formattedRecords = recordFormatter.formatRecords([record], [field]);
            if (!facetValues.value.min) {
                facetValues.value.min = formattedRecords[0][0].display;
            } else {
                facetValues.value.max = formattedRecords[0][0].display;
            }
        });
        return {
            facetValues: facetValues,
            facetRecords: facetRecords
        };
    }

    function facetDataProvider() {
        var dateTimeField = {
            id                 : 5,
            name               : 'dateTime',
            datatypeAttributes : {
                type: constants.DATE_TIME
            },
            type               : constants.SCALAR
        };
        var dateField = {
            id                 : 6,
            name               : 'date',
            datatypeAttributes : {
                type: constants.DATE
            },
            type               : constants.SCALAR
        };
        var textField = {
            id                  : 7,
            name                : 'text',
            datatypeAttributes: {
                type: constants.TEXT
            },
            type                : constants.SCALAR
        };
        var checkboxField = {
            id                  : 8,
            name                : 'checkbox',
            datatypeAttributes: {
                type: constants.CHECKBOX
            },
            type                : constants.SCALAR
        };
        var anotherTextField = {
            id                  : 9,
            name                : 'text',
            datatypeAttributes: {
                type: constants.TEXT
            },
            type                : constants.SCALAR
        };
        var userField = {
            id                  : 10,
            name                : 'user',
            datatypeAttributes: {
                type: constants.USER
            },
            type                : constants.SCALAR
        };
        var fields = [dateField, dateTimeField, textField, checkboxField, anotherTextField, userField];

        // setup dateTime test
        var expectedDateTimeFacets = {id: 5, name:'dateTime', type:constants.DATE_TIME, values:[], hasBlanks: false};
        var dateTimeFacet = setUpDateFacet(5, ['05/01/2016 10:49 AM', '06/01/2016 08:28 AM'], dateTimeField);
        expectedDateTimeFacets.values.push(dateTimeFacet.facetValues);

        // setup date test
        var expectedDateFacets = {id: 6, name:'date', type:constants.DATE, values:[], hasBlanks: false};
        var dateFacet = setUpDateFacet(6, ['05/01/2016', '06/01/2016'], dateField);
        expectedDateFacets.values.push(dateFacet.facetValues);

        // setup user test
        var userFacetValues = [
            {firstName: 'First1',
             lastName: 'Last1',
             userId: 1}
        ];
        var userFacetRecords = [];
        var expectedUserFacets = {id: 10, name:'user', type:constants.USER, values:[], hasBlanks: false};

        var facetUserValues = {
            value: {
                string: '',
                userId: ''
            }
        };
        userFacetValues.forEach(function(value) {
            var record = [{id:10, value: {
                firstName: value.firstName,
                lastName: value.lastName,
                userId: value.userId
            }}];
            userFacetRecords.push(record);
            var formattedRecords = recordFormatter.formatRecords([record], [userField]);
            facetUserValues.value.string = formattedRecords[0][0].display;
            facetUserValues.value.userId = formattedRecords[0][0].value.userId;
            expectedUserFacets.values.push(facetUserValues);
        });

        //  setup text test
        var textFacetValues = [generateRandomString(3), generateRandomString(3)];
        var textFacetRecords = [];
        var expectedTextFacets = {id: 7, name:'text', type:constants.TEXT, values:[], hasBlanks: false};
        textFacetValues.forEach(function(value) {
            var record = [{id:7, value:value}];
            textFacetRecords.push(record);
            var formattedRecords = recordFormatter.formatRecords([record], [textField]);
            var data = {
                value: formattedRecords[0][0].display
            };
            expectedTextFacets.values.push(data);
        });

        //  set blank text test
        var blankFacetValues = [generateRandomString(3), null];
        var blankFacetRecords = [];
        var expectedBlankFacets = {id: 7, name:'text', type:constants.TEXT, values:[], hasBlanks: true};
        blankFacetValues.forEach(function(value) {
            var record = [{id:7, value:value}];
            blankFacetRecords.push(record);
            var formattedRecords = recordFormatter.formatRecords([record], [textField]);
            var data = {
                value: formattedRecords[0][0].display
            };
            expectedBlankFacets.values.push(data);
        });

        var expectedTooManyFacets = {id: 9, name:'text', type:constants.TEXT, errorCode: 99};
        var tooManyValuesRecord = [[{id:9, name:'text', type:constants.TEXT, value:{
            code: 99
        }}]];

        var cases = [
            {message:"null records and fields", facetRecords:null, fields: null, expectedFacets: []},
            {message:"null records", facetRecords:null, fields: fields, expectedFacets: []},
            {message:"null fields", facetRecords:[textFacetRecords], fields: null, expectedFacets: []},
            {message:"empty records and fields", facetRecords:[], fields: [], expectedFacets: []},
            {message:"empty records", facetRecords:[], fields: fields, expectedFacets: []},
            {message:"empty fields", facetRecords:[textFacetRecords], fields: [], expectedFacets: []},
            {message:"text facet", facetRecords:[textFacetRecords], fields: [textField], expectedFacets: [expectedTextFacets]},
            {message:"date facet", facetRecords:[dateFacet.facetRecords], fields: [dateField], expectedFacets: [expectedDateFacets]},
            {message:"dateTime facet", facetRecords:[dateTimeFacet.facetRecords], fields: [dateTimeField], expectedFacets: [expectedDateTimeFacets]},
            {message:"user facet", facetRecords:[userFacetRecords], fields: [userField], expectedFacets: [expectedUserFacets]},
            {message:"blank field value", facetRecords:[blankFacetRecords], fields: [textField], expectedFacets: [expectedBlankFacets]},
            {message:"too many distinct values", facetRecords:[tooManyValuesRecord], fields: [anotherTextField], expectedFacets: [expectedTooManyFacets]},
            {message:"one of the facets with too many distinct values", facetRecords:[textFacetRecords, tooManyValuesRecord], fields: [textField, anotherTextField], expectedFacets: [expectedTextFacets, expectedTooManyFacets]}
        ];

        return cases;
    }

    describe('should format given list of list of records into a valid facet structure', function() {
        facetDataProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var facets = facetRecordsFormatter.formatFacetRecords(entry.facetRecords, entry.fields);
                assert.deepEqual(facets, entry.expectedFacets, entry.message);
                done();
            });
        });
    });
});
