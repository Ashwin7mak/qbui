import AccountUsersService from "./AccountUsersService";
import * as types from "../../app/actionTypes";
import _ from "lodash";
import * as Formatters from "./Grid/AccountUsersGridFormatters";
import * as RealmUserAccountFlagConstants from "../../common/constants/RealmUserAccountFlagConstants.js";
import * as StandardGridActions from "../../common/grid/standardGridActions";
import * as StandardGridState from "../../common/grid/standardGridReducer";


export const filterUsers = (users, filterQuery) => {

    return users;
};

export const paginateUsers = (users, _page) => {
    if (users.length === 0) {
        return users;
    }

    let page = _page || 1,
        per_page = 10,
        offset = (page - 1) * per_page;
    return users.slice(offset, offset + per_page);
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



/**
 * Action when there is successful user from the backend
 * @param users
 */
export const receiveAccountUsers = (users) => ({
    type: types.SET_USERS,
    users
});

/**
 * Perform the Update on the Grid through transformations
 */
export const doUpdate = (gridId, gridState) => {
    return (dispatch, getState) => {
        // First Filter
        let filterFids = gridState.filterQuery || [];
        let filteredUsers = filterUsers(getState().AccountUsers.users, filterFids);

        // Then Sort
        let sortFids = gridState.sortFids || [];
        let sortedUsers = sortUsers(filteredUsers, sortFids);

        // Then Paginate
        let paginationIndex = gridState.pagination.currentIndex;
        let paginatedUsers = paginateUsers(sortedUsers, paginationIndex);

        // Inform the grid of the new users
        dispatch(StandardGridActions.doSetItems(gridId, paginatedUsers));

    };
};

/**
 * Get all the users from the service
 *
 * @returns {function(*=)}
 */
export const fetchAccountUsers = (accountId, gridID) => {
    return (dispatch) => {
        // get all the users from the account service
        const accountUsersService = new AccountUsersService();
        const promise = accountUsersService.getAccountUsers(accountId);

        promise.then(response => {
            _.each(response.data, item => {
                item.id = item.uid;
            });

            // run through the pipleine and update the grid. temporarily use the default grid state
            dispatch(receiveAccountUsers(response.data));
            dispatch(doUpdate(gridID, StandardGridState.defaultGridState));
        });
        return promise;
    };
};
