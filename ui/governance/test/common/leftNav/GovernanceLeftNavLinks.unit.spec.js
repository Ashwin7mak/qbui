import GetLeftNavLinks from '../../../src/common/leftNav/GovernanceLeftNavLinks';
import GovernanceBundleLoader from '../../../src/locales/governanceBundleLoader';

describe('GetLeftNavLinks', () => {
    const AccountAdminLinkNames = ['MY APPS', 'Account Summary', 'Manage Apps', 'Manage Users', 'Manage Groups',
        'Set Account Properties', 'Manage Billing', 'Contact Support'];

    const RealmAdminLinkNames = ['MY APPS', 'Manage Users', 'Set Realm Policies',
        'Edit Realm Branding', 'Contact Support'];

    const AllLinkNames = ['MY APPS', 'Account Summary', 'Manage Apps', 'Manage Users', 'Manage Groups',
        'Set Account Properties', 'Set Realm Policies', 'Edit Realm Branding', 'Manage Billing', 'Contact Support'];

    const assertCorrectLink = (actual, expected) => {
        expect(actual.map((elem) => elem.title)).toEqual(expected);
    };

    beforeEach(() => {
        GovernanceBundleLoader.changeLocale('en-us');
    });

    it("should retrieve the correct links for Account Admin for either AccountURL or Enterprise Realm", ()=> {
        // AccountURL Realm
        assertCorrectLink(GetLeftNavLinks(true, false, true), AccountAdminLinkNames);
        // Enterprise Realm
        assertCorrectLink(GetLeftNavLinks(true, false, false), AccountAdminLinkNames);
    });

    it("should retrieve the correct links for Realm Admin in an Enterprise Realm", ()=> {
        assertCorrectLink(GetLeftNavLinks(false, true, false), RealmAdminLinkNames);
    });

    it("should retrieve the all links for Account Admin and Realm Admin in Enterprise Realm", ()=> {
        assertCorrectLink(GetLeftNavLinks(true, true, false), AllLinkNames);
    });

    // Weird Edge case: If you downgrade from an Enterprise Realm to a
    // AccountURL realm, user may still be a Realm Admin
    it("should retrieve the correct links for Account Admin and Realm Admin in AccountURL Realm", ()=> {
        assertCorrectLink(GetLeftNavLinks(true, true, true), AccountAdminLinkNames);
    });
});
