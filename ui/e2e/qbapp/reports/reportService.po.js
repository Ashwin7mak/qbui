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
        // Left Nav
        this.navMenuEl = element(by.className('leftMenu'));
        this.navStackedEl = element(by.className('nav-stacked'));
        this.navLinksElList = element.all(by.className('leftNavLink'));
        this.appsHomeLinkEl = this.navLinksElList.first();
        // Report Container
        this.reportContainerEl = element(by.className('reportContainer'));
        // Loaded Content Div
        this.loadedContentEl = this.reportContainerEl.element(by.className('loadedContent'));
        // Griddle table
        this.griddleContainerEl = element(by.className('griddle-container'));
        this.griddleBodyEl = element(by.className('griddle-body'));
        this.griddleTableHeaderEl = this.griddleBodyEl.all(by.tagName('thead'));
        this.griddleColHeaderElList = this.griddleTableHeaderEl.all(by.tagName('span'));
        this.griddleLastColumnHeaderEl = this.griddleColHeaderElList.last();
        this.griddleDataBodyDivEl = this.griddleBodyEl.all(by.tagName('tbody')).first();
        this.griddleRecordElList = this.griddleDataBodyDivEl.all(by.tagName('tr'));
        /**
        * Helper function that will get all of the field column headers from the report. Returns an array of strings.
        */
        this.getReportColumnHeaders = function() {
            var deferred = promise.pending();
            this.griddleColHeaderElList.then(function(elements) {
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
    };
    module.exports = ReportServicePage;
}());
