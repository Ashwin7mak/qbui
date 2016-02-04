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

    var e2ePageBase = require('./../../common/e2ePageBase');
    var ReportServicePage = function() {
        // Page Elements using Locators
        // Left Nav
        this.navMenuBodyEl = element(by.tagName('body'));
        this.navMenuShellEl = element(by.className('navShell'));
        this.navMenuEl = element(by.className('leftNav'));
        this.navStackedEl = element(by.className('nav-stacked'));
        this.navLinksElList = this.navStackedEl.all(by.className('leftNavLink'));
        this.appsHomeLinkEl = this.navLinksElList.first();

        this.appToggleDivEl = element(by.className('appsToggle'));
        this.appsListDivEl = element(by.className('appsList'));
        this.appLinksElList = this.appsListDivEl.all(by.className('leftNavLink'));

        this.searchAppsDivEl = element(by.className('searchApps'));
        this.searchAppsInputEl = this.searchAppsDivEl.element(by.tagName('input'));

        this.tablesListDivEl = element(by.className('tablesList'));
        this.tableLinksElList = this.tablesListDivEl.all(by.className('link'));
        this.reportHamburgersElList = this.tablesListDivEl.all(by.className('right'));
        this.reportsListDivEl = element(by.className('reportsList'));
        this.reportLinksElList = this.reportsListDivEl.all(by.className('leftNavLink'));
        this.reportsBackLinkEl = this.reportsListDivEl.element(by.className('backLink'));


        // Top Nav
        this.topNavDivEl = element(by.className('topNav'));
        // Left div (containing leftNav toggle hamburger)
        this.topNavToggleHamburgerEl = this.topNavDivEl.element(by.className('iconLink'));
        this.topNavLeftDivEl = this.topNavDivEl.element(by.className('left'));
        // Center div (containing harmony icons)
        this.topNavCenterDivEl = this.topNavDivEl.element(by.className('center'));
        this.topNavHarButtonsListEl = this.topNavCenterDivEl.all(by.tagName('button'));
        // Right div (containing global actions and right dropdown)
        // global actions
        this.topNavRightDivEl = this.topNavDivEl.element(by.className('right'));
        this.topNavGlobalActDivEl = this.topNavRightDivEl.element(by.className('globalActions'));
        this.topNavGlobalActionsListEl = this.topNavGlobalActDivEl.all(by.tagName('a'));
        this.topNavUserGlobActEl = this.topNavGlobalActionsListEl.get(0);
        this.topNavHelpGlobActEl = this.topNavGlobalActionsListEl.get(1);

        // dropdown
        this.topNavRightDropdownDivEl = this.topNavRightDivEl.element(by.className('dropdown'));
        this.topNavDropdownEl = this.topNavRightDropdownDivEl.element(by.className('dropdownToggle'));


        // Report Container
        this.reportContainerEl = element.all(by.className('reportContainer')).first();
        //Report Stage Button
        this.reportStageBtn = this.reportContainerEl.element(by.className('toggleStage'));
        this.reportStageLayout = this.reportContainerEl.element(by.className('layout-stage ')).element(by.className('collapse'));
        // Loaded Content Div
        this.loadedContentEl = this.reportContainerEl.element(by.className('loadedContent'));
        // Griddle table
        this.griddleContainerEl = element.all(by.className('griddle-container')).first();
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
                        if (subText !== 'actions'){
                            fieldColHeaders.push(subText.trim());
                        }
                    });
                    deferred.resolve(fieldColHeaders);
                }).catch(function(error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });
            });
            return deferred.promise;
        };

        /**
         * Assertion function that will test the properties of the leftNav
         */
        this.assertNavProperties = function(breakpointSize, open, clientWidth) {
            // Check properties of nav bar
            expect(this.navMenuBodyEl.getAttribute('class')).toMatch(breakpointSize + '-breakpoint');
            if (open){
                expect(this.navMenuEl.getAttribute('class')).toMatch('open');
                expect(this.navMenuEl.getAttribute('clientWidth')).toMatch(clientWidth);
            } else {
                expect(this.navMenuEl.getAttribute('class')).toMatch('closed');
                expect(this.navMenuEl.getAttribute('clientWidth')).toMatch(clientWidth);
            }
        };

        this.assertGlobalNavTextVisible = function(visible) {
            this.topNavGlobalActionsListEl.then(function(navActions) {
                for (var i = 0; i < navActions.length; i++) {

                    var textEl = navActions[i].all(by.tagName('span')).last();
                    expect(textEl.isDisplayed()).toBe(visible);
                }
            });
        };

        this.clickReportsMenu = function(tableLinkEl) {
            tableLinkEl.by(className('right')).click();
        };

        this.clickAppToggle = function() {
            var deferred = promise.pending();

            try {
                this.appToggleDivEl.click().then(function() {
                    // Sleep for a second to allow toggle animation to finish (and the DOM to refresh)
                    e2ePageBase.sleep(1000);
                    deferred.resolve();
                });
            } catch (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            }

            return deferred.promise;
        };

        this.getGlobalNavTextEl = function(globalNavEl) {
            var textEl = globalNavEl.all(by.tagName('span')).last();
            return textEl;
        };

    };
    ReportServicePage.prototype = e2ePageBase;
    module.exports = ReportServicePage;
}());
