// test that node server will redirect to http
var request = require('supertest');
var should = require('should');
describe('Request test always use ssh', function() {

    var server = require('express');
    var app = module.exports = server();

    var config = require('../expressConfig')(app);
    //console.log(config);
    //console.log(process.env);

    // ensure ssl values are set be able to run secure http test
    it('config should have sslPort ', function() {
        should.exist(config.sslPort);
    });

    it('sslPort should be numeric', function() {
        config.sslPort.should.be.an.instanceOf(Number);
    });

    // ensure request use secure http
    it('server http request should return redirect to https with sslPort', function(done) {
        if (config.SSL_KEY.cert && config.SSL_KEY.cert.length) {
            request('http://localhost:' + config.port)
                .get('/')
                .expect(302)
                .expect(function(res) {
                    return !(res.headers.location.indexOf(config.sslPort + "/") > -1);
                })
                .end(function(err) {
                    done(err);
                });
        } else {
            done();
        }
    });

    it('should have NODE_TLS_REJECT_UNAUTHORIZED defined', function() {
        //environment var to allow self signed cert
        should.exist(process.env.NODE_TLS_REJECT_UNAUTHORIZED);
    });


    it('NODE_TLS_REJECT_UNAUTHORIZED should =0 to support selfsigned cert', function() {
        //environment var to allow self signed cert
        process.env.NODE_TLS_REJECT_UNAUTHORIZED.should.equal('0');
    });

    // ensure request use secure http if specified
    it('server should support https', function(done) {
        //test ssl cert if available
        if (config.SSL_KEY.cert && config.SSL_KEY.cert.length) {
            should.exist(process.env.NODE_TLS_REJECT_UNAUTHORIZED);
            request('https://localhost:' + config.sslPort)
                .get('/')
                .expect(200)
                .expect(function(res) {
                    return !(res.redirect === false);
                })
                .end(function(err) {
                    done(err);
                });
        } else {
            done();
        }

    });
});

