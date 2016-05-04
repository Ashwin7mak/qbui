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
    var SHOW_POPUP_LIST_LIMIT = 5;

    var ReportFacetsPage = function() {

        // Report facet Menu Container
        this.reportFacetMenuContainer = element(by.className('facetsMenuContainer'));
        // Report facet buttons
        this.reportFacetBtns = this.reportFacetMenuContainer.element(by.className('facetButtons'));
        // Report facet filter button
        this.reportFacetFilterBtn = this.reportFacetBtns.element(by.className('filterButton'));
        // Report facet filter carat button
        this.reportFacetFilterBtnCaret = this.reportFacetBtns.element(by.className('filterButtonCaret'));

        // Facet Menu Popup
        this.reportFacetPopUpMenu = element(by.className('facetMenuPopup'));
        // Unselected Facet Groups
        this.unselectedFacetGroupsElList = this.reportFacetPopUpMenu.all(by.className('panel'));
        // Selected Facet Groups
        this.selectedFacetGroupsElList = this.reportFacetPopUpMenu.all(by.className('selections'));

        // Selected Facets
        this.reportSelectedFacets = this.reportFacetMenuContainer.element(by.className('selectedFacets'));
        // Facet tokens (token has facetName and facetSelections)
        this.reportFacetTokens = this.reportSelectedFacets.all(by.className('facetToken'));
        // Facet selections
        this.reportFacetSelections = this.reportFacetTokens.all(by.className('facetSelections'));
        // Facet selections Names
        this.reportFacetNameSelections = this.reportFacetSelections.all(by.className('selectedToken'));
        // Facet clear token selections
        this.reportFacetClearTokenSelections = this.reportFacetNameSelections.all(by.className('clearFacet'));

        /*
         * Function will get you the facet header for a facet group element
         */
        this.getFacetGroupTitle = function(facetGroupElement) {
            return facetGroupElement.element(by.className('panel-title'));
        };

        /*
         * Function will get you all the facet selections (buttons) for a facet group element
         */
        this.getAvailableFacetGroupSelections = function(facetGroupElement) {
            return facetGroupElement.all(by.tagName('button'));
        };


        /*
         * Function will return you the facet group element by name
         */
        this.getFacetGroupElement = function(facetGroupName) {
            var self = this;
            return e2ePageBase.waitForElementToBeClickable(this.reportFacetPopUpMenu).then(function() {
                // First look through unselected facet groups
                return self.unselectedFacetGroupsElList.filter(function(elem) {
                    // Return the element or elements
                    return e2ePageBase.waitForElementToBeClickable(elem.element(by.className('panel-heading'))).then(function() {
                        return elem.element(by.className('panel-heading')).getText().then(function(text) {
                            // Match the text
                            return text.indexOf(facetGroupName) > -1;
                        });
                    });
                }).then(function(filteredElements) {
                    // If we didn't find it look through the selected groups
                    if (filteredElements.length === 0) {
                        return self.selectedFacetGroupsElList.filter(function(elem) {
                            // Return the element or elements
                            return elem.element(by.className('panel-heading')).getText().then(function(text) {
                                // Match the text
                                return text.indexOf(facetGroupName) > -1;
                            });
                        }).then(function(filteredElements2) {
                            return filteredElements2[0];
                        });
                    }
                    return filteredElements[0];
                });
            });
        };

        /*
         * Function will click on the facet group element
         */
        this.clickFacetGroupElement = function(facetGroupName) {
            var self = this;
            return self.getFacetGroupElement(facetGroupName).then(function(facetGroupElement) {
                return e2ePageBase.waitForElementToBeClickable(facetGroupElement).then(function() {
                    // Only click if the panel is collapsed
                    return facetGroupElement.element(by.className('panel-collapse')).getAttribute('offsetHeight').then(function(height) {
                        if (height === '0') {
                            return e2ePageBase.waitForElement(facetGroupElement).then(function() {
                                return facetGroupElement.click().then(function() {
                                    return facetGroupElement;
                                });
                            });
                        } else {
                            return facetGroupElement;
                        }
                    });
                });
            });
        };

        /*
         * Function will click on the specified facet indexes for the facet group
         */
        this.selectFacets = function(facetGroupElement, facetIndexes) {
            var self = this;
            // First check to see click on more options link if items to select is greater than 5
            facetIndexes.forEach(function(facetIndex) {
                if (facetIndex >= SHOW_POPUP_LIST_LIMIT) {
                    // Click on more options link
                    e2ePageBase.waitForElementToBeClickable(facetGroupElement.element(by.className('listMore'))).then(function() {
                        facetGroupElement.element(by.className('listMore')).click();
                    });
                }
            });

            // Select the facet Items
            self.getAvailableFacetGroupSelections(facetGroupElement).then(function(buttons) {
                facetIndexes.forEach(function(facetIndex) {
                    for (var i = 0; i < buttons.length; i++) {
                        // Click the facet item that matches the test argument value
                        if (i === facetIndex) {
                            var buttonEl = buttons[i];
                            // If the facet is not already selected then click
                            e2ePageBase.waitForElementToBeClickable(buttonEl).then(function() {
                                buttonEl.element(by.className('checkMark-selected')).isPresent().then(function(present) {
                                    if (!present) {
                                        // Click the item
                                        e2ePageBase.waitForElementToBeClickable(buttonEl).then(function() {
                                            buttonEl.click().then(function() {
                                                e2ePageBase.waitForElementToBeStale(buttonEl.element(by.className('checkMark')));
                                            });
                                        });
                                    }
                                });
                            });
                        }
                    }
                });
            });
        };

        /**
         * Function that will open the facet group (facetName) and select the facet Items
         * @param facetGroupName
         * @param facetIndexes is an array of facet selections
         */
        this.selectGroupAndFacetItems = function(facetGroupName, facetIndexes) {
            var self = this;
            // Expand the Facet group
            this.clickFacetGroupElement(facetGroupName).then(function(facetGroupElement) {
                // Select the facet Items
                self.selectFacets(facetGroupElement, facetIndexes);
            });

            // Get all Selected items from popup and push into an array for verification
            return this.reportFacetPopUpMenu.all(by.className('selected')).map(
                function(selectedGroupItem, index) {
                    return e2ePageBase.waitForElement(selectedGroupItem).then(function() {
                        return selectedGroupItem.getText();
                    });
                }
            );
        };

        /*
         * Function will click the clear all facets icon for a facet group element
         */
        this.clickClearAllFacetsIcon = function(facetGroupElement) {
            return this.getFacetGroupTitle(facetGroupElement).element(by.className('clearFacet')).click();
        };

        /**
         * Function that will clear all the facet tokens from the container.
         *
         */
        this.clearFacetTokensFromContainer = function() {
            return e2ePageBase.waitForElement(element(by.className('facetSelections'))).then(function() {
                element.all(by.className('selectedToken')).then(function(items) {
                    for (var i = (items.length) - 1; i >= 0; --i) {
                        items[i].element(by.className('clearFacet')).click().then(function() {
                            //TODO: Figure out how to handle with sleeps (waiting for element to be stale doesn't seem to work)
                            e2eBase.sleep(browser.params.smallSleep);
                        });
                    }
                });
            });
        };

    };
    ReportFacetsPage.prototype = e2ePageBase;
    module.exports = ReportFacetsPage;
}());
