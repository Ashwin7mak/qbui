import React from "react";
import jasmineEnzyme from "jasmine-enzyme";
import {GetFacetFields} from "../../../../src/account/users/grid/AccountUsersGridFacet";
import _ from "lodash";
import Locale from "../../../../../reuse/client/src/locales/locale";
import GovernanceBundleLoader from "../../../../src/locales/governanceBundleLoader";

const ACCOUNT_USERS_DATA = [
    {
        "uid": 10000,
        "firstName": "Administrator",
        "lastName": "User for default SQL Installation",
        "email": "koala_bumbles@quickbase.com",
        "userName": "administrator",
        "lastAccess": "2017-02-28T19:32:04.223Z",
        "numGroupsMember": 0,
        "numGroupsManaged": 0,
        "hasAppAccess": true,
        "numAppsManaged": 2,
        "userBasicFlags": 24576,
        "accountTrusteeFlags": 0,
        "realmDirectoryFlags": 0,
        "systemRights": -1
    },
    {
        "uid": 30000,
        "firstName": "Zadministrator",
        "lastName": "ZUser for default SQL Installation",
        "email": "Zkoala_bumbles@quickbase.com",
        "userName": "Zadministrator",
        "lastAccess": "2019-02-28T19:32:04.223Z",
        "numGroupsMember": 100,
        "numGroupsManaged": 100,
        "hasAppAccess": false,
        "numAppsManaged": 200,
        "userBasicFlags": 24576,
        "accountTrusteeFlags": 0,
        "realmDirectoryFlags": 0,
        "systemRights": 0
    },
    {
        "uid": 20000,
        "firstName": "FirstNameFilter",
        "lastName": "lastNameFilter",
        "email": "emailFilter@g88.net",
        "userName": "userNameFilter",
        "lastAccess": "1900-01-01T00:00:00Z",
        "numGroupsMember": 0,
        "numGroupsManaged": 1,
        "hasAppAccess": true,
        "numAppsManaged": 0,
        "userBasicFlags": 8192,
        "accountTrusteeFlags": 0,
        "realmDirectoryFlags": 4,
        "systemRights": 0
    }];

describe('Faceting Fields Values', () => {

    it('gets the facets based on Quick Base access status', () => {
        expect(GetFacetFields(true, true)[0]).toEqual(
            {
                id:0,
                name: Locale.getMessage("governance.account.users.accessStatus"),
                type: 'TEXT',
                values: [
                    {id:0, value: 'Deactivated'},
                    {id:0, value: 'Denied'},
                    {id:0, value: 'No App Access'},
                    {id:0, value: 'Paid Seat'},
                    {id:0, value: 'Quick Base Staff'}
                ]
            });
    });

    it('gets the right info for user in group', () => {
        expect(GetFacetFields(true, true)[4]).toEqual(
            {
                id:4,
                name: Locale.getMessage("governance.account.users.inGroup"),
                type: 'CHECKBOX',
                values: [
                    {id:4, value: 'Yes'},
                    {id:4, value: 'No'}]
            });
    });
});

describe('Facet Fields Permissions', () => {
    beforeEach(() => {
        jasmineEnzyme();
        GovernanceBundleLoader.changeLocale('en-us');
    });

    afterEach(() => {
        GovernanceBundleLoader.changeLocale('en-us');
    });

    const PERM_AGNOSTIC_FACETS = [
        Locale.getMessage("governance.account.users.accessStatus"),
        Locale.getMessage("governance.account.users.paidSeatSingular"),
        Locale.getMessage("governance.account.users.quickbaseStaff")];

    const ACCOUNT_ONLY_FACETS = [
        Locale.getMessage("governance.account.users.inactive"),
        Locale.getMessage("governance.account.users.inGroup"),
        Locale.getMessage("governance.account.users.groupManager"),
        Locale.getMessage("governance.account.users.canCreateApps"),
        Locale.getMessage("governance.account.users.appManager")];

    const REALM_ONLY_FACETS = [
        Locale.getMessage("governance.account.users.realmDirectoryUsers"),
        Locale.getMessage("governance.account.users.realmApproved")];

    it("should get ONLY the Realm fields", ()=> {
        let realmAdminFacets = GetFacetFields(false, true);
        expect([...PERM_AGNOSTIC_FACETS, ...REALM_ONLY_FACETS]).toEqual(_.map(realmAdminFacets, (facet) => facet.name));
    });

    it("should get ONLY the Account fields", ()=> {
        let accountFacets = GetFacetFields(true, false);
        expect([...PERM_AGNOSTIC_FACETS, ...ACCOUNT_ONLY_FACETS]).toEqual(_.map(accountFacets, (facet) => facet.name));
    });

    it("should get ALL the fields", ()=> {
        const ALL_FACETS = [...PERM_AGNOSTIC_FACETS, ...ACCOUNT_ONLY_FACETS, ...REALM_ONLY_FACETS];
        let allFacets = GetFacetFields(true, true);
        expect(ALL_FACETS).toEqual(_.map(allFacets, (facet) => facet.name));
    });
});
