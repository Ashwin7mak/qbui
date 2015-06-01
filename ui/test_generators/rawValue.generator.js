/**
 * rawValue.generator.js generates raw values of various types for use in the creation of both schema and records
 * Created by cschneider1 on 5/28/15.
 */
(function () {
    'use strict';
    var Chance = require('chance');
    var chance = new Chance();
    var SUBDOMAIN_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

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
            var phoneNumber = chance.phone();
            if (includeExt) {
                phoneNumber = phoneNumber + "x" + this.generateInt(1000, 9999);
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
        }
    };

}());
