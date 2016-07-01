
var sinon = require('sinon');
var request = require('supertest');

var log = require('../src/logger').getLogger();
var errors = require('../src/components/errors');
var routeGroups = require('../src/routes/routeGroups');
var routeConstants = require('../src/routes/routeConstants');

var express = require('express');
var app = express();
app.set('views', '../views');   // to avoid issue trying to find the error html pages..
app.engine('html', require('ejs').renderFile);

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var mockConfig = {
    routeGroup: routeGroups.DEBUG,
};

require('../src/routes')(app, mockConfig);

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

    it('Validate post log client perf route', function(done) {

        stubLog = sinon.stub(log, 'info').returns(true);

        request(app).
        post(routeConstants.LOG_CLIENT_PERF_MSG).
        send({perf:'stat1', another:'stat2'}).
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

    it('Validate get log client perf route is not supported', function(done) {

        request(app).
        get(routeConstants.LOG_CLIENT_PERF_MSG).
        expect(405).
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
            expect(401).
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
            get('/forbidden').
            expect(403).
            end(function(err, res) {
                if (err) {return done(err);}
                done();
            });
    });

});
