import moment from 'moment';
import React from 'react';
import Icon from '../../../../../reuse/client/src/components/icon/icon';
import * as RealmUserAccountFlagConstants from "../../../common/constants/RealmUserAccountFlagConstants.js";

// Render Helpers
const IsTimeNull = timeStr => timeStr === '1900-01-01T00:00:00Z';
const RenderBoolColumn = bool => bool ? 'Y' : '--';

// Start of Formatters
export const FormatUserStatusText = (hasAppAccess, cellInfo) => {
    if (RealmUserAccountFlagConstants.IsDeactivated(cellInfo.rowData)) {
        return "Deactivated";
    } else if (RealmUserAccountFlagConstants.IsDenied(cellInfo.rowData)) {
        return "Denied";
    } else if (RealmUserAccountFlagConstants.HasAnySystemPermissions(cellInfo.rowData)) {
        return "QuickBase Staff";
    } else if (hasAppAccess) {
        return "Paid Seat";
    } else {
        return "No App Access";
    }
};

export const FormatUserStatusHTML = (hasAppAccess, cellInfo) => {
    if (RealmUserAccountFlagConstants.IsDeactivated(cellInfo.rowData)) {
        return (<span className="accessStatusLabel deactivated"><Icon icon="errorincircle-outline"/> Deactivated</span>);
    } else if (RealmUserAccountFlagConstants.IsDenied(cellInfo.rowData)) {
        return (<span className="accessStatusLabel denied"><Icon icon="deactivate"/> Denied</span>);
    } else if (RealmUserAccountFlagConstants.HasAnySystemPermissions(cellInfo.rowData)) {
        return (<span className="accessStatusLabel staff"><Icon icon="user"/> QuickBase Staff</span>);
    } else if (hasAppAccess) {
        return (<span className="accessStatusLabel paid"><Icon icon="currency-dollar"/> Paid Seat</span>);
    } else {
        return (<span className="accessStatusLabel none"><Icon icon="lock"/> No App Access</span>);
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

export const FormatIsInactive = (lastAccessString, cellInfo) => {
    return RenderBoolColumn(FormatIsInactiveBool(lastAccessString));
};

export const FormatLastAccessString = (lastAccessString, cellInfo) => IsTimeNull(lastAccessString) ? 'never' : moment(lastAccessString).format("MMMM D YYYY");
export const FormatIsGroupMember = (numGroupsMember, cellInfo) => RenderBoolColumn(numGroupsMember > 0);
export const FormatIsGroupManager = (numGroupsManaged, cellInfo) => RenderBoolColumn(numGroupsManaged > 0);
export const FormatCanCreateApps = (accountTrusteeFlags, cellInfo) => RenderBoolColumn(RealmUserAccountFlagConstants.CanCreateApps(cellInfo.rowData));
export const FormatIsAppManager = (numAppsManaged, cellInfo) => RenderBoolColumn(numAppsManaged > 0);
export const FormatIsInRealmDirectory = (flags, cellInfo) => RenderBoolColumn(RealmUserAccountFlagConstants.HasAnyRealmPermissions(cellInfo.rowData));
export const FormatIsRealmApproved = (flags, cellInfo) => RenderBoolColumn(RealmUserAccountFlagConstants.IsApprovedInRealm(cellInfo.rowData));
