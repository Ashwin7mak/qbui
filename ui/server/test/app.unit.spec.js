// test that node server will redirect to http
'use strict';

var request = require('supertest');
var assert = require('assert');

/*eslint-disable no-invalid-this */

describe('Test node app main entry file', function() {

    var app;

    it('test config with NODE_ENV not defined', function() {
        var exception = false;
        var origVal = process.env.NODE_ENV;

        delete process.env.NODE_ENV;

        try {
            app = require('../app');
        } catch (e) {
            exception = true;
        }

        assert(exception);
        process.env.NODE_ENV = origVal;

    });

    it('test server listening', function(done) {

        app = require('../app');

        this.timeout(5000);
        request(app).
            get('/').
            expect(200).
            end(function(err, res) {
                if (err) {return done(err);}
                done();
            });

    });


});

