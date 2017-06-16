/**
 * This file uses the Page Object pattern to define leftNav page for test
 * cperikal 5/16/2017
 */
(function() {
    'use strict';
    // Import the base page object
    var e2ePageBase = requirePO('./e2ePageBase');

    module.exports = Object.create(e2ePageBase, {

        // Left Nav caret element
        leftNavCaretUpEl: {
            get: function() {
                browser.element('.appsToggleArea .iconUISturdy-caret-up').waitForVisible();
                return browser.element('.appsToggleArea .iconUISturdy-caret-up');
            }
        },
        // Left nav search element
        leftNavSearchEl: {
            get: function() {
                browser.element('.transitionGroup .heading .iconUISturdy-search').waitForVisible();
                return browser.element('.transitionGroup .heading .iconUISturdy-search');
            }
        },
        // Left nav search input box
        leftNavSearchInputBox: {
            get: function() {
                browser.element('.transitionGroup .search .searchInput ').waitForVisible();
                return browser.element('.transitionGroup .search .searchInput ');
            }
        },
        // Left nav mini clear button in search box
        leftNavClearSearchEl: {
            get: function() {
                browser.element('.transitionGroup .searchInputBox .searchIcon ').waitForVisible();
                return browser.element('.transitionGroup .searchInputBox .searchIcon ');
            }
        },
        // Left nav new table element
        leftNavNewTableEl:{
            get: function() {
                browser.element('.newItemButton .iconUISturdy-add-new-stroke').waitForVisible();
                return browser.element('.newItemButton .iconUISturdy-add-new-stroke');
            }
        },
        // Left nav new table cancle button
        leftNavNewTableCancelBu:{
            get: function() {
                browser.element('.modal-footer .buttons .cancelButton').waitForVisible();
                return browser.element('.modal-footer .buttons .cancelButton');
            }
        },
        // Left nav brand logo
        leftNavBrandLogo:{
            get: function() {
                browser.element('.branding').waitForVisible();
                return browser.element('.branding');
            }
        },
        // Left nav tables list
        leftNavTablesList:{
            get: function() {
                browser.element('.transitionGroup .tablesList .link').waitForVisible();
                return browser.elements('.transitionGroup .tablesList .link');
            }
        },
        // Left nav new table fields
        leftNavNewTableFields:{
            get: function() {
                browser.element('.modal-body .tableField .tableFieldInput').waitForVisible();
                return browser.elements('.modal-body .tableField .tableFieldInput');
            }
        },
        // Left nav new table dropdown icon button
        leftNavNewTableIconSelect:{
            get: function() {
                browser.element('.modal-body .tableField .iconChooser').waitForVisible();
                return browser.element('.modal-body .tableField .iconChooser');
            }
        },
        // Left nav mini report icon beside table name
        leftNavMiniReportIcon: {
            get: function() {
                browser.element('.tablesList .right .iconUISturdy-report-menu-3').waitForVisible();
                return browser.element('.tablesList .right .iconUISturdy-report-menu-3');
            }
        },
        // Left nav top links
        leftNavTopLinks:{
            get: function() {
                browser.element('.leftNav .topLinks .link').waitForVisible();
                return browser.elements('.leftNav .topLinks .link');
            }
        },
        // Left nav table name
        leftNavTableName:{
            get: function() {
                browser.element('.leftNav .tablesList .leftNavLabel').waitForVisible();
                return browser.element('.leftNav .tablesList .leftNavLabel');
            }
        },
        leftNavAppsList:{
            get: function() {
                browser.element('.leftNav .appsList .leftNavLabel').waitForVisible();
                return browser.elements('.leftNav .appsList .leftNavLabel');
            }
        },

        /**
         * Method to click on leftNav search
         */
        clickLeftNavSearch : {value: function() {
            this.leftNavSearchEl.waitForVisible();
            return this.leftNavSearchEl.click();
        }},

        /**
         * Method to click on leftNav appLists Carat
         */
        clickLeftNavAppListCarat : {value: function() {
            //Verify if the left nav caret up element is visible
            this.leftNavCaretUpEl.waitForVisible();
            //Verify if the left nav caret up element is clickable
            return this.leftNavCaretUpEl.click();
        }},

        /**
         * Verify topLinks in leftNav
         */
        verifyTopLinksInLeftNav : {value: function() {
            browser.element('.topLinks').waitForVisible();
            //filter table names from leftNav links
            let results = [];
            browser.elements('.topLinks .leftNavLabel span').value.map(function(topLink) {
                results.push(topLink.getAttribute('textContent'));
            });
            expect(results).toEqual(['Home', 'Users']);
        }}

    });
}());
