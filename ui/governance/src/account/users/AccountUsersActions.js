import AccountUsersService from "./AccountUsersService";
import * as types from "../../app/actionTypes";
import * as StandardGridActions from "../../common/grid/standardGridActions";
import * as StandardGridState from "../../common/grid/standardGridReducer";
import WindowLocationUtils from  "../../../../client-react/src/utils/windowLocationUtils";
import {FORBIDDEN, INTERNAL_SERVER_ERROR} from  "../../../../client-react/src/constants/urlConstants";
import Logger from '../../../../client-react/src/utils/logger';
import LogLevel from '../../../../client-react/src/utils/logLevels';
import _ from 'lodash';
let logger = new Logger();
import * as Formatters from "./Grid/AccountUsersGridFormatters";
import * as RealmUserAccountFlagConstants from "../../common/constants/RealmUserAccountFlagConstants.js";


/**
 * Action when there is successful user from the backend
 * @param users
 */
export const receiveAccountUsers = (users) => ({
    type: types.GET_USERS_SUCCESS,
    users
});
export const failedAccountUsers = (error) => ({
    error: error,
    type: types.GET_USERS_FAILURE
});

export const fetchingAccountUsers = () => ({
    type: types.GET_USERS_FETCHING
});

/**
 * Search searchTermAcross Users
 * @param users - list of users
 * @param searchTerm - the search term to find
 * @returns {filtered users}
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
        _.includes(Formatters.FormatLastAccessString(user.lastAccess).toLowerCase(), searchTerm) ||
        _.includes(Formatters.FormatUserStatusText(user.hasAppAccess, {rowData: user}).toLowerCase(), searchTerm);
    });
};

/**
 * Paginate through the users
 * @param users - the list of users to paginate through
 * @param _page - the currentpage
 * @param _itemsPerPage - items per page to display
 * @returns {paginated/filtered users}
 */
export const paginateUsers = (users, _page, _itemsPerPage) => {
    if (users.length === 0) {
        return users;
    }

    let page = _page || 1,
        itemsPerPage = _itemsPerPage || 10;
    let offset = (page - 1) * itemsPerPage;
    return users.slice(offset, offset + itemsPerPage);
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
 * Perform the Update on the Grid through transformations
 *
 * NOTE: In the future, this is going to be at the server
 */
export const doUpdate = (gridId, gridState, _itemsPerPage) => {
    return (dispatch, getState) => {
        // First Filter
        let searchTerm = gridState.searchTerm || "";
        let filteredUsers = searchUsers(getState().AccountUsers.users, searchTerm);

        // Then Sort
        let sortFids = gridState.sortFids || [];
        let sortedUsers = sortUsers(filteredUsers, sortFids);

        // Then Paginate
        let itemsPerPage = _itemsPerPage || gridState.pagination.itemsPerPage;
        let currentPage = sortedUsers.length <= itemsPerPage ? 1 : gridState.pagination.currentPage;
        let paginatedUsers = paginateUsers(sortedUsers, currentPage, itemsPerPage);

        // This info in the future will be returned by the server
        let pagination = {
            totalRecords: sortedUsers.length,
            totalPages: Math.ceil(sortedUsers.length / itemsPerPage),
            currentPage: currentPage,
            itemsPerPage: itemsPerPage
        };
        // Set the grid's pagination info
        dispatch(StandardGridActions.doSetPaginate(gridId, pagination));

        // Inform the grid of the new users
        dispatch(StandardGridActions.doSetItems(gridId, paginatedUsers));

    };
};

/**
 * Get all the users
 *
 * @returns {function(*)}
 * Paginate through the users array
 * @param users the users to filter
 * @param _page the current page
 * @param _itemsPerPage the total items per page
 * @returns {*}
 */
export const fetchAccountUsers = (accountId, gridID, itemsPerPage) => {
    return (dispatch) => {
        // get all the users from the account service
        const accountUsersService = new AccountUsersService();
        const promise = accountUsersService.getAccountUsers(accountId);

        dispatch(fetchingAccountUsers());

        return promise.then(response => {
            _.each(response.data, item => {
                item.id = item.uid;
            });

            // inform the redux store of all the users
            dispatch(receiveAccountUsers(response.data));

            // run through the pipeline and update the grid
            dispatch(doUpdate(gridID, StandardGridState.defaultGridState, itemsPerPage));

        }).catch(error => {
            dispatch(failedAccountUsers(error));

            if (error.response && error.response.status === 403) {
                logger.parseAndLogError(LogLevel.WARN, error.response, 'accountUserService.getAccountUsers:');
                WindowLocationUtils.update(FORBIDDEN);
            } else {
                logger.parseAndLogError(LogLevel.ERROR, error.response, 'accountUserService.getAccountUsers:');
                WindowLocationUtils.update(INTERNAL_SERVER_ERROR);
            }
        });
    };
};
