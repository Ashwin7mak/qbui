/**
 * This file uses the Page Object pattern to define the reportService page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 *
 * Created by klabak on 4/10/15
 */
(function() {
    'use strict';
    //Bluebird Promise library
    var Promise = require('bluebird');

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
        this.appSearchHeadingEl = this.appsListDivEl.element(by.className('heading'));
        this.appsSearchIconEl = this.appSearchHeadingEl.element(by.className('qbIcon'));
        this.appLinksElList = this.appsListDivEl.all(by.className('leftNavLink'));

        this.searchAppsDivEl = this.appsListDivEl.element(by.className('search'));
        this.searchAppsInputEl = this.searchAppsDivEl.element(by.tagName('input'));

        this.tablesListDivEl = element(by.className('tablesList'));
        this.tableLinksElList = this.tablesListDivEl.all(by.className('link'));
        this.reportHamburgersElList = this.tablesListDivEl.all(by.className('right'));
        this.reportsListDivEl = element(by.className('reportsList'));
        this.reportsTopDivEl = this.reportsListDivEl.element(by.className('reportsTop'));
        this.reportGroupsDivEl = this.reportsListDivEl.element(by.className('reportGroups'));
        this.reportGroupElList = this.reportsListDivEl.all(by.className('reportGroup'));

        // Top Nav
        this.topNavDivEl = element(by.className('topNav'));
        // Left div (containing leftNav toggle hamburger)
        this.topNavToggleHamburgerEl = this.topNavDivEl.element(by.className('iconLink'));
        this.topNavLeftDivEl = this.topNavDivEl.element(by.className('left'));
        // Center div (containing harmony icons)
        this.topNavCenterDivEl = this.topNavDivEl.element(by.className('center'));
        this.topNavHarButtonsListEl = this.topNavCenterDivEl.all(by.tagName('span'));
        // Right div (containing global actions and right dropdown)
        // Global actions
        this.topNavRightDivEl = this.topNavDivEl.element(by.className('right'));
        this.topNavGlobalActDivEl = this.topNavRightDivEl.element(by.className('globalActions'));
        this.topNavGlobalActionsListEl = this.topNavGlobalActDivEl.all(by.tagName('a'));
        this.topNavUserGlobActEl = this.topNavGlobalActionsListEl.get(0);
        this.topNavHelpGlobActEl = this.topNavGlobalActionsListEl.get(1);

        // Dropdown menu
        this.topNavRightDropdownDivEl = this.topNavRightDivEl.element(by.className('dropdown'));
        this.topNavDropdownEl = this.topNavRightDropdownDivEl.element(by.className('dropdownToggle'));

        // Report Container
        this.reportContainerEl = element(by.className('reportContainer'));
        // Report Stage
        this.reportStageContentEl = this.reportContainerEl.element(by.className('layout-stage '));
        this.reportStageBtn = this.reportContainerEl.element(by.className('toggleStage'));
        this.reportStageArea = this.reportStageContentEl.element(by.className('collapse'));

        //report tools and content container
        this.reportToolsAndContentEl = this.reportContainerEl.element(by.className('reportToolsAndContentContainer'));
        // Loaded Content Div
        this.loadedContentEl = this.reportToolsAndContentEl.element(by.className('loadedContent'));
        // report table
        this.reportTable = this.loadedContentEl.element(by.className('reportTable'));
        // Table actions container
        this.reportActionsContainerEl = this.reportTable.element(by.className('tableActionsContainer'));
        //report toolbar
        this.reportsToolBar = this.reportActionsContainerEl.element(by.className('reportToolbar'));
        //report records count
        this.reportRecordsCount = this.reportsToolBar.element(by.className('recordsCount'));
        //report filter search Box
        this.reportFilterSearchBox = this.reportsToolBar.element(by.className('filterSearchBox'));


        //report facet Menu Container
        this.reportFacetMenuContainer = this.reportsToolBar.element(by.className('facetsMenuContainer'));
        //report facet buttons
        this.reportFacetBtns = this.reportFacetMenuContainer.element(by.className('facetButtons'));
        //report facet filter button
        this.reportFilterBtn = this.reportFacetBtns.element(by.className('filterButton'));
        //report facet filter carat button
        this.reportFilterBtnCaret = this.reportFacetBtns.element(by.className('filterButtonCaret'));

        //facet menu popup
        this.reportFacetPopUpMenu = this.reportFacetMenuContainer.element(by.className('facetMenuPopup'));
        //facets menu popup container
        this.reportFacetPopUpContainerEl = this.reportFacetPopUpMenu.element(by.className('popover-content'));

        //panel
        this.facetPopUpContainerPanels = this.reportFacetPopUpMenu.all(by.className('panel'));
        //panel heading which is facet group
        this.PopUpContainerFacetGroup = this.facetPopUpContainerPanels.all(by.tagName('a'));

        //selected Facets
        this.reportSelectedFacets = this.reportFacetMenuContainer.element(by.className('selectedFacets'));
        //facet tokens (token has facetName and facetSelections)
        this.reportFacetTokens = this.reportSelectedFacets.all(by.className('facetToken'));
        //facet name token
        this.reportFacetNameToken = this.reportSelectedFacets.element(by.className('facetNameToken'));
        //facet selections
        this.reportFacetSelections = this.reportFacetTokens.all(by.className('facetSelections'));

        // Loaded Content Div
        this.loadedContentEl = this.reportContainerEl.element(by.className('loadedContent'));
        // Table actions container
        this.tableActionsContainerEl = this.loadedContentEl.element(by.className('tableActionsContainer'));
        // Griddle table
        this.griddleContainerEl = element.all(by.className('griddle-container')).first();
        this.griddleBodyEl = element(by.className('griddle-body'));
        this.griddleTableHeaderEl = this.griddleBodyEl.all(by.tagName('thead'));
        this.griddleColHeaderElList = this.griddleTableHeaderEl.all(by.tagName('span'));
        this.griddleLastColumnHeaderEl = this.griddleColHeaderElList.last();
        this.griddleDataBodyDivEl = this.griddleBodyEl.all(by.tagName('tbody')).first();
        this.griddleRecordElList = this.griddleDataBodyDivEl.all(by.tagName('tr'));

        /**
         * Given a table link element in the leftNav, open the reports menu for that table
         * @param tableLinkEl
         */
        this.openReportsMenu = function(tableLinkEl) {
            e2ePageBase.waitForElement(tableLinkEl).then(function() {
                var hamburgerEl = tableLinkEl.all(by.className('right')).first();
                return hamburgerEl.click();
            });
        };

        /**
         * Function that will open the report group and load the report specified by name
         * @param reportGroup
         * @param reportName
         */
        this.selectReport = function(reportGroup, reportName) {
            // Let the trowser animate
            e2eBase.sleep(browser.params.smallSleep);

            // Expand the Report group
            this.reportGroupElList.filter(function(elem) {
                // Return the element or elements
                return elem.element(by.className('qbPanelHeaderTitleText')).getText().then(function(text) {
                    // Match the text
                    return text === reportGroup;
                });
            }).then(function(filteredElements) {
                // filteredElements is the list of filtered elements (in this case the Report Group div)
                // Check to see if the report group is already expanded (functionality is sticky from prior tests)
                return e2ePageBase.hasClass(filteredElements[0].element(by.className('qbPanelHeaderIcon')), 'rotateUp').then(function(result) {
                    if (result === true) {
                        return filteredElements[0].element(by.className('qbPanelHeaderIcon')).click();
                    }
                });
            });

            // Find and select the report based on name
            //TODO: Break this filter out into a separate function
            this.reportGroupElList.filter(function(elem) {
                // Return the element or elements
                return elem.element(by.className('qbPanelHeaderTitleText')).getText().then(function(text) {
                    // Match the text
                    return text === reportGroup;
                });
            }).then(function(reportGroupElements) {
                reportGroupElements[0].all(by.className('reportLink')).filter(function(elem) {
                    // Return the element or elements
                    return elem.getText().then(function(text) {
                        // Match the text
                        return text === reportName;
                    });
                }).then(function(reportLinkElements) {
                    return reportLinkElements[0].click();
                });
            });
        };

        /**
         * Function that will open the facet group and select the facet Items and verify the checkmark
         * @param facetName
         * @param facetItems is an array
         */
        this.selectFacetAndVerifyChecked = function (facetName, facetItems) {
            var deferred = Promise.pending();
            // Expand the Facet group
            var groups = this.PopUpContainerFacetGroup.map(function (groupName, index) {
                return groupName.getText().then(function (groupText) {
                    if (groupText === facetName && expect(groupName.getAttribute('class'), 'collapsed')) {
                        groupName.click().then(function () {
                            expect(groupName.getAttribute('class'), '', "Facet Group is not expanded");
                        });
                    };
                });
                // Select the Items and verify there is check mark beside item
            }).then(function () {
                //sleep to expand a group
                e2eBase.sleep(browser.params.smallSleep);
                //Select the facet Items
                facetItems.forEach(function (facetItem) {
                    var items = element.all(by.className('list-group-item')).map(function (groupItem, index) {
                        return groupItem.getText().then(function (itemText) {
                            if (index === facetItem) {
                                //before selecting its class attribute should not have selected.
                                expect(groupItem.getAttribute('class')).toMatch("list-group-item");
                                groupItem.click().then(function () {
                                    //After Item selected class attribute should chnage to selected
                                    expect(groupItem.getAttribute('class')).toMatch("selected list-group-item");
                                    // Verify facet container
                                }).then(function () {
                                    //Map all facet tokens from the facet container
                                    var tokens = element.all(by.className('facetSelections')).map(function (tokenName, tokenindex) {
                                        return tokenName.getText().then(function (tokenText) {
                                            console.log("The token text is: " + tokenText + "item text is " + itemText);
                                            expect(tokenText).toMatch(itemText);
                                        });
                                    });
                                });
                            };
                        });
                    });
                });
                return deferred.promise;
            });
        };

        /**
         * Function that will verify the facet tokens i.e facet Name and facet Selections along with the index in facet container.
         * @param facets array
         */
        this.verifyFacetTokens = function(facets) {
            //Map all facet tokens from the facet container
            var tokens = this.reportFacetTokens.map(function(elm, index) {
                return {
                    index: index,
                    text: elm.getText(),
                };
            });
                //verify the facet tokens and its contents along with the index
                expect(tokens).toEqual(facets);
        };

        /**
         * Function that will clear the facet tokens in facet container.
         * @param facets array
         */
        this.clearFacetTokens = function (facetItems) {
            var deferred = Promise.pending();
            //Map all facet tokens from the facet container
            this.reportFacetSelections.map(function (elm) {
            }).then(function () {
                //for all passed parameter facet Items
                facetItems.forEach(function (facetItem) {
                    //map all selected token in the container
                    element.all(by.className('selectedToken')).map(function (Items) {
                        return Items.getText().then(function (itemText) {
                            //verify selected facet text is same as parameter facet text
                            if (itemText === facetItem) {
                                //if equal then remove the selected facet
                                Items.element(by.className('clearFacet')).click();
                            };
                        });
                    });
                });
                }).then(function () {
                    //Map all facet tokens from the facet container
                    element.all(by.className('selectedToken')).map(function (results) {
                        return results.getText().then(function (resultText) {
                            for (var i = 0; i < facetItems.length; i++) {
                                if (resultText !== facetItems[i]) {
                                   // return deferred.promise;
                                };
                            };
                        });

                    });
                });
            return deferred.promise;
        };


        /**
        * Helper function that will get all of the field column headers from the report. Returns an array of strings.
        */
        this.getReportColumnHeaders = function() {
            var deferred = Promise.pending();
            this.griddleColHeaderElList.then(function(elements) {
                var fetchTextPromises = [];
                for (var i = 0; i < elements.length; i++) {
                    // Firefox has innerHTML instead of innerText so use that instead
                    if (browser.browserName === 'firefox') {
                        fetchTextPromises.push(elements[i].getAttribute('innerHTML'));
                    } else {
                        fetchTextPromises.push(elements[i].getAttribute('innerText'));
                    }
                }
                return Promise.all(fetchTextPromises);
            }).then(function(colHeaders) {
                var fieldColHeaders = [];
                colHeaders.forEach(function(headerText) {
                    if (!headerText) {
                        throw Error('Did not find text for column header');
                    }
                    // The getText call above is returning the text value with a new line char on the end, need to remove it
                    var subText = headerText.replace(/(\r\n|\n|\r)/gm, '');
                    if (subText !== 'actions') {
                        fieldColHeaders.push(subText.trim());
                    }
                });
                return fieldColHeaders;
            }).then(function(fieldColHeaders) {
                return deferred.resolve(fieldColHeaders);
            }).then(null, function(error) {
                deferred.reject(error);
                throw error;
            });
            return deferred.promise;
        };

        /**
         * Assertion function that will test the properties of the leftNav
         */
        this.assertNavProperties = function(breakpointSize, open, clientWidth) {
            // Check properties of nav bar
            expect(this.navMenuBodyEl.getAttribute('class')).toMatch(breakpointSize + '-breakpoint');
            if (open) {
                expect(this.navMenuEl.getAttribute('class')).toMatch('open');
                expect(this.navMenuEl.getAttribute('offsetWidth')).toMatch(clientWidth);
            } else {
                expect(this.navMenuEl.getAttribute('class')).toMatch('closed');
                expect(this.navMenuEl.getAttribute('offsetWidth')).toMatch(clientWidth);
            }
        };

        // Click the app list toggle in the leftNav
        this.clickAppToggle = function() {
            var deferred = Promise.pending();
            try {
                this.appToggleDivEl.click().then(function() {
                    // Sleep for a second to allow toggle animation to finish (and the DOM to refresh)
                    e2eBase.sleep(1000);
                    deferred.resolve();
                });
            } catch (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            }
            return deferred.promise;
        };

        // Click the app search toggle in the leftNav
        this.clickAppSearchToggle = function() {
            var deferred = Promise.pending();
            try {
                this.appsSearchIconEl.click().then(function() {
                    // Sleep for a second to allow toggle animation to finish (and the DOM to refresh)
                    e2eBase.sleep(1000);
                    deferred.resolve();
                });
            } catch (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            }
            return deferred.promise;
        };

        // Gets text from the topNav
        this.getGlobalNavTextEl = function(globalNavEl) {
            var textEl = globalNavEl.all(by.tagName('span')).last();
            return textEl;
        };

        // Does element shows up on the Left Nav bar.
        this.isElementInLeftNav = function(element, clientWidth) {
            expect(element.getAttribute('offsetLeft'), '0');
            expect(element.getAttribute('offsetWidth'), clientWidth);
        };

        //Does element shows up on the Top Nav bar.
        this.isElementInTopNav = function(element) {
            expect(element.getAttribute('offsetTop'), '0');
            expect(element.getAttribute('offsetHeight'), '50');
        };
    };
    ReportServicePage.prototype = e2ePageBase;
    module.exports = ReportServicePage;
}());
