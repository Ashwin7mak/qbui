import {AVAILABLE_ICON_FONTS} from "../../../../reuse/client/src/components/icon/icon";
import Locale from "../../../../reuse/client/src/locales/locale";

const GetLeftNavLinks = (isAccountAdmin, isRealmAdmin, isAccountURL, isCSR) => {
    const MyAppsLink = {title: Locale.getMessage('governance.leftNav.myApps'), isDisabled: true, isPrimaryAction: true, secondaryIcon: 'caret-left', href: '/qbase/apps'};
    const ManageBillingLink = {icon: 'currency', title: Locale.getMessage('governance.leftNav.manageBilling'), isDisabled: true};
    const ContactSupportLink = {icon: 'bell', title: Locale.getMessage('governance.leftNav.contactSupport'), iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY, isDisabled: true};
    const ManageUsersLink =  {icon: 'users', title: Locale.getMessage('governance.leftNav.manageUsers'), isSelected: true};

    const AccountAdminLinks = [
        {icon: 'report-table', title: Locale.getMessage('governance.leftNav.accountSummary'), isDisabled: true},
        {icon: 'favicon', title: Locale.getMessage('governance.leftNav.manageApps'), isDisabled: true},
        ManageUsersLink,
        {icon: 'Group', title: Locale.getMessage('governance.leftNav.manageGroups'), iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY,  isDisabled: true},
        {icon: 'configure', title: Locale.getMessage('governance.leftNav.setAccountProperties'), isDisabled: true},
    ];

    const RealmAdminLinks = [
        {icon: 'selected', title: Locale.getMessage('governance.leftNav.setRealmPolicies'), isDisabled: true},
        {icon: 'Fountain_Pen', title: Locale.getMessage('governance.leftNav.editRealmBranding'), iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY, isDisabled: true},
    ];
    if (isCSR || (isAccountAdmin && isRealmAdmin && !isAccountURL)) {
        // User is CSR or User is Account + Realm Admin (in an Enterprise Realm)
        return [MyAppsLink, ...AccountAdminLinks, ...RealmAdminLinks, ManageBillingLink, ContactSupportLink];
    } else if (isAccountAdmin) {
        // User is Account Admin
        return [MyAppsLink, ...AccountAdminLinks, ManageBillingLink, ContactSupportLink];
    } else {
        // User is Realm Admin
        return [MyAppsLink, ManageUsersLink,  ...RealmAdminLinks, ContactSupportLink];
    }
};

export default GetLeftNavLinks;
