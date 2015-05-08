/*
 * This module contains global shared constant values for the server
 */
(function(){
    module.exports = Object.freeze({
        POST: 'POST',
        GET: 'GET',
        DELETE: 'DELETE',
        CONTENT_TYPE: 'Content-Type',
        APPLICATION_JSON: 'application/json',
        APPLICATION_XML: 'application/xml',
        UTC_TIMEZONE: 'Universal',
        //Field types
        PHONE_NUMBER: 'PHONE_NUMBER',
        DATE_TIME: 'DATE_TIME',
        FORMULA_DATE_TIME: 'FORMULA_DATE_TIME',
        DATE: 'DATE',
        DURATION: 'DURATION',
        FORMULA_DURATION: 'FORMULA_DURATION',
        FORMULA_DATE: 'FORMULA_DATE',
        FORMULA_TIME_OF_DAY: 'FORMULA_TIME_OF_DAY',
        TIME_OF_DAY: 'TIME_OF_DAY',
        NUMERIC: 'NUMERIC',
        FORMULA_NUMERIC: 'FORMULA_NUMERIC',
        CURRENCY: 'CURRENCY',
        FORMULA_CURRENCY: 'FORMULA_CURRENCY',
        PERCENT: 'PERCENT',
        FORMULA_PERCENT: 'FORMULA_PERCENT',
        URL: 'URL',
        EMAIL_ADDRESS: 'EMAIL_ADDRESS',
        USER: 'USER',
        FORMULA_USER: 'FORMULA_USER',
        FILE_ATTACHMENT: 'FILE_ATTACHMENT',
        REPORT_LINK: 'REPORT_LINK'
    });
}());