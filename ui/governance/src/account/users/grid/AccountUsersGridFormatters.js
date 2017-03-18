import moment from 'moment';

// Realm/User/Account Flag constants
const DeactivatedFlag = 0x00000040;
const DeniedFlag = 0x0008;
const CanCreateAppFlag = 0x0004;
const RealmApprovedFlag = 0x0004;
const RegisteredFlag = 0x0010;

// Helper Flag Functions
const HasFlag = (bits, flag) => (bits & flag) !== 0;
const IsDeactivated = userInfo => HasFlag(userInfo.userBasicFlags, DeactivatedFlag);
const IsDenied = userInfo => HasFlag(userInfo.realmDirectoryFlags, DeniedFlag);
const CanCreateApps = userInfo => HasFlag(userInfo.accountTrusteeFlags, CanCreateAppFlag);
const IsApprovedInRealm = userInfo => HasFlag(userInfo.realmDirectoryFlags, RealmApprovedFlag);
const HasAnyRealmPermissions = userInfo => userInfo.realmDirectoryFlags !== 0;
const HasAnySystemPermissions = userInfo => userInfo.systemRights !== 0;

// Render Helpers
const IsTimeNull = timeStr => timeStr === '1900-01-01T00:00:00Z';
const RenderBoolColumn = bool => bool ? 'Y' : '--';

// Start of Formatters
export const FormatUserStatusText = (hasAppAccess, cellInfo) => {
    if (IsDeactivated(cellInfo.rowData)) {
        return "Deactivated";
    } else if (IsDenied(cellInfo.rowData)) {
        return "Denied";
    } else if (HasAnySystemPermissions(cellInfo.rowData)) {
        return "QuickBase Staff";
    } else if (hasAppAccess) {
        return "Paid Seat";
    } else {
        return "No App Access";
    }
};

export const FormatIsInactive = (lastAccessString, cellInfo) => {
    if (IsTimeNull(lastAccessString)) {
        return RenderBoolColumn(false);
    } else {
        const daysSinceLastAccess = moment().diff(lastAccessString, 'days');
        return RenderBoolColumn(daysSinceLastAccess >= 180);
    }
};

export const FormatLastAccessString = (lastAccessString, cellInfo) => IsTimeNull(lastAccessString) ? 'never' : moment(lastAccessString).format("MMMM D YYYY");
export const FormatIsGroupMember = (numGroupsMember, cellInfo) => RenderBoolColumn(numGroupsMember > 0);
export const FormatIsGroupManager = (numGroupsManaged, cellInfo) => RenderBoolColumn(numGroupsManaged > 0);
export const FormatCanCreateApps = (accountTrusteeFlags, cellInfo) => RenderBoolColumn(CanCreateApps(cellInfo.rowData));
export const FormatIsAppManager = (numAppsManaged, cellInfo) => RenderBoolColumn(numAppsManaged > 0);
export const FormatIsInRealmDirectory = (flags, cellInfo) => RenderBoolColumn(HasAnyRealmPermissions(cellInfo.rowData));
export const FormatIsRealmApproved = (flags, cellInfo) => RenderBoolColumn(IsApprovedInRealm(cellInfo.rowData));
