/**
 * This file uses the Page Object pattern to define leftNav page for test
 * cperikal 5/16/2017
 */
(function() {
    'use strict';
    module.exports = Object.create(e2ePageBase, {

        // Left Nav caret element
        leftNavCaretUpEl: {
            get: function() {
                return browser.element('.appsToggleArea .iconUISturdy-caret-up');
            }
        },
        // Left nav search element
        leftNavSearchEl: {
            get: function() {
                return browser.element('.transitionGroup .heading .iconUISturdy-search');
            }
        },
        // Left nav search input box
        leftNavSearchInputBox: {
            get: function() {
                return browser.element('.transitionGroup .search .searchInput ');
            }
        },
        // Left nav mini clear button in search box
        leftNavClearSearchEl: {
            get: function() {
                return browser.element('.transitionGroup .searchInputBox .searchIcon ');
            }
        },
        // Left nav new table element
        leftNavNewTableEl:{
            get: function() {
                return browser.element('.newTableItem .iconUISturdy-add-new-stroke');
            }
        },
        // Left nav new table cancle button
        leftNavNewTableCancelBu:{
            get: function() {
                return browser.element('.modal-footer .buttons .cancelButton');
            }
        },
        // Left nav brand logo
        leftNavBrandLogo:{
            get: function() {
                return browser.element('.branding');
            }
        },
        // Left nav tables list
        leftNavTablesList:{
            get: function() {
                return browser.elements('.transitionGroup .tablesList .link');
            }
        },
        // Left nav new table fields
        leftNavNewTableFields:{
            get: function() {
                return browser.elements('.modal-body .tableField .tableFieldInput');
            }
        },
        // Left nav new table dropdown icon button
        leftNavNewTableIconSelect:{
            get: function() {
                return browser.element('.modal-body .tableField .iconChooser');
            }
        },
        // Left nav mini report icon beside table name
        leftNavMiniReportIcon: {
            get: function() {
                return browser.element('.tablesList .right .iconUISturdy-report-menu-3');
            }
        },
        // Left nav top links
        leftNavTopLinks:{
            get: function() {
                return browser.elements('.leftNav .topLinks .link');
            }
        },
        // Left nav table name
        leftNavTableName:{
            get: function() {
                return browser.element('.leftNav .tablesList .leftNavLabel');
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
            let topLinks = browser.elements('.topLinks .leftNavLabel span');
            expect(topLinks[0].getAttribute('textContent')).toEqual('Home');
            expect(topLinks[1].getAttribute('textContent')).toEqual('Users');
        }}

    });
}());
