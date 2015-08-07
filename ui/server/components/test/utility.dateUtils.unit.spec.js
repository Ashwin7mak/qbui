'use strict';

var should = require('should');
var assert = require('assert');
var dateUtils = require('./../utility/dateUtils.js');
/**
 * Unit tests for User field formatting
 */
describe('Validate Date Utility Functions', function() {

    function pad(value) {
        return (value.toString().length < 2) ? '0' + value : value;
    }

    describe('validate formatDate function with padding',function() {


        //  2015-jun-09 8:02:04am
        var testDate = new Date(2015, 5, 9, 8, 2, 4);
        var utcYear = testDate.getUTCFullYear().toString();
        var utcMonth = pad((testDate.getUTCMonth()+1).toString());
        var utcDay = pad(testDate.getUTCDate().toString());
        var utcHour = pad(testDate.getUTCHours().toString());
        var utcMin = pad(testDate.getUTCMinutes().toString());
        var utcSec = pad(testDate.getUTCSeconds().toString());

        it('validate utc date: return %Y', function(done) {

            var formattedDate = dateUtils.formatDate(testDate, '%Y');
            should(formattedDate).be.exactly( utcYear );
            done();
        });

        it('validate utc date: return %Y-%M-%D', function(done) {
            var formattedDate = dateUtils.formatDate(testDate, '%Y-%M-%D');
            should(formattedDate).be.exactly( utcYear + '-' + utcMonth + '-' + utcDay );
            done();
        });

        it('validate utc date: return %Y-%M-%D...%h:%m:%s', function(done) {
            var formattedDate = dateUtils.formatDate(testDate, '%Y-%M-%D...%h:%m:%s');
            should(formattedDate).be.exactly( utcYear + '-' + utcMonth + '-' + utcDay + '...' + utcHour + ':' + utcMin + ':' + utcSec );
            done();
        });

        it('validate utc date: return %h:%m', function(done) {
            var formattedDate = dateUtils.formatDate(testDate, '%h:%m');
            should(formattedDate).be.exactly( utcHour + ':' + utcMin );
            done();
        });

        it('validate utc date..invalid format: return exception', function(done) {
            var formattedDate;
            try {
                formattedDate = dateUtils.formatDate(testDate, '%H:%m');
            }
            catch (e) {
                assert(true);
            }
            should.not.exist(formattedDate);
            done();
        });

    });


});
