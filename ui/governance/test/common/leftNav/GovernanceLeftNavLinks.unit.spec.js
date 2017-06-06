import GetLeftNavLinks from "../../../src/common/leftNav/GovernanceLeftNavLinks";
import GovernanceBundleLoader from "../../../src/locales/governanceBundleLoader";

describe('GetLeftNavLinks', () => {
    const AccountAdminLinkNames = ['back to My Apps', 'Account Summary', 'Manage Apps', 'Manage All Users', 'Manage Groups',
        'Set Account Properties', 'Manage Billing', 'Contact Support'];

    const RealmAdminLinkNames = ['back to My Apps', 'Manage All Users', 'Set Realm Policies',
        'Edit Realm Branding', 'Contact Support'];

    const AllLinkNames = ['back to My Apps', 'Account Summary', 'Manage Apps', 'Manage All Users', 'Manage Groups',
        'Set Account Properties', 'Set Realm Policies', 'Edit Realm Branding', 'Manage Billing', 'Contact Support'];

    const assertCorrectLink = (actual, expected) => {
        expect(actual.map((elem) => elem.title)).toEqual(expected);
    };

    const assertEnabledLinks = (actual, expected) => {
        expect(actual.filter(link => !link.isDisabled).map((elem) => elem.title)).toEqual(expected);
    };

    beforeEach(() => {
        GovernanceBundleLoader.changeLocale('en-us');
    });

    it("should retrieve the correct links for Account Admin for either AccountURL or Enterprise Realm", ()=> {
        // AccountURL Realm
        assertCorrectLink(GetLeftNavLinks(true, false, true, false), AccountAdminLinkNames);
        // Enterprise Realm
        assertCorrectLink(GetLeftNavLinks(true, false, false, false), AccountAdminLinkNames);
    });

    it("should retrieve the correct links for Realm Admin in an Enterprise Realm", ()=> {
        assertCorrectLink(GetLeftNavLinks(false, true, false, false), RealmAdminLinkNames);
    });

    it("should retrieve all links for Account Admin and Realm Admin in Enterprise Realm", ()=> {
        assertCorrectLink(GetLeftNavLinks(true, true, false, false), AllLinkNames);
    });

    it("should retrieve links for a CSR", () => {
        assertCorrectLink(GetLeftNavLinks(false, false, false, true), AllLinkNames);
    });

    // Weird Edge case: If you downgrade from an Enterprise Realm to a
    // AccountURL realm, user may still be a Realm Admin
    it("should retrieve the correct links for Account Admin and Realm Admin in AccountURL Realm", ()=> {
        assertCorrectLink(GetLeftNavLinks(true, true, true, false), AccountAdminLinkNames);
    });

    // As of right now all links except 'Manage Users' should be disabled
    it("should disable all the links except for 'Manage Users'", () =>{
        let expected = ['Manage All Users'];
        assertEnabledLinks(GetLeftNavLinks(true, false, true), expected);
        assertEnabledLinks(GetLeftNavLinks(true, false, false), expected);
        assertEnabledLinks(GetLeftNavLinks(false, true, false), expected);
        assertEnabledLinks(GetLeftNavLinks(true, true, true), expected);
    });
});
