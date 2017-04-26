import AccountUsersService from "./AccountUsersService";
import * as types from "../../app/actionTypes";
import _ from "lodash";
import * as Formatters from "./Grid/AccountUsersGridFormatters";
import * as RealmUserAccountFlagConstants from "../../common/constants/RealmUserAccountFlagConstants.js";
import * as StandardGridActions from "../../common/grid/standardGridActions";
import * as StandardGridState from "../../common/grid/standardGridReducer";


/**
 * Search across the users for the search term
 * @param users
 * @param searchTerm
 * @returns {*}
 */
export const searchUsers = (users, searchTerm) => {

    if (users.length === 0 || searchTerm.length === 0) {
        return users;
    }

    searchTerm = searchTerm.toLowerCase();

    return _.filter(users, function(user) {
        return _.includes(user.firstName.toLowerCase(), searchTerm) ||
        _.includes(user.lastName.toLowerCase(), searchTerm) ||
        _.includes(user.email.toLowerCase(), searchTerm) ||
        _.includes(user.userName.toLowerCase(), searchTerm) ||
        _.includes(user.userName.toLowerCase(), searchTerm);
    });
};

/**
 * Paginate through the users array
 * @param users
 * @param _page
 * @returns {*}
 */
export const paginateUsers = (users, _page) => {
    if (users.length === 0) {
        return users;
    }

    let page = _page || 1,
        per_page = 10, // TODO: PER PAGE
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

/**
 * Sort the users array given the array of sort FIDs
 * @param users
 * @param sortFids
 * @returns {Array|*}
 */
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
        let searchTerm = gridState.searchTerm || [];
        let filteredUsers = searchUsers(getState().AccountUsers.users, searchTerm);

        // Then Sort
        let sortFids = gridState.sortFids || [];
        let sortedUsers = sortUsers(filteredUsers, sortFids);

        // Then Paginate
        let paginationIndex = gridState.pagination.currentPage;
        let paginatedUsers = paginateUsers(sortedUsers, paginationIndex);

        // Inform the grid of the new users
        dispatch(StandardGridActions.doSetItems(gridId, paginatedUsers));

    };
};

/**
 * Get all the users from the service and inform the observers
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

            // run through the pipleine and update the grid
            dispatch(receiveAccountUsers(response.data));
            let pagination = {
                totalRecords: response.data.length,
                totalPages: Math.ceil(response.data.length / 10),
                currentPage: 1,
                itemsPerPage: 10
            };
            dispatch(StandardGridActions.doSetPaginate(gridID, pagination));
            dispatch(doUpdate(gridID, StandardGridState.defaultGridState));
        });
        return promise;
    };
};
