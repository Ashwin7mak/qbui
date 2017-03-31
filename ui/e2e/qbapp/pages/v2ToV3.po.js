/**
 * Created by skamineni on 12/5/16.
 */
(function() {
    'use strict';

    //page objects
    var ReportServicePage = requirePO('reportService');
    var reportServicePO = new ReportServicePage();

    //Bluebird Promise library
    var Promise = require('bluebird');
    var e2ePageBase = require('./../../common/e2ePageBase');
    var v2Tov3Transition = function() {
        //get all user menu items
        this.userMenuListItems = reportServicePO.topNavGlobalActionsListUlEl.element(by.className('dropdown-menu')).all(by.tagName('a'));

        //Admin V2 to V3 popup
        this.popUpFooter = element(by.id('content')).element(by.className('popupFooter'));
        this.popUpTitle = this.popUpFooter.element(by.className('popupFooterTitle'));
        this.popUpTitleLabel = this.popUpTitle.element(by.className('popupFooterTitleLabel'));
        this.manageUserAccessToMercuryToggle = this.popUpTitle.element(by.className('iconUISturdy-caret-down'));

        //elements inside popup
        this.popUpPanelTitle = this.popUpFooter.element(by.className('popupFooterMain')).element(by.className('v2v3radioTitle'));
        this.openInClassic = this.popUpFooter.element(by.className('popupFooterMain')).element(by.className('openInClassic'));
        this.openInMercury = this.popUpFooter.element(by.className('popupFooterMain')).element(by.className('openInMercury'));

        //switch back to mercury elements
        this.signInAsButtonInCurrentStack = element(by.id('signedInAsButton'));
        this.signInAsButtonDropDown = this.signInAsButtonInCurrentStack.element(by.className('BlueCaret'));
        this.signInMenu = element(by.id('signedInAsMenu'));
        this.switchToMercuryLinkInCurrentStack = this.signInMenu.element(by.id('switchToMercuryLink'));



        //Select the User menu item
        this.clickUserMenuItem = function(menuItemName) {
            var self = this;
            return reportServicePO.topNavUserGlobActEl.click().then(function() {
                // wait until the User dropDown in open
                return e2ePageBase.waitForElement(reportServicePO.topNavUserGlobActEl.element(by.className('open'))).then(function() {
                    //get the listItems from the drop down menu and filter their text
                    return self.userMenuListItems.filter(function(elm) {
                        return elm.getAttribute('textContent').then(function(text) {
                            return text === menuItemName;
                        });
                    }).then(function(filteredMenuItem) {
                        return filteredMenuItem[0].click().then(function() {
                            //wait until url changes
                            return e2eBase.sleep(browser.params.smallSleep);
                        });
                    });
                });
            });
        };

        //Verify item not in User menu items
        this.verifyUserMenuItem = function(menuItemName) {
            var self = this;
            return reportServicePO.topNavUserGlobActEl.click().then(function() {
                // wait until the User dropDown in open
                return e2ePageBase.waitForElement(reportServicePO.topNavUserGlobActEl.element(by.className('open'))).then(function() {
                    //get the listItems from the drop down menu and filter their text
                    return self.userMenuListItems.filter(function(elm) {
                        return elm.getAttribute('textContent').then(function(text) {
                            return text !== menuItemName;
                        });
                    });
                });
            });
        };

        //Click the Manage User Access To Mercury Toggle
        this.clickManageUserAccessToggle = function() {
            var self = this;
            return e2ePageBase.waitForElement(self.popUpTitle).then(function() {
                expect(self.popUpTitle.element(by.className('popupFooterTitleLabel')).getAttribute('textContent')).toBe('Manage user access to Mercury');
                return self.manageUserAccessToMercuryToggle.click().then(function() {
                    //wait until popup is open
                    return element(by.id('content')).element(by.className('open'));
                });
            });
        };

        //Click the open in classic Toggle
        this.clickOpenInClassicToggle = function() {
            var self = this;
            expect(self.popUpPanelTitle.getAttribute('textContent')).toBe('My users will open this app in');
            return self.openInClassic.click().then(function() {
                //wait until value of radio is true after selecting radio
                return expect(self.openInClassic.element(by.tagName('input')).getAttribute('checked')).toBe('true');
            });
        };

        //Click the open in mercury Toggle
        this.clickOpenInMercuryToggle = function() {
            var self = this;
            expect(self.popUpPanelTitle.getAttribute('textContent')).toBe('My users will open this app in');
            return self.openInMercury.click().then(function() {
                //wait until value of radio is true after selecting radio
                return expect(self.openInMercury.element(by.tagName('input')).getAttribute('checked')).toBe('true');
            });
        };

        //Click on switch to mercury in current stack
        this.clickSwitchToMercuryLink = function() {
            var self = this;
            return e2ePageBase.waitForElement(self.signInAsButtonInCurrentStack).then(function() {
                return self.signInAsButtonDropDown.click().then(function() {
                    return e2ePageBase.waitForElement(self.signInMenu);
                }).then(function() {
                    return self.switchToMercuryLinkInCurrentStack.click();
                });
            });
        };

    };
    v2Tov3Transition.prototype = e2ePageBase;
    module.exports = v2Tov3Transition;
}());
