
var sinon = require('sinon');
var request = require('supertest');

var log = require('../logger').getLogger();
var errors = require('../components/errors');
var routeGroups = require('../routes/routeGroups');
var routeConstants = require('../routes/routeConstants');

var express = require('express');
var app = express();
app.set('views', '../views');   // to avoid issue trying to find the error html pages..
app.engine('html', require('ejs').renderFile);

var bodyParser = require('body-parser');
app.use(bodyParser.json());

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

    it('Validate post log route', function(done) {

        stubLog = sinon.stub(log, 'info').returns(true);

        request(app).
            post(routeConstants.LOG_CLIENT_MSG).
            send({level:'debug', msg:'test'}).
            expect(200, 'OK').
            end(function(err, res) {
                if (err) {
                    stubLog.restore();
                    return done(err);
                }
                stubLog.restore();
                done();
            });
    });

    it('Validate get log route is not supported', function(done) {

        request(app).
            get(routeConstants.LOG_CLIENT_MSG).
            expect(405).
            end(function(err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('Validate post log route with invalid body data', function(done) {

        request(app).
            post(routeConstants.LOG_CLIENT_MSG).
            send({level:'debug'}).
            expect(400).
            end(function(err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });

    });

    it('Validate post log route with no body data', function(done) {

        request(app).
            post(routeConstants.LOG_CLIENT_MSG).
            expect(400).
            end(function(err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });

    });

    it('Validate post log route with invalid log level', function(done) {

        request(app).
            post(routeConstants.LOG_CLIENT_MSG).
            send({level:'invalid', msg:'test'}).
            expect(400).
            end(function(err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });

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
