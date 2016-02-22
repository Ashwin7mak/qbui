'use strict';

var facetRecordsFormatter = require('./../facetRecordsFormatter')();
var recordFormatter = require('./../recordFormatter')();
var assert = require('assert');
var errorCodes = require('../../../errorCodes');

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

    function facetDataProvider() {
        var textField = {
            id                  : 7,
            name                : 'text',
            datatypeAttributes: {
                type: 'TEXT'
            },
            type                : 'SCALAR'
        };
        var checkboxField = {
            id                  : 8,
            name                : 'checkbox',
            datatypeAttributes: {
                type: 'CHECKBOX'
            },
            type                : 'SCALAR'
        };
        var anotherTextField = {
            id                  : 9,
            name                : 'text',
            datatypeAttributes: {
                type: 'TEXT'
            },
            type                : 'SCALAR'
        };
        var fields = [textField, checkboxField, anotherTextField];

        var textFacetValues = [generateRandomString(3), generateRandomString(3)];
        var textFacetRecords = [];
        var expectedTextFacets = {id: 7, name:'text', type:'TEXT', values:[], hasBlanks: false};
        textFacetValues.forEach(function(value) {
            var record = [{id:7, value:value}];
            textFacetRecords.push(record);
            var formattedRecords = recordFormatter.formatRecords([record], [textField]);
            expectedTextFacets.values.push(formattedRecords[0][0].display);
        });


        var blankFacetValues = [generateRandomString(3), null];
        var blankFacetRecords = [];
        var expectedBlankFacets = {id: 7, name:'text', type:'TEXT', values:[], hasBlanks: true};
        blankFacetValues.forEach(function(value) {
            var record = [{id:7, value:value}];
            blankFacetRecords.push(record);
            var formattedRecords = recordFormatter.formatRecords([record], [textField]);
            expectedBlankFacets.values.push(formattedRecords[0][0].display);
        });

        var expectedTooManyFacets = {id: 9, name:'text', type:'TEXT', values:[], hasBlanks: false, errorMessage: errorCodes.ERROR_MSG_KEY.FACET.RECORD_TOO_BIG};
        var tooManyValuesRecord = [[{id:9, value:{
            code: errorCodes.ERROR_CODE.FACET.RECORD_TOO_BIG,
            message: errorCodes.ERROR_MSG_KEY.FACET.RECORD_TOO_BIG
        }}]];

        var cases = [
            {message:"null records and fields", facetRecords:null, fields: null, expectedFacets: []},
            {message:"null records", facetRecords:null, fields: fields, expectedFacets: []},
            {message:"null fields", facetRecords:[textFacetRecords], fields: null, expectedFacets: []},
            {message:"empty records and fields", facetRecords:[], fields: [], expectedFacets: []},
            {message:"empty records", facetRecords:[], fields: fields, expectedFacets: []},
            {message:"empty fields", facetRecords:[textFacetRecords], fields: [], expectedFacets: []},
            {message:"text facet", facetRecords:[textFacetRecords], fields: [textField], expectedFacets: [expectedTextFacets]},
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
