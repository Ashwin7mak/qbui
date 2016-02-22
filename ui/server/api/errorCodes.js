/*
 * This module contains the error codes shared between server and node.
 * The message keys shared between node and client and should be interpreted by client to convert to localized strings.
 */
(function() {
    'use strict';
    module.exports = Object.freeze({
        ERROR_CODE: {
            FACET: {
                RECORD_TOO_BIG: 100024,//error code returned by server if a facet field has more than 200 distinct rows
                REPORT_TOO_BIG: 100025 //error code returned by server if thefetchFacets is called on a table with more than 10K rows.
            }
        },
        ERROR_MSG_KEY: {
            UNKNOWN_ERROR : "unknownError",
            FACET: {
                RECORD_TOO_BIG: "businessobject.error.report.facet.record.tooBig",
                REPORT_TOO_BIG: "businessobject.error.report.facet.table.tooBig",
            }
        }
    });

}());
