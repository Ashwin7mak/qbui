/*
 * This module contains global shared constant values for the server
 */
(function() {
    'use strict';
    var bigDecimal = require('bigdecimal');

    module.exports = Object.freeze({
        POST            : 'POST',
        GET             : 'GET',
        DELETE          : 'DELETE',
        PUT             : 'PUT',
        PATCH           : 'PATCH',
        CONTENT_TYPE    : 'Content-Type',
        CONTENT_LENGTH  : 'Content-Length',
        APPLICATION_JSON: 'application/json',
        APPLICATION_XML : 'application/xml',
        TEXT_HTML       : 'text/html',
        ACCEPT          : 'Accept',
        // Timezones
        UTC_TIMEZONE    : 'Universal',
        EST_TIMEZONE    : 'America/New_York',
        PST_TIMEZONE    : 'America/Los_Angeles',
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
        TEXT_FORMULA    : 'TEXT_FORMULA',
        URL_FORMULA     : 'URL_FORMULA',
        NUMERIC_FORMULA : 'NUMERIC_FORMULA',

        SYNTHETIC_TABLE_REPORT: {
            ID: '0',
            ROUTE: 'default'
        },

        COOKIES: {
            TICKET: 'TICKET',
            NSTICKET: 'NSTICKET',
            V2TOV3: 'V2TOV3'
        },

        NUMERIC_SEPARATOR: {
            PERIOD: '.',
            COMMA: ','
        },

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
            NUM_ROWS: 'numRows',
            HOME_PAGE_ID: 'homePageId',
            OPEN_IN_V3: 'openInV3',
            HYDRATE: 'hydrate',

            //  legacy stack request paameters
            LEGACY_STACK: {
                ACTION: 'a',
                VALUE: 'value'
            }
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
        DURATION_CONSTS : {
            DEFAULT_DECIMAL_PLACES: 14,
            MILLIS_PER_SECOND: new bigDecimal.BigDecimal(1000),
            MILLIS_PER_MIN: new bigDecimal.BigDecimal(60000),
            MILLIS_PER_HOUR: new bigDecimal.BigDecimal(3600000),
            MILLIS_PER_DAY: new bigDecimal.BigDecimal(86400000),
            MILLIS_PER_WEEK: new bigDecimal.BigDecimal(604800000),

            SECONDS_PER_MINUTE: new bigDecimal.BigDecimal(60),
            MINUTES_PER_HOUR: new bigDecimal.BigDecimal(60),
            TEN: new bigDecimal.BigDecimal(10),
            NEGATIVE_TEN: new bigDecimal.BigDecimal(-10),
            ZERO: new bigDecimal.BigDecimal(0),
            ONE: new bigDecimal.BigDecimal(1),

            //Do not modify this map, key values are used for locale string lookup
            SCALES : {
                HHMM: ':HH:MM',
                HHMMSS: ':HH:MM:SS',
                MM: ':MM',
                MMSS: ':MM:SS',
                SMART_UNITS:'Smart Units',
                WEEKS: 'Weeks',
                DAYS: 'Days',
                HOURS: 'Hours',
                MINUTES: 'Minutes',
                SECONDS: 'Seconds',
                MILLISECONDS: 'Milliseconds',
            },
            ACCEPTED_TYPE: {
                ACCEPTED_DURATION_TYPE: 'acceptedDurationType.',
                WEEKS: 'Weeks',
                WEEK: 'Week',
                W: 'W',
                DAYS: 'Days',
                DAY: 'Day',
                D: 'D',
                HOURS: 'Hours',
                HOUR: 'Hour',
                H: 'H',
                MINUTES: 'Minutes',
                MINUTE: 'Minute',
                M: 'M',
                SECONDS: 'Seconds',
                SECOND: 'Second',
                S: 'S',
                MILLISECONDS: 'Milliseconds',
                MILLISECOND: 'Millisecond',
                MS: 'MS',
                SECS: 'Secs',
                MSECS: 'Msecs',
            },
            PLACEHOLDER: {
                HHMM: 'hh:mm',
                HHMMSS: 'hh:mm:ss',
                MM: ':mm',
                MMSS: ':mm:ss',
                WEEKS: 'weeks',
                DAYS: 'days',
                HOURS: 'hours',
                MINUTES: 'minutes',
                SECONDS: 'seconds',
            }
        },
        PAGE : {
            DEFAULT_OFFSET : 0,
            DEFAULT_NUM_ROWS: 20,
            MAX_NUM_ROWS: 1000
        },
        SORT_ORDER: {
            ASC: 'asc',
            DESC: 'desc'
        },
        RECORD_TYPE: {
            GROUP: 'GROUP',
            TABLE: 'TABLE'
        },
        BUILTIN_FIELD_NAME: {
            RECORD_ID: 'Record ID#',
            LAST_MODIFIED_BY: "Last Modified By",
            DATE_CREATED: "Date Created",
            RECORD_OWNER: "Record Owner"
        },
        ERROR_CODE:{
            DTS_ERROR_CODE: "DataOperationOrSyncError"
        },
        PROTOCOL: {
            HTTP: 'http://',
            HTTPS: 'https://'
        },
        HttpStatusCode: {
            'CONTINUE': 100,
            'SWITCHING_PROTOCOLS': 101,
            'PROCESSING': 102,
            'OK': 200,
            'CREATED': 201,
            'ACCEPTED': 202,
            'NON_AUTHORITATIVE_INFORMATION': 203,
            'NO_CONTENT': 204,
            'RESET_CONTENT': 205,
            'PARTIAL_CONTENT': 206,
            'MULTI_STATUS': 207,
            'ALREADY_REPORTED': 208,
            'IM_USED': 226,
            'MULTIPLE_CHOICES': 300,
            'MOVED_PERMANENTLY': 301,
            'FOUND': 302,
            'SEE_OTHER': 303,
            'NOT_MODIFIED': 304,
            'USE_PROXY': 305,
            'UNUSED': 306,
            'TEMPORARY_REDIRECT': 307,
            'PERMANENT_REDIRECT': 308,
            'BAD_REQUEST': 400,
            'UNAUTHORIZED': 401,
            'PAYMENT_REQUIRED': 402,
            'FORBIDDEN': 403,
            'NOT_FOUND': 404,
            'METHOD_NOT_ALLOWED': 405,
            'NOT_ACCEPTABLE': 406,
            'PROXY_AUTHENTICATION_REQUIRED': 407,
            'REQUEST_TIMEOUT': 408,
            'CONFLICT': 409,
            'GONE': 410,
            'LENGTH_REQUIRED': 411,
            'PRECONDITION_FAILED': 412,
            'PAYLOAD_TOO_LARGE': 413,
            'URI_TOO_LONG': 414,
            'UNSUPPORTED_MEDIA_TYPE': 415,
            'RANGE_NOT_SATISFIABLE': 416,
            'EXPECTATION_FAILED': 417,
            'MISDIRECTED_REQUEST': 421,
            'UNPROCESSABLE_ENTITY': 422,
            //alias for UNPROCESSABLE_ENTITY
            INVALID_INPUT: 422,
            'LOCKED': 423,
            'FAILED_DEPENDENCY': 424,
            'UPGRADE_REQUIRED': 426,
            'PRECONDITION_REQUIRED': 428,
            'TOO_MANY_REQUESTS': 429,
            'REQUEST_HEADER_FIELDS_TOO_LARGE': 431,
            'INTERNAL_SERVER_ERROR': 500,
            'NOT_IMPLEMENTED': 501,
            'BAD_GATEWAY': 502,
            'SERVICE_UNAVAILABLE': 503,
            'GATEWAY_TIMEOUT': 504,
            'HTTP_VERSION_NOT_SUPPORTED': 505,
            'VARIANT_ALSO_NEGOTIATES': 506,
            'INSUFFICIENT_STORAGE': 507,
            'LOOP_DETECTED': 508,
            'NOT_EXTENDED': 510,
            'NETWORK_AUTHENTICATION_REQUIRED': 511
        }
    });

}());
