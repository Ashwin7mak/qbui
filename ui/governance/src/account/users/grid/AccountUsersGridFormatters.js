import moment from "moment";
import React from "react";
import Icon from "../../../../../reuse/client/src/components/icon/icon";
import * as RealmUserAccountFlagConstants from "../../../common/constants/RealmUserAccountFlagConstants.js";

// Render Helpers
/**
 * SQL in current stack stores the Null time as 1900s
 * @param timeStr
 * @constructor
 */
const IsTimeNull = timeStr => timeStr === '1900-01-01T00:00:00Z';

/**
 * Currently we transform the true/false in UI columns to Y/---
 * @param bool
 * @constructor
 */
const RenderBoolColumn = bool => bool ? 'Y' : '--';

/**
 * Format the Access Status for the User into a readable format
 * @param hasAppAccess
 * @param cellInfo
 * @returns {*}
 * @constructor
 */
export const FormatAccessStatusText = (hasAppAccess, cellInfo) => {
    if (RealmUserAccountFlagConstants.IsDeactivated(cellInfo.rowData)) {
        return "Deactivated";
    } else if (RealmUserAccountFlagConstants.IsDenied(cellInfo.rowData)) {
        return "Denied";
    } else if (RealmUserAccountFlagConstants.HasAnySystemPermissions(cellInfo.rowData)) {
        return "Quick Base Staff";
    } else if (hasAppAccess) {
        return "Paid Seat";
    } else {
        return "No App Access";
    }
};

/**
 * Format the User Status for the User into a readable format
 * @param hasAppAccess
 * @param cellInfo
 * @returns {*}
 * @constructor
 */
export const FormatUserStatusText = (hasAppAccess, cellInfo) => {
    if (RealmUserAccountFlagConstants.IsDeactivated(cellInfo.rowData)) {
        return "Deactivated";
    } else if (RealmUserAccountFlagConstants.IsDenied(cellInfo.rowData)) {
        return "Denied";
    } else if (RealmUserAccountFlagConstants.HasAnySystemPermissions(cellInfo.rowData)) {
        return "Quick Base Staff";
    } else if (RealmUserAccountFlagConstants.IsVerified(cellInfo.rowData)) {
        return "Registered";
    } else if (RealmUserAccountFlagConstants.IsRegistered(cellInfo.rowData)) {
        return "Unverified";
    } else {
        return "Unregistered";
    }
};

export const FormatAccessStatusHTML = (hasAppAccess, cellInfo) => {
    if (RealmUserAccountFlagConstants.IsDeactivated(cellInfo.rowData)) {
        return (<div className="accessStatusLabel deactivated"><span className="deactivatedIcon"><Icon icon="errorincircle-outline"/></span> Deactivated</div>);
    } else if (RealmUserAccountFlagConstants.IsDenied(cellInfo.rowData)) {
        return (<div className="accessStatusLabel denied"><span className="deniedIcon"><Icon icon="deactivate"/></span> Denied</div>);
    } else if (RealmUserAccountFlagConstants.HasAnySystemPermissions(cellInfo.rowData)) {
        return (<div className="accessStatusLabel staff"><span className="staffIcon"><Icon iconFont="iconTableSturdy" icon="User"/></span> Quick Base Staff</div>);
    } else if (hasAppAccess) {
        return (<div className="accessStatusLabel paid"><span className="paidIcon"><Icon icon="currency-dollar"/></span> Paid Seat</div>);
    } else {
        return (<div className="accessStatusLabel none"><span className="noneIcon"><Icon icon="infoincircle-fill"/></span> No App Access</div>);
    }
};



export const FormatIsInactiveBool = (lastAccessString) => {
    if (IsTimeNull(lastAccessString)) {
        return false;
    } else {
        const daysSinceLastAccess = moment().diff(lastAccessString, 'days');
        return daysSinceLastAccess >= 180;
    }
};

export const FormatIsInactive = (lastAccessString, cellInfo) => RenderBoolColumn(FormatIsInactiveBool(lastAccessString));
export const FormatUsernameString = (usrNameString, cellInfo) => cellInfo.rowData.email === cellInfo.rowData.userName ? "" : cellInfo.rowData.userName;
export const FormatLastAccessString = (lastAccessString, cellInfo) => IsTimeNull(lastAccessString) ? 'never' : moment(lastAccessString).format("MMMM D YYYY");
export const FormatIsGroupMember = (numGroupsMember, cellInfo) => RenderBoolColumn(numGroupsMember > 0);
export const FormatIsGroupManager = (numGroupsManaged, cellInfo) => RenderBoolColumn(numGroupsManaged > 0);
export const FormatCanCreateApps = (accountTrusteeFlags, cellInfo) => RenderBoolColumn(RealmUserAccountFlagConstants.CanCreateApps(cellInfo.rowData));
export const FormatIsAppManager = (numAppsManaged, cellInfo) => RenderBoolColumn(numAppsManaged > 0);
export const FormatIsInRealmDirectory = (flags, cellInfo) => RenderBoolColumn(RealmUserAccountFlagConstants.HasAnyRealmPermissions(cellInfo.rowData));
export const FormatIsRealmApproved = (flags, cellInfo) => RenderBoolColumn(RealmUserAccountFlagConstants.IsApprovedInRealm(cellInfo.rowData));
