/**
 * This file uses the Page Object pattern to define the reportService page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/10/15
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var promise = require('bluebird');
    var ReportServicePage = function() {
        // Page Elements using Locators
        this.reportTitleEl = element.all(by.className('header')).first();
        this.columnHeaderElList = element.all(by.repeater('col in colContainer.renderedColumns track by col.colDef.name'));
        this.recordElList = element.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));
        this.mainContent = element.all(by.className('nav-target')).first();
        this.tableContainer = element.all(by.className('ui-grid')).first();
        this.lastColumn = element.all(by.className('ui-grid-header-cell')).last();
        /**
         * Helper function that will get all of the field column headers from the report. Returns an array of strings.
         */
        this.getReportColumnHeaders = function() {
            var deferred = promise.pending();
            this.columnHeaderElList.then(function(elements) {
                var fetchTextPromises = [];
                for (var i = 0; i < elements.length; i++) {
                    fetchTextPromises.push(elements[i].getAttribute('innerText'));
                }
                Promise.all(fetchTextPromises).then(function(colHeaders) {
                    var fieldColHeaders = [];
                    colHeaders.forEach(function(headerText) {
                        // The getText call above is returning the text value with a new line char on the end, need to remove it
                        var subText = headerText.replace(/(\r\n|\n|\r)/gm, '');
                        fieldColHeaders.push(subText.trim());
                    });
                    deferred.resolve(fieldColHeaders);
                });
            });
            return deferred.promise;
        };
        /**
         * Function that will return the dimensions of the browser window and report grid
         */
        this.getDimensions = function() {
            return {
                windowSize        : browser.manage().window().getSize(),
                mainSize          : this.mainContent.getSize(),
                mainLoc           : this.mainContent.getLocation(),
                tableContainerSize: this.tableContainer.getSize(),
                tableContainerLoc : this.tableContainer.getLocation(),
                lastColumnSize    : this.lastColumn.getSize(),
                lastColumnLoc     : this.lastColumn.getLocation()
            };
        };
        /**
         * Validates that the grid dimensions are within proper proportions after resizing the browser window
         */
        this.validateGridDimensions = function(result) {
            var leftPadding = 10;
            var allowedVariance = 25;
            var pointOfLastColumn = result.lastColumnLoc.x + leftPadding + result.lastColumnSize.width;
            var pointOfMainContent = result.mainLoc.x + result.mainSize.width;
            var endsDiff = Math.abs(pointOfMainContent - pointOfLastColumn);
            expect(endsDiff).toBeLessThan(allowedVariance);
        };
    };
    module.exports = new ReportServicePage();
}());