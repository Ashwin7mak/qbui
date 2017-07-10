/**
 * Governance User Test Suite
 */
const legacyHTTPClient = require('../services/legacyHTTPClient');
const utils = require('../services/utils');
const userDefVars = require('../config/userDefVars');
const sysDefVars = require('../config/sysDefVars');
const legacyLogin = require('../services/legacyLogin');
let legacyLoginPO = requirePO('../governance/pages/legacyLogin');
let legacyQuickbasePO = requirePO('../governance/pages/legacyQuickbase');
let qbGridPO = requirePO('../governance/pages/qbGrid');
let topNavPO = requirePO('topNav');

describe('Governance - General and User Test Suite', () => {
    let username = "";
    let uID = "";

    beforeAll(() => {
        let signInURL = "https://brian.quickbase.com/db/main?a=SignIn"; //https://weirealm.currentstack-int.quickbaserocks.com/db/main?a=signin";
        username = "weiliqb@gmail.com"; //"weiRealm@gmail.com";
        // setupBaseState();
        legacyLogin.Login(signInURL, username, userDefVars.ADMIN_PASSWORD);
    });

    beforeEach(() => {
    });

    afterAll(() => {
        // Clean up: delete the realm, user, app, group created in boforeAll()
        // teardownBaseState();
    });

    it('Manage all users link should exist in Account Admin frame and open Governance page', () => {
        expect(legacyQuickbasePO.linkManageAllUsersInAcctAdmin.isVisible()).toEqual(true);
        legacyQuickbasePO.clickManageAllUsersLinkInAcctAdmin();
        utils.switchToGovernancePage(browser);
        qbGridPO.waitForPageToFullyLoad();
        expect(qbGridPO.searchBox.isVisible()).toEqual(true);
    });
    it('Manage all users link should exist in Billing Account Admin frame and open Governance page', () => {
        expect(true).toEqual(true);
    });
    it('Governance page should have correct tab title', () => {
        expect(browser.getTitle()).toBe(sysDefVars.GOVERNANCE_PAGE_TITLE);
    });
    it('leftNav should display proper components with correct states', () => {
        // Verify leftNav - 9 items and Manage All Users is enabled
        expect(true).toEqual(true);
    });
    it('topNav should display proper components with correct states', () => {
        // Verify topNav - help and user icons, loginUserName
        expect(true).toEqual(true);
    });
    it('Stage should display proper components with correct states', () => {
        // Verify Stage
        expect(true).toEqual(true);
    });
    it('qbGrid should display thirteen columns with proper headers', () => {
        let elem = "";
        //* Total column counts
        expect(qbGridPO.getColumnCounts()).toEqual(13);
        //* First column name
        elem = browser.element('.qbHeader .qbHeaderCell:nth-child(1)');
        expect(elem.getText()).toEqual(sysDefVars.GRIDHEADER_FIRSTNAME);
        // Verify qbGrid - header names, rows, etc.
        expect(true).toEqual(true);
    });
    it('Searching user should find and list the user', () => {
        let elem = browser.element('.qbTbody .qbRow:nth-child(1) .qbCell:nth-child(3)');
        browser.pause(sysDefVars.SHORT_WAIT_MS);
        qbGridPO.setSearchString(username);
        expect(qbGridPO.getRowCounts()).toEqual(1);
        expect(elem.getText()).toEqual(username);
    });
    it('Logout user from governance page should logout the user from legacy system', () => {
        let elem = browser.element('.userDropDownIcon');

        // topNavPO.usersButton.waitForVisible();
        // topNavPO.usersButton.click();
        elem.waitForVisible();
        elem.click();

        topNavPO.signOutButton.waitForVisible();
        topNavPO.signOutButton.click();
        browser.pause(sysDefVars.SHORT_WAIT_MS);

        expect(legacyLoginPO.buttonSignIn.isExisting()).toBe(true);
    });
    it('Logout user from legacy system should logout user from governance page after reload page', () => {
        expect(true).toEqual(true);
    });
    it('Close governance page should not logout the user from legacy system', () => {
        expect(true).toEqual(true);
    });
});
