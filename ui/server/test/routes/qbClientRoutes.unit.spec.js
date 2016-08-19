
var sinon = require('sinon');
var request = require('supertest');
var should = require('should');

var log = require('../../src/logger').getLogger();
var routeGroups = require('../../src/routes/routeGroups');

var express = require('express');
var app = express();

var mockConfig = {
    routeGroup: routeGroups.DEBUG
};
var assert = require('assert');

var envConsts = require('../../src/config/environment/environmentConstants');
require('../../src/routes')(app, mockConfig);

/*eslint-disable no-invalid-this */

/**
 * Unit tests for app generator
 */
describe('Express Client Routes', function() {

    var stubLog;
    var server;
    var spySetTid;

    beforeEach(function() {
        stubLog = sinon.stub(log, 'info').returns(true);
        this.timeout(5000);
    });
    afterEach(function() {
        stubLog.restore();
    });

    it('Validate default client route', function(done) {
        request(app).
            get('/').
            expect(200, done);
    });

    it('Validate get apps route', function(done) {
        request(app).
            get('/apps').
            expect(200, done);
    });

    it('Validate get app route', function(done) {
        request(app).
            get('/app/1').
            expect(200, done);
    });

    it('Validate get tables route', function(done) {
        request(app).
            get('/app/1/table/2').
            expect(200, done);
    });

    it('Validate get table reports route', function(done) {
        request(app).
            get('/app/1/table/2/reports').
            expect(200, done);
    });

    it('Validate get record route', function(done) {
        request(app).
            get('/app/1/table/2/record/3').
            expect(200, done);
    });

    it('Validate get table report route', function(done) {
        request(app).
            get('/app/1/table/2/report/3').
            expect(200, done);
    });

    it('Validate get table record route', function(done) {
        request(app).
        get('/app/1/table/2/report/3/record/4').
        expect(200, done);
    });

    it('Validate get component route', function(done) {
        request(app).
        get('/components').
        expect(200, done);
    });

    it('Validate get component route with name', function(done) {
        request(app).
        get('/components/testComponentName').
        expect(200, done);
    });

    //TODO: Should this test be removed and/or moved to a diff location
    it('Validate config has walkmeJS', function(done) {
        var testConfig = require('../../src/config/expressConfig')(app);
        should.exist(testConfig.walkmeJSSnippet);
        done();
    });
});
