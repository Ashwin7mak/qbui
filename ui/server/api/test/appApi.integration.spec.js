'use strict';
var should = require('should');
var app = require('../../app');

describe('API - APPS', function () {
    process.env.NODE_ENV = process.env.NODE_ENV || 'local';
    var config = require('../../config/environment');
    var apiBase = require('./apiBase.mock')(config);

    it('Should create an app', function (done) {
        apiBase.initialize()
            .then(function() {
                //TODO: add actual test case...
                apiBase.cleanup();
                done();
        }).catch(function(){
            apiBase.cleanup();
        });
    });
});
