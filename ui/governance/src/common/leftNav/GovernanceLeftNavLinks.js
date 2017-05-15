import {AVAILABLE_ICON_FONTS} from "../../../../reuse/client/src/components/icon/icon";
import Locale from "../../../../client-react/src/locales/locales";

const GetLeftNavLinks = (isAccountAdmin, isRealmAdmin, isAccountURL) => {
    const MyAppsLink = {icon: 'home', title: Locale.getMessage('governance.leftNav.myApps'), isPrimaryAction: true, secondaryIcon: 'caret-left', href: '/qbase/apps'};
    const ManageBillingLink = {icon: 'currency', title: Locale.getMessage('governance.leftNav.manageBilling'), isDisabled: true};
    const ContactSupportLink = {icon: 'bell', title: Locale.getMessage('governance.leftNav.contactSupport'), iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY, isDisabled: true};
    const ManageUsersLink =  {icon: 'users', title: Locale.getMessage('governance.leftNav.manageUsers'), isSelected: true};

    const AccountAdminLinks = [
        {icon: 'Report', title: Locale.getMessage('governance.leftNav.accountSummary'), iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY,  isDisabled: true},
        {icon: 'favicon', title: Locale.getMessage('governance.leftNav.manageApps'), isDisabled: true},
        ManageUsersLink,
        {icon: 'Group', title: Locale.getMessage('governance.leftNav.manageGroups'), iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY,  isDisabled: true},
        {icon: 'configure', title: Locale.getMessage('governance.leftNav.setAccountProperties'), isDisabled: true},
    ];

    const RealmAdminLinks = [
        {icon: 'selected', title: Locale.getMessage('governance.leftNav.setRealmPolicies'), isDisabled: true},
        {icon: 'Fountain_Pen', title: Locale.getMessage('governance.leftNav.editRealmBranding'), iconFont: AVAILABLE_ICON_FONTS.TABLE_STURDY, isDisabled: true},
    ];
    if (isAccountAdmin && isRealmAdmin && !isAccountURL) {
        return [MyAppsLink, ...AccountAdminLinks, ...RealmAdminLinks, ManageBillingLink, ContactSupportLink];
    } else if (isAccountAdmin) {
        return [MyAppsLink, ...AccountAdminLinks, ManageBillingLink, ContactSupportLink];
    } else {
        return [MyAppsLink, ManageUsersLink,  ...RealmAdminLinks, ContactSupportLink];
    }
};

export default GetLeftNavLinks;
