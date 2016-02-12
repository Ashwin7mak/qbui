'use strict';

var facetRecordsFormatter = require('./../facetRecordsFormatter')();
var recordFormatter = require('./../recordFormatter')();
var assert = require('assert');

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
        var fields = [textField, checkboxField];

        var textFacetValues = [generateRandomString(3), generateRandomString(3)];
        var textFacetRecords = [];
        var expectedTextFacets = {id: 7, name:'text', type:'TEXT', values:[], hasBlanks: false};
        textFacetValues.forEach(function(value){
            var record = [{id:7, value:value}];
            textFacetRecords.push(record);
            var formattedRecords = recordFormatter.formatRecords([record], [textField]);
            expectedTextFacets.values.push(formattedRecords[0][0].display);
        });


        var blankFacetValues = [generateRandomString(3), null];
        var blankFacetRecords = [];
        var expectedBlankFacets = {id: 7, name:'text', type:'TEXT', values:[], hasBlanks: true};
        blankFacetValues.forEach(function(value){
            var record = [{id:7, value:value}];
            blankFacetRecords.push(record);
            var formattedRecords = recordFormatter.formatRecords([record], [textField]);
            expectedBlankFacets.values.push(formattedRecords[0][0].display);
        });

        var facetRecords = [textFacetRecords];
        var expectedFacets = [expectedTextFacets];
        var cases = [
            {message:"null records and fields", facetRecords:null, fields: null, expectedFacets: null},
            {message:"null records", facetRecords:null, fields: fields, expectedFacets: null},
            {message:"null fields", facetRecords:facetRecords, fields: null, expectedFacets: facetRecords},
            {message:"empty records and fields", facetRecords:[], fields: [], expectedFacets: []},
            {message:"empty records", facetRecords:[], fields: fields, expectedFacets: []},
            {message:"empty fields", facetRecords:facetRecords, fields: [], expectedFacets: facetRecords},
            {message:"text facet", facetRecords:[textFacetRecords], fields: [textField], expectedFacets: [expectedTextFacets]},
            {message:"blank field value", facetRecords:[blankFacetRecords], fields: [textField], expectedFacets: [expectedBlankFacets]}
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
