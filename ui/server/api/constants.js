/*
 * This module contains global shared constant values for the server
 */
(function() {
    'use strict';
    module.exports = Object.freeze({
        POST            : 'POST',
        GET             : 'GET',
        DELETE          : 'DELETE',
        PUT             : 'PUT',
        PATCH           : 'PATCH',
        CONTENT_TYPE    : 'Content-Type',
        APPLICATION_JSON: 'application/json',
        APPLICATION_XML : 'application/xml',
        TEXT_HTML       : 'text/html',
        UTC_TIMEZONE    : 'Universal',
        //Field types
        FORMULA         : 'FORMULA',
        SCALAR          : 'SCALAR',
        CONCRETE        : 'CONCRETE',
        REPORT_LINK     : 'REPORT_LINK',
        SUMMARY         : 'SUMMARY',
        LOOKUP          : 'LOOKUP',
        //Data types
        CHECKBOX        : 'CHECKBOX',
        TEXT            : 'TEXT',
        PHONE_NUMBER    : 'PHONE_NUMBER',
        DATE_TIME       : 'DATE_TIME',
        DATE            : 'DATE',
        DURATION        : 'DURATION',
        TIME_OF_DAY     : 'TIME_OF_DAY',
        NUMERIC         : 'NUMERIC',
        CURRENCY        : 'CURRENCY',
        RATING          : 'RATING',
        PERCENT         : 'PERCENT',
        URL             : 'URL',
        EMAIL_ADDRESS   : 'EMAIL_ADDRESS',
        USER            : 'USER',
        FILE_ATTACHMENT : 'FILE_ATTACHMENT',
        //Query expressions
        QUERY_AND       : 'AND',
        QUERY_OR        : 'OR',
        OPERATOR_EQUALS : '.EX.',
        OPERATOR_ONORBEFORE : '.OBF.',
        OPERATOR_ONORAFTER  : '.OAF.',
        //Error codes/messages
        FACET_RECORD_TOO_BIG_ERROR_CODE : 100024,//error code returned by server if a facet field has more than 200 distinct rows
        FACET_RECORD_TOO_BIG_ERROR_MSG  :"businessobject.error.report.facet.record.tooBig",
        FACET_REPORT_TOO_BIG_ERROR_CODE : 100025, //error code returned by server if thefetchFacets is called on a table with more than 10K rows.
        FACET_REPORT_TOO_BIG_ERROR_MSG  :"businessobject.error.report.facet.table.tooBig"
    });

}());
