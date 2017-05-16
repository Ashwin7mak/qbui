/**
 * This file uses the Page Object pattern to define topNav page for test
 * cperikal 4/18/2017
 */
(function() {
    'use strict';
    module.exports = Object.create(e2ePageBase, {
        // Top Nav search element
        leftNavCaretUpEl: {
            get: function() {
                return browser.element('.appsToggleArea .iconUISturdy-caret-up');
            }
        },
        leftNavSearchEl: {
            get: function() {
                return browser.element('.transitionGroup .iconUISturdy-search');
            }
        },
        leftNavSearchInputBox: {
            get: function() {
                return browser.element('.transitionGroup .search .searchInput ');
            }
        },
        leftNavClearSearchEl: {
            get: function() {
                return browser.element('.transitionGroup .searchInputBox .searchIcon ');
            }
        },
        leftNavNewTableEl:{
            get: function() {
                return browser.element('.newTableItem .iconUISturdy-add-new-stroke');
            }
        },
        leftNavNewTableCancelBu:{
            get: function() {
                return browser.element('.modal-footer .buttons .cancelButton');
            }
        },
        leftNavBrandLogo:{
            get: function() {
                return browser.element('.branding');
            }
        },
        leftNavTablesList:{
            get: function() {
                return browser.elements('.transitionGroup .tablesList .link');
            }
        },
        leftNavNewTableField:{
            get: function() {
                return browser.elements('.modal-body .tableField .tableFieldInput');
            }
        },
        leftNavNewTableIconSelect:{
            get: function() {
                return browser.element('.modal-body .tableField .iconChooser');
            }
        },
        leftNavMiniReportIcon: {
            get: function() {
                return browser.element('.tablesList .right .iconUISturdy-report-menu-3');
            }
        },
        // leftNavMiniReportClose:{
        //     get: function() {
        //         return browser.element(' .trowser .trowserHeader .rightIcons ');
        //     }
        // },
        leftNavTopLinks:{
            get: function() {
                return browser.elements('.leftNav .topLinks .link');
            }
        },
        leftNavTableName:{
            get: function() {
                return browser.element('.leftNav .tablesList .leftNavLabel');
            }
        },

    });
}());
