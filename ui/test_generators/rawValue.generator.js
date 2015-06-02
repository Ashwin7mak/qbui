/**
 * rawValue.generator.js generates raw values of various types for use in the creation of both schema and records
 * Created by cschneider1 on 5/28/15.
 */
(function () {
    'use strict';
    var Chance = require('chance');
    var chance = new Chance();
    var SUBDOMAIN_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

    chance.mixin({
        'timezone' : function (options) {
            var isPositive = chance.bool();
            var timeZone = isPositive ? '+' + chance.integer({min: 0, max: 14}) : '-' + chance.integer({min: 0, max: 12});

            return timeZone;
        },

        'dateFormat' : function(options) {
            var dateFormat = options['dateFormat'];

            if(undefined === dateFormat || !_(appConsts.DATE_FORMATS).contains(appConsts.DATE_FORMATS, dateFormat)){
                dateFormat = chance.pick(appConsts.DATE_FORMATS);
            }
            return dateFormat;
        },

        'phoneNumberWithExtension' : function() {
            phoneNumber = chance.phone() + "x" + chance.integer({min: min, max: max});;
        }
    });

    //These are constants common to all fields
    module.exports = {

        //Generates and returns a psuedo-random 32 char string that is URL safe
        generateValidSubdomainString : function()
        {
            return chance.string({pool: SUBDOMAIN_CHARS, length: 32});
        },

        //Generates and returns a psuedo-random char string of specified length
        generateString : function(length) {
            return chance.string({length: length});
        },

        //Generates and returns a psuedo-random email string
        generateEmail : function() {
            return chance.email();
        },

        //Generates and returns a psuedo-random email string
        generateEmailInDomain : function(domain) {
            return chance.email({domain: domain});
        },

        //Generates and returns a psuedo-random us phone number
        generatePhoneNumber : function(includeExt) {
            if (includeExt) {
                chance.phoneNumberWithExtension();
            }else {
                var phoneNumber = chance.phone();
            }
            return phoneNumber;
        },

        //Generates and returns a psuedo-random us phone number
        generatePhoneNumberForCountry : function(country) {
            var phoneNumber = chance.phone({country: country});

            return phoneNumber;
        },

        //Generates and returns a psuedo-random url with prefix http://<randomString>.<randomString>
        generateUrl : function() {
            var url = chance.url();
            return url;
        },

        //Generates and returns a psuedo-random double
        generateDouble : function(min, max) {
            return chance.floating({min: min, max: max});
        },

        //Generates and returns a psuedo-random integer
        generateInt : function(min, max) {
            return chance.integer({min: min, max: max});
        },

        //Generates a pseudo-randomly chosen true or false
        generateBool : function() {
            return chance.bool();
        },

        generateTimezone : function() {
            return chance.timeZone();
        },

        generateDateFormat : function() {
            return chance.dateFormat();
        }
    };



}());
