'use strict';

var queryFormatter = require('./../queryFormatter');
var consts = require('../../../constants');
var assert = require('assert');

/**
 * Unit tests for query formatter
 */
describe('Query formatter unit test', function() {
    function queryDataProvider() {
        var cases = [
            {message:"null facet expression", facetExpression: null, query: ""},
            {message:"empty facet expression", facetExpression: [], query: ""},
            {message:"simple facet expression", facetExpression: [{fid: 1, values: [2]}], query: "({1.EX.'2'})"},
            {message:"numeric fid facet expression", facetExpression: [{fid: 1, values: [1, 2]}], query: "({1.EX.'1'}OR{1.EX.'2'})"},
            {message:"text fid facet expression", facetExpression: [{fid: 1, values: ['1', '2']}], query: "({1.EX.'1'}OR{1.EX.'2'})"},
            {message:"multiple fids facet expression", facetExpression: [{fid: 1, values: [1, 2]}, {fid: 2, values: [3, 4]}], query: "({1.EX.'1'}OR{1.EX.'2'})AND({2.EX.'3'}OR{2.EX.'4'})"},
            {message:"date fid facet expression", facetExpression: [{fid: 1, fieldtype: consts.DATE, values: ['10-2-2015', '10-12-2015']}], query: "({1.OBF.'10-2-2015'}AND{1.OAF.'10-12-2015'})"},
            {message:"datetime fid facet expression", facetExpression: [{fid: 1, fieldtype: consts.DATE_TIME, values: ['10-2-2015', '10-12-2015']}], query: "({1.OBF.'10-2-2015'}AND{1.OAF.'10-12-2015'})"},
            {message:"date fid facet expression invalid values", facetExpression: [{fid: 1, fieldtype: consts.DATE, values: ['10-2-2015']}], query: ""},
            {message:"facet expression no values", facetExpression: [{fid: 1}], query: ""},
            {message:"simple facet expression as string", facetExpression: ['{"fid":1,"values":[1,2]}', '{"fid":2,"values":[3,4]}'], query: "({1.EX.'1'}OR{1.EX.'2'})AND({2.EX.'3'}OR{2.EX.'4'})"}
        ];

        return cases;
    }

    describe('should format given facetExpression into a valid query expression', function() {
        queryDataProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var promise = queryFormatter.format(entry.facetExpression);
                promise.then(
                    function(query) {
                        assert.equal(query, entry.query, entry.message);
                    }
                );
                done();
            });
        });
    });
});
