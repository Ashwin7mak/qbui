/**
 * rawValue.generator.js generates raw values of various types for use in the creation of both schema and records
 * Created by cschneider1 on 5/28/15.
 */
(function () {
    'use strict';

    //Generates and returns a psuedo-random 32 char string that is URL safe
    function generateValidSubdomainString() {
        var text = '';
        for (var i = 0; i < 32; i++) {
            text += SUBDOMAIN_CHARS.charAt(Math.floor(Math.random() * SUBDOMAIN_CHARS.length));
        }
        return text;
    }

    //Generates and returns a psuedo-random char string of specified length
    function generateString(length) {
        var text = '';
        for (var i = 0; i < length; i++) {
            text += SUBDOMAIN_CHARS.charAt(Math.floor(Math.random() * SUBDOMAIN_CHARS.length));
        }
        return text;
    }

    //Generates and returns a psuedo-random email string
    function generateEmail() {
        return generateString(10) + "_" + generateString(10) + "@intuit.com";
    }

    //Generates and returns a psuedo-random us phone number
    function generateUsPhoneNumber(includeExt) {
        var phoneNumber = "(" + generateInt(100, 999) + ")" + generateInt(100, 999) + "-" + generateInt(1000, 9999);
        if(includeExt){
            phoneNumber = phoneNumber + "x"+generateInt(1000, 9999);
        }
        return phoneNumber;
    }

    //Generates and returns a psuedo-random url with prefix http://<randomString>.<randomString>
    function generateUrl() {
        var url = "http://" + generateString(12) + "." + generateString(3);
        return url;
    }

    //Generates and returns a psuedo-random double
    function generateDouble(min, max) {
        var relativeMax = max - min;
        return Math.random() * relativeMax + min;
    }

    //Generates and returns a psuedo-random integer
    function generateInt(min, max) {
        return Math.floor(generateDouble(min, max));
    }

    //Generates a pseudo-randomly chosen true or false
    function generateBool() {
        return Math.random() >= .5;
    }

}());
