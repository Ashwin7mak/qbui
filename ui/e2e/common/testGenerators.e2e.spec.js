/**
 * E2E tests for the test generators
 * Created by klabak on 6/1/15.
 */

'use strict';

var consts = require('../../server/api/constants.js');
var config = require('../../server/config/environment/local.js');
var app = require('../../server/app');
var recordBase = require('../../server/api/test/recordApi.base.js')(config);

var appGenerator = require('../../test_generators/app.generator.js');
//var tableGenerator = require('../../test_generators/table.generator.js');
//var fieldGenerator = require('../../test_generators/field.generator.js');
//var recordGenerator = require('../../test_generators/record.generator.js');

var Promise = require('bluebird');
var _ = require('lodash');

var assert = require('assert');
var should = require('should');

describe('Record generator E2E Tests', function (){
    // Generate and verify the app
    // Generate and verify the table
    // Generate and verify the fields
    // Generate and verify the records

    function appFromTableMapProvider(){
        var tableToFieldToFieldTypeMap = {};
        tableToFieldToFieldTypeMap['table 1'] = {};
        tableToFieldToFieldTypeMap['table 1']['field 1'] = consts.TEXT;

        return [
            {message: "generate a table based on a map holding custom table names and custom fields", tableMap: tableToFieldToFieldTypeMap}
        ];
    }

    appFromTableMapProvider().forEach(function (entry) {
        it('Test case: ' + entry.message, function (done) {
            var tableMap = entry.tableMap;
            var generatedApp = appGenerator.generateAppWithTablesFromMap(tableMap);
            // This is giving me an undefined:[] back at the end of the JSON (bug?)
            console.log(generatedApp);

            // Need to stringify into proper JSON to send out to API service
            var exampleApp = appGenerator.appToJsonString(generatedApp);
            console.log(exampleApp);

            this.timeout(30000);
            recordBase.createApp(exampleApp).then(function (appResponse) {
                console.log("App Response: " + appResponse);
                var app = JSON.parse(appResponse.body);
                console.log(app);
                done();
            });
        });
    });

});