'use strict';
var should = require('should');
var app = require('../../app');
var config = require('../../config/environment');
var apiBase = require('./apiBase.mock')(config);

describe('API - APPS', function () {
    this.timeout(25000);

    var init = apiBase.initialize();

    it('Should create an app', function (done) {
        init.then(function(){
            //TODO: execute test
            done();
        });

    });
});

after(function(){
    apiBase.cleanup();
});
