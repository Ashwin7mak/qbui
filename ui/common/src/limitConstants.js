/**
 * constants of limit values used in quickbase  ui
 */
(function() {
    'use strict';
    module.exports = Object.freeze({ // freeze the object is made effectively immutable

        resultsPerPage  : 1000, // the number of records per page max. This can be passed in as a prop for diff reports
        maxFacetValuesInitiallyRevealed : 5,
        // from QuickBase/coreValidators/src/test/java/com/quickbase/corews/validators/RecordServiceValidator.java see
        // also https://quickbase.atlassian.net/wiki/pages/viewpage.action?pageId=7187490#OracleLimits&QuickBase-Oracle4kBytelimitonNVARCHAR
        maxTextFieldValueLength : 3990
    });

}());
