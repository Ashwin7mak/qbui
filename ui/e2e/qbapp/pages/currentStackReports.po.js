/**
 * This file uses the Page Object pattern to define the currentStack page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 10/20/16
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');
    var e2ePageBase = require('./../../common/e2ePageBase');

    var CurrentStackReportPage = function() {

        // Table report elements
        this.reportTableEl = element(by.className('searchResults'));
        this.reportTableRowElList = this.reportTableEl.all(by.css('tr[canview="true"]'));

        /**
         * Function will gather all records from the reportTable and return the record element of the index specified
         * @param recordIndex
         * @returns Record element at specified index
         */
        this.getRecordFromReportTable = function(recordIndex) {
            var self = this;
            return e2ePageBase.waitForElement(this.reportTableEl).then(function() {
                return self.reportTableRowElList.then(function(records) {
                    return records[recordIndex];
                });
            });
        };

        /**
         * Function returns an array of values from each field in the record element
         * @param recordElement
         * @returns An array of field values
         */
        this.getRecordValues = function(recordElement) {
            return recordElement.all(by.tagName('td')).map(function(elm) {
                return elm.getText();
            }).then(function(textValues) {
                // Remove the first value since it's always empty because of the record actions column
                textValues.shift();
                // Remove any whitespace
                var formattedValues = [];
                textValues.forEach(function(text) {
                    var formattedText = text.trim();
                    formattedValues.push(formattedText);
                });
                return formattedValues;
            });
        };

        /**
         * Function returns the number of records in the report table
         * @returns Count of records
         */
        this.getRecordCount = function() {
            var self = this;
            return e2ePageBase.waitForElement(self.reportTableEl).then(function() {
                return self.reportTableRowElList.then(function(records) {
                    return records.length;
                });
            });
        };
    };
    CurrentStackReportPage.prototype = e2ePageBase;
    module.exports = CurrentStackReportPage;
}());
