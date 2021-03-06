var sinon = require('sinon');
var request = require('supertest');
var should = require('should');

var log = require('../../src/logger').getLogger();
var routeGroups = require('../../src/routes/routeGroups');

var express = require('express');
var app = express();

var mockConfig = {
    routeGroup: routeGroups.DEFAULT
};
var assert = require('assert');

var envConsts = require('../../src/config/environment/environmentConstants');
require('../../src/routes')(app, mockConfig);

/**
 * Unit tests for app generator
 */
describe('Express Client Routes', function() {

    var stubLog;

    beforeEach(function() {
        stubLog = sinon.stub(log, 'info').returns(true);
        this.timeout(5000); // eslint-disable-line no-invalid-this
    });
    afterEach(function() {
        stubLog.restore();
    });

    it('Validate default client route', function(done) {
        request(app).
            get('/').
            expect(200);
        done();
    });

    it('Validate get apps route', function(done) {
        request(app).
            get('/apps').
            expect(200);
        done();
    });

    it('Validate get app route', function(done) {
        request(app).
            get('/app/1').
            expect(200);
        done();
    });

    it('Validate get app settings route', function(done) {
        request(app).
        get('/app/1/settings').
        expect(200);
        done();
    });

    it('Validate get app users route', function(done) {
        request(app).
        get('/app/1/users').
        expect(200);
        done();
    });

    it('Validate get app properties route', function(done) {
        request(app).
        get('/app/1/properties').
        expect(200);
        done();
    });

    it('Validate get tables route', function(done) {
        request(app).
            get('/app/1/table/2').
            expect(200);
        done();
    });

    it('Validate get table reports route', function(done) {
        request(app).
            get('/app/1/table/2/reports').
            expect(200);
        done();
    });

    it('Validate get record route', function(done) {
        request(app).
            get('/app/1/table/2/record/3').
            expect(200);
        done();
    });

    it('Validate get table report route', function(done) {
        request(app).
            get('/app/1/table/2/report/3').
            expect(200);
        done();
    });

    it('Validate get table record route', function(done) {
        request(app).
        get('/app/1/table/2/report/3/record/4').
        expect(200);
        done();
    });

    it('Validate get component route', function(done) {
        request(app).
        get('/components').
        expect(200);
        done();
    });

    it('Validate get component route with name', function(done) {
        request(app).
        get('/components/testComponentName').
        expect(200);
        done();
    });

    it('validate get form builder route', function(done) {
        request(app).
        get('/qbase/builder/app/1/table/2').
        expect(200);
        done();
    });

    it('validate get form builder route with formId', function(done) {
        request(app).
        get('/qbase/builder/app/1/table/2/form/3').
        expect(200);
        done();
    });

    it('validate get feature switches route', function(done) {
        request(app).
        get('/qbase/admin/featureSwitches').
        expect(200);
        done();
    });

    it('validate get feature switches route with feature ID', function(done) {
        request(app).
        get('/qbase/admin/featureSwitches/1').
        expect(200);
        done();
    });

    it('validate get governance route with account ID', function(done) {
        request(app).
        get('/qbase/governance/1/users').
        expect(200);
        done();
    });
});
