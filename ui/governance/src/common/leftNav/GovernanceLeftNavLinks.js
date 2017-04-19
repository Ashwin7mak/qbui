import {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';

const MyAppsLink = {icon: 'home', title: 'MY APPS', isPrimaryAction: true, secondaryIcon: 'caret-left', href: '/qbase/apps'};
const ManageBillingLink = {icon: 'currency', title: 'Manage Billing', isDisabled: true};
const ContactSupportLink = {icon: 'bell', title: 'Contact Support', iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY, isDisabled: true};
const ManageUsersLink =  {icon: 'users', title: 'Manage Users', isSelected: true};

const AccountAdminLinks = [
    {icon: 'Report', title: 'Account Summary', iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY,  isDisabled: true},
    {icon: 'favicon', title: 'Manage Apps', isDisabled: true},
    ManageUsersLink,
    {icon: 'Group', title: 'Manage Groups', iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY,  isDisabled: true},
    {icon: 'configure', title: 'Set Account Properties', isDisabled: true},
];

const RealmAdminLinks = [
    {icon: 'selected', title: 'Set Realm Policies', isDisabled: true},
    {icon: 'Fountain_Pen', title: 'Edit Realm Branding', iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY, isDisabled: true},
];

const GetLeftNavLinks = (isAccountAdmin, isRealmAdmin, isAccountURL) => {
    if (isAccountAdmin && isRealmAdmin && !isAccountURL) {
        return [MyAppsLink, ...AccountAdminLinks, ...RealmAdminLinks, ManageBillingLink, ContactSupportLink];
    } else if (isAccountAdmin) {
        return [MyAppsLink, ...AccountAdminLinks, ManageBillingLink, ContactSupportLink];
    } else {
        return [MyAppsLink, ManageUsersLink,  ...RealmAdminLinks, ContactSupportLink];
    }
};

export default GetLeftNavLinks;
