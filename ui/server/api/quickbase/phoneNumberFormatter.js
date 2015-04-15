/*
 Given a raw phone number field value and field meta data from the Java capabilities API, this module is capable of
 display formatting the phone number instance.
 */
(function () {
    'use strict';
    //Module constants:
    var OPEN_PAREN = '(';
    var CLOSE_PAREN = ') ';
    var DASH = '-';

    function validValue(fieldValue) {
        if(!fieldValue || fieldValue.value === undefined || fieldValue.value === null) {
            return false;
        }
        return true;
    }

    module.exports = {
        //Given a raw number as input, formats as a legacy QuickBase phone number. Note, not internationalized
        format: function (fieldValue, fieldInfo) {
            if(!validValue(fieldValue)) {
                return null;
            }
            var baseValue = fieldValue.value;
            var len = baseValue.length;
            var areaCode = '';
            var centralOffice = '';
            var finalFour = '';

            //slice positions in raw string:
            var final4Start = len - 4;
            var middle3Start = len - 7;
            var first3Start = len - 10;
            //If there are 4 or more characters, grab them
            if(final4Start >= 0) {
                finalFour = baseValue.slice(final4Start);
                //If there are more than 4 chars, parse the middle chars and insert the '-'
                if(final4Start > 0) {
                    var startIndex = middle3Start;
                    if(startIndex < 0) {
                        startIndex = 0;
                    }
                    centralOffice = baseValue.slice(startIndex, final4Start) + DASH;
                    //if there are more than 7 chars, parse and insert the parens
                    if(middle3Start > 0) {
                        startIndex = first3Start;
                        if(first3Start < 0) {
                            startIndex = 0;
                        }
                        areaCode = OPEN_PAREN + baseValue.slice(startIndex, middle3Start) + CLOSE_PAREN;
                    }
                    //Pad the rest of the the digits to the left of the parens.  Such is life
                    if(first3Start > 0) {
                        areaCode = baseValue.slice(0, startIndex) + ' ' + areaCode;
                    }
                }
            } else {
                finalFour = fieldValue.value;
            }
            //Concatenate & return results
            return areaCode + centralOffice + finalFour;
        }
    };
}());