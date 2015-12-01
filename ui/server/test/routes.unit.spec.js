
var sinon = require('sinon');
var request = require('supertest');

var log = require('../logger').getLogger();
var errors = require('../components/errors');
var routeGroups = require('../routes/routeGroups');

var express = require('express');
var app = express();
app.set('views', '../views');   // to avoid issue trying to find the error html pages..
app.engine('html', require('ejs').renderFile);

var mockConfig = {
    routeGroup: routeGroups.DEBUG,
};

require('../routes')(app, mockConfig);

/**
 * Unit tests for app generator
 */
describe('Express Routes', function() {

    var stubLog;
    var server;
    var spySetTid;

    beforeEach(function() {
        stubLog = sinon.stub(log, 'logRequest').returns(true);
    });
    afterEach(function() {
        stubLog.restore();
    });

    it('Validate unauthorized route', function(done) {
        request(app).
            get('/unauthorized').
            expect(403).
            end(function(err, res) {
                if (err) {return done(err);}
                done();
            });
    });

    it('Validate pageNotFound route', function(done) {
        request(app).
            get('/pageNotFound').
            expect(404).
            end(function(err, res) {
                if (err) {return done(err);}
                done();
            });
    });

    it('Validate internal server error route', function(done) {
        request(app).
            get('/internalServerError').
            expect(500).
            end(function(err, res) {
                if (err) {return done(err);}
                done();
            });
    });

    it('Validate an undefined route', function(done) {
        request(app).
            get('/undefinedRoute').
            expect(404).
            end(function(err, res) {
                if (err) {return done(err);}
                done();
            });
    });

    it('Validate an forbidden route', function(done) {
        request(app).
            get('/assets').
            expect(404).
            end(function(err, res) {
                if (err) {return done(err);}
                done();
            });
    });

});
