import AccountUsersService from "./AccountUsersService";
import * as types from "../../app/actionTypes";
import _ from 'lodash';
import * as Formatters from './grid/AccountUsersGridFormatters';
import * as RealmUserAccountFlagConstants from "../../common/constants/RealmUserAccountFlagConstants.js";

/**
 * Action when there is successful user from the backend
 * @param users
 */
export const receiveAccountUsers = (users) => ({
    type: types.SET_USERS,
    users
});

/**
 * Get all the users
 *
 * @returns {function(*=)}
 */
export const fetchAccountUsers = (accountId) => {
    return (dispatch) => {
        // get all the users from the account service
        const accountUsersService = new AccountUsersService();
        const promise = accountUsersService.getAccountUsers(accountId);

        promise.then(response => {
            _.each(response.data, item => {
                item.id = item.uid;
            });
            // we have the users, update the redux store
            dispatch(receiveAccountUsers(response.data));
        });
        return promise;
    };
};

const sortFunctions = [
    "uid",
    "firstName",
    "lastName",
    "email",
    "userName",
    "lastAccess",
    user => Formatters.FormatUserStatusText(user.hasAppAccess, {rowData: user}),
    user => Formatters.FormatIsInactive(user.lastAccess, {rowData: user}),
    user => user.numGroupsMember > 0,
    user => user.numGroupsManaged > 0,
    user => RealmUserAccountFlagConstants.CanCreateApps(user),
    user => user.numAppsManaged > 0,
    user => RealmUserAccountFlagConstants.HasAnyRealmPermissions(user),
    user => RealmUserAccountFlagConstants.IsApprovedInRealm(user)
];

export const sortUsers = (users, sortFids) => {

    if (sortFids.length === 0) {
        sortFids = [0];
    }

    let sortFnArray = _.map(sortFids, (fid) => sortFunctions[Math.abs(fid)]);
    let orderArray = _.map(sortFids, (fid) => fid >= 0 ? "asc" : "desc");
    return _.orderBy(users, sortFnArray, orderArray);
};

export const doUpdate = (gridId, gridState) => {
    return (dispatch, getState) => {
        let sortFids = gridState.sortFids || [];
        dispatch(receiveAccountUsers(sortUsers(getState().AccountUsers.users, sortFids)));
    };
};
