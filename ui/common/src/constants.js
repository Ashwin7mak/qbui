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
        EST_TIMEZONE    : 'US/Eastern',
        PST_TIMEZONE    : 'US/Pacific',
        CET_TIMEZONE    : 'Europe/Berlin',
        JST_TIMEZONE    : 'Asia/Tokyo',
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

        //Formatting request parameter
        REQUEST_PARAMETER : {
            FORMAT: 'format',
            FACET_EXPRESSION: 'facetexpression',
            SORT_LIST: 'sortList',
            LIST_DELIMITER: '.',
            GROUP_DELIMITER: ':',
            QUERY: 'query',
            COLUMNS: 'columns',
            OFFSET: 'offset',
            NUM_ROWS: 'numRows'
        },
        FORMAT : {
            DISPLAY: 'display',
            RAW: 'raw'
        },
        MILLI : {
            ONE_SECOND: 1000,
            ONE_MINUTE: 1000 * 60,
            ONE_HOUR: 1000 * 60 * 60,
            ONE_DAY: 1000 * 60 * 60 * 24,
            ONE_WEEK: 1000 * 60 * 60 * 24 * 7
        },
        PAGE : {
            DEFAULT_OFFSET : 0,
            DEFAULT_NUM_ROWS: 20,
            MAX_NUM_ROWS: 1000
        },
        SORT_ORDER: {
            ASC: 'asc',
            DESC: 'desc'
        }
    });

}());
