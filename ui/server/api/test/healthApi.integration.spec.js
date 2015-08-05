'use strict';

var app = require('../../app');
var request = require('supertest');
var config = require('../../config/environment');
var apiBase = require('./api.base.js')(config);
require('should');

describe('GET /api/health', function () {
    it('should respond with JSON object with sqlDate', function (done) {
        request(app)
            .get( apiBase.resolveHealthEndpoint())
            .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            if (err) {
                return done(err);
            }
            res.body.should.be.instanceof(Object);
            res.body.should.have.keys('sqlDate');
            done();
        });
    });
});