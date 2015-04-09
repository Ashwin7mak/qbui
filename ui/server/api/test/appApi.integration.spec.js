'use strict';
var should = require('should');
var assert = require('assert');
var app = require('../../app');
var config = require('../../config/environment');
var apiBase = require('./apiBase.mock')(config);
var Promise = require('bluebird');

describe('API - APPS test cases', function () {
    //Cache the init promise so that test methods can use it as init.then(function(){...})
    var init = apiBase.initialize();

    var exampleApp = {
        "name":"Mark's App",
        "tables":[
            { "name":"table1", "fields":[
                {"name":"phone", "type":"PHONE_NUMBER" }
            ]
            }
        ]
    };

    //Helper method to create an app, can be used by multiple test cases
    function createApp() {
        var deferred = Promise.pending();
        init.then(function(createdRealm){
            apiBase.executeRequest('/api/v1/apps', 'POST', exampleApp).then(function(appResponse){
                console.log('App response: ' + JSON.stringify(appResponse));
                deferred.resolve(appResponse);
            }).catch(function(error){
                deferred.reject(error);
                assert(false, 'failed to create app: ' + JSON.stringify(error));
            });
        });
        return deferred.promise;
    }

    function providePhoneRecords(fid) {
        //Incomplete number
        var recordsInput =
            [{
            "id": fid,
            "value": "12345678"}]
        ;
        var expectedRecords = {
                "id": fid,
                "value": "12345678",
                "display": "(1) 234-5678"};

        //More than 10 digit number
        var largeInput =  [{
            "id": fid,
            "value": "1234567890123"}];

        var largeExpected = {
                "id": fid,
                "value": "1234567890123",
                "display": "123 (456) 789-0123"};

        //Empty records
        var emptyPhoneRecords =  [{
            "id": fid,
            "value": ""}];
        var expectedEmptyPhoneRecords = {
                "id": fid,
                "value": "",
                "display": ""};

        //null record value
        var nullPhoneRecords =  [{
            "id": fid,
            "value": null}];
        var nullExpectedPhoneRecords = {
                "id": fid,
                "value": null,
                "display": null};

        return [
            { message: "Phone number", record: recordsInput, expectedFieldValue: expectedRecords },
            { message: "Empty phone number", record: emptyPhoneRecords, expectedFieldValue: expectedEmptyPhoneRecords},
            { message: "Too-long phone number", record: largeInput, expectedFieldValue: largeExpected },
            { message: "null phone number", record: nullPhoneRecords, expectedFieldValue: nullExpectedPhoneRecords }
        ];
    }

    function createAndFetchRecord(recordsEndpoint, record, params) {
        var fetchRecordDeferred = Promise.pending();

        apiBase.executeRequest(recordsEndpoint, 'POST', record)
        .then(function(recordIdResponse){
            var getEndpoint = recordsEndpoint + JSON.parse(recordIdResponse.body).id;
            if(params) {
                getEndpoint += params;
            }
            apiBase.executeRequest(getEndpoint, 'GET')
            .then(function(fetchedRecordResponse){
                var fetchedRecord = JSON.parse(fetchedRecordResponse.body);
                fetchRecordDeferred.resolve(fetchedRecord);
            });
        });

        return fetchRecordDeferred.promise;
    }

    it('Should create an app', function (done) {
        createApp().then(function(appResponse){
            var app = JSON.parse(appResponse.body);
            var phoneField;
            app.tables[0].fields.forEach(function(field){
                if(field.type === 'PHONE_NUMBER') {
                    phoneField = field;
                }
            });
            assert(phoneField, 'failed to find phone field');
            var records = providePhoneRecords(phoneField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            records.forEach(function(currentRecord) {
                var recordsEndpoint = '/api/v1/apps/'+ app.id +'/tables/' + app.tables[0].id + '/records/';
                fetchRecordPromises.push(createAndFetchRecord(recordsEndpoint, currentRecord.record, '?format=display'));
            });

            //When all the records have been created and fetched, assert the values match expectations
            Promise.all(fetchRecordPromises)
                .then(function(results) {
                    for(var i = 0; i < results.length; i++) {
                        results[i].forEach(function(fieldValue) {
                            if(fieldValue.id === records[i].expectedFieldValue.id) {
                                assert.equal(fieldValue, records[i].expectedFieldValue, 'Unexpected field value returned: '
                                + JSON.stringify(fieldValue) + ', ' + JSON.stringify(records[i].expectedFieldValue) );
                            }
                        });
                    }
                    done();
                });
        });
    });
});

after(function(done) {
    //Realm deletion takes time, bump the timeout
    this.timeout(10000);
    console.log('in the after!');
    done();
    //apiBase.cleanup().then(function(){
    //    done();
    //});
});
