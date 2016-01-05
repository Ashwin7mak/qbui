
var sinon = require('sinon');
var request = require('supertest');

var log = require('../../logger').getLogger();
var errors = require('../../components/errors');
var routeGroups = require('../../routes/routeGroups');

var express = require('express');
var app = express();

var mockConfig = {
    routeGroup: routeGroups.DEBUG,
};

require('../../routes')(app, mockConfig);

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
        this.timeout(0);
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

});
