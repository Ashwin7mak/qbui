import React from "react";
import jasmineEnzyme from "jasmine-enzyme";
import {GetFacetFields} from "../../../../src/account/users/grid/AccountUsersGridFacet";
import _ from "lodash";
import Locale from "../../../../../reuse/client/src/locales/locale";
import GovernanceBundleLoader from "../../../../src/locales/governanceBundleLoader";

export const FACET_FIELDID = {
    QUICKBASE_USER_STATUS : 0,
    QUICKBASE_ACCESS_STATUS : 1,
    INGROUP : 5,
    GROUPMANAGER:6
};

describe('Faceting Fields Values', () => {

    it('gets the facets based on QuickBase access status', () => {
        expect(GetFacetFields(true, true)[FACET_FIELDID.QUICKBASE_ACCESS_STATUS]).toEqual(
            {
                id:FACET_FIELDID.QUICKBASE_ACCESS_STATUS,
                name: Locale.getMessage("governance.account.users.accessStatus"),
                type: 'TEXT',
                values: [
                    {id:FACET_FIELDID.QUICKBASE_ACCESS_STATUS, value: 'Deactivated'},
                    {id:FACET_FIELDID.QUICKBASE_ACCESS_STATUS, value: 'Denied'},
                    {id:FACET_FIELDID.QUICKBASE_ACCESS_STATUS, value: 'No App Access'},
                    {id:FACET_FIELDID.QUICKBASE_ACCESS_STATUS, value: 'Paid Seat'},
                    {id:FACET_FIELDID.QUICKBASE_ACCESS_STATUS, value: 'Quick Base Staff'}
                ]
            });
    });

    it('gets the facets based on QuickBase user status', () => {
        expect(GetFacetFields(true, true)[FACET_FIELDID.QUICKBASE_USER_STATUS]).toEqual(
            {
                id:FACET_FIELDID.QUICKBASE_USER_STATUS,
                name: Locale.getMessage("governance.account.users.userStatus"),
                type: 'TEXT',
                values: [
                    {id:FACET_FIELDID.QUICKBASE_USER_STATUS, value: 'Registered'},
                    {id:FACET_FIELDID.QUICKBASE_USER_STATUS, value: 'Unregistered'},
                    {id:FACET_FIELDID.QUICKBASE_USER_STATUS, value: 'Unverified'}
                ]
            });
    });

    it('gets the right info for user in group', () => {
        expect(GetFacetFields(true, true)[FACET_FIELDID.INGROUP]).toEqual(
            {
                id:FACET_FIELDID.INGROUP,
                name: Locale.getMessage("governance.account.users.inGroup"),
                type: 'CHECKBOX',
                values: [
                    {id:FACET_FIELDID.INGROUP, value: 'Yes'},
                    {id:FACET_FIELDID.INGROUP, value: 'No'}]
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

    const PERM_AGNOSTIC_FACETS = () => [
        Locale.getMessage("governance.account.users.userStatus"),
        Locale.getMessage("governance.account.users.accessStatus"),
        Locale.getMessage("governance.account.users.paidSeatSingular"),
        Locale.getMessage("governance.account.users.quickbaseStaff")];

    const ACCOUNT_ONLY_FACETS = () => [
        Locale.getMessage("governance.account.users.inactive"),
        Locale.getMessage("governance.account.users.inGroup"),
        Locale.getMessage("governance.account.users.groupManager"),
        Locale.getMessage("governance.account.users.canCreateApps"),
        Locale.getMessage("governance.account.users.appManager")];

    const REALM_ONLY_FACETS = () => [
        Locale.getMessage("governance.account.users.realmDirectoryUsers"),
        Locale.getMessage("governance.account.users.realmApproved")];

    it("should get ONLY the Realm fields", ()=> {
        let realmAdminFacets = GetFacetFields(false, true);
        expect([...PERM_AGNOSTIC_FACETS(), ...REALM_ONLY_FACETS()]).toEqual(_.map(realmAdminFacets, (facet) => facet.name));
    });

    it("should get ONLY the Account fields", ()=> {
        let accountFacets = GetFacetFields(true, false);
        expect([...PERM_AGNOSTIC_FACETS(), ...ACCOUNT_ONLY_FACETS()]).toEqual(_.map(accountFacets, (facet) => facet.name));
    });

    it("should get ALL the fields", ()=> {
        const ALL_FACETS = [...PERM_AGNOSTIC_FACETS(), ...ACCOUNT_ONLY_FACETS(), ...REALM_ONLY_FACETS()];
        let allFacets = GetFacetFields(true, true);
        expect(ALL_FACETS).toEqual(_.map(allFacets, (facet) => facet.name));
    });
});
