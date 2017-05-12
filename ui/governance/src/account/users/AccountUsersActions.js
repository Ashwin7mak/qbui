import AccountUsersService from "./AccountUsersService";
import * as types from "../../app/actionTypes";
import * as StandardGridActions from "../../common/grid/standardGridActions";
import * as StandardGridState from "../../common/grid/standardGridReducer";
import WindowLocationUtils from "../../../../client-react/src/utils/windowLocationUtils";
import {FORBIDDEN, INTERNAL_SERVER_ERROR} from "../../../../client-react/src/constants/urlConstants";
import Logger from "../../../../client-react/src/utils/logger";
import LogLevel from "../../../../client-react/src/utils/logLevels";
import _ from "lodash";
import * as Formatters from "./grid/AccountUsersGridFormatters";
import * as RealmUserAccountFlagConstants from "../../common/constants/RealmUserAccountFlagConstants.js";
import * as SCHEMACONSTS from "../../../../client-react/src/constants/schema";
import {FACET_FIELDS} from "../users/grid/AccountUsersGridFacet";

let logger = new Logger();

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
 * @returns  {Array|*}
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
 * @returns  {Array|*}
 */
export const paginateUsers = (users, _page, _itemsPerPage) => {

    let currentPage = _page || 1,
        itemsPerPage = _itemsPerPage || 10;

    let offset = (currentPage - 1) * itemsPerPage;

    if (users.length === 0 || offset >= users.length || itemsPerPage >= users.length) {
        offset = 0;
        currentPage = 1;
    }

    let slicedUsers = users.slice(offset, offset + itemsPerPage);
    return {
        currentPageRecords: slicedUsers,
        currentPage: currentPage,
        filteredRecords:users.length,
        itemsPerPage: itemsPerPage,
        totalPages: Math.ceil(users.length / itemsPerPage),
        firstRecordInCurrentPage: slicedUsers.length === 0 ? 0 : offset + 1,
        lastRecordInCurrentPage: offset + slicedUsers.length
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

/**
 * Sort the users array given the array of sort FIDs
 * @param users
 * @param sortFids
 * @returns {Array|*}
 */
export const sortUsers = (users, sortFids) => {

    if (sortFids.length === 0) {
        sortFids = [1];
    }

    let sortFnArray = _.map(sortFids, (fid) => sortFunctions[Math.abs(fid)]);
    let orderArray = _.map(sortFids, (fid) => fid >= 0 ? "asc" : "desc");
    return _.orderBy(users, sortFnArray, orderArray);
};

/**
 * Filter the users based on the selected facets
 * Given a list of users, apply the facetSelections
 * @param users
 * @param facetSelection - {(id: [facets*])*}. See FacetSelections.js for interface
 * @returns {*}
 */

export const facetUser = (users, facetSelections) => {

    // Get the all the selected in this format {(id: [facets*])*}
    let facetsApplied = facetSelections && facetSelections.getSelections ? facetSelections.getSelections() : {};
    let facetUsers = users || [];

    if (!_.isEmpty(facetsApplied) && !_.isEmpty(facetUsers)) {
        // if facets were applied then filter the users
        facetUsers = _.filter(users, (user) => {
            // See if ALL of the facets match
            return _.every(facetsApplied, (facetValues, fieldID) => {

                if (FACET_FIELDS[fieldID].type.toUpperCase() === SCHEMACONSTS.CHECKBOX) {
                    facetValues = facetValues.map((facet) => (facet.toString().toUpperCase() === 'NO' || facet.toString().toUpperCase() === 'FALSE') ?  false : true);
                }
                return _.isEmpty(facetValues) || _.includes(facetValues, (FACET_FIELDS[fieldID].formatter(user)));
            });
        });
    }

    return facetUsers;
};


/**
 * Perform the Update on the Grid through transformations
 *
 * NOTE: In the future, this is going to be at the server
 */
export const doUpdate = (gridId, gridState, _itemsPerPage) => {
    return (dispatch, getState) => {
        let users = getState().AccountUsers ? getState().AccountUsers.users : [];

        if (users.length === 0) {
            return;
        }
        // First Facet
        let facetSelections = gridState.facets && gridState.facets.facetSelections ? gridState.facets.facetSelections : {};
        let facetedUsers = facetUser(users, facetSelections);

        // Then Search
        let searchTerm = gridState.searchTerm || "";
        let filteredUsers = searchUsers(facetedUsers, searchTerm);

        let sortFids = gridState.sortFids || [];
        let sortedUsers = sortUsers(filteredUsers, sortFids);

        // Then Paginate
        let itemsPerPage = _itemsPerPage || gridState.pagination.itemsPerPage;
        let {currentPageRecords, ...pagination} = paginateUsers(sortedUsers, gridState.pagination.currentPage, itemsPerPage);

        // Set the grid's search term
        dispatch(StandardGridActions.setSearch(gridId, searchTerm));

        // Set the grid's pagination info
        dispatch(StandardGridActions.setPaginate(gridId, pagination));

        // Inform the grid of the new users
        dispatch(StandardGridActions.setItems(gridId, currentPageRecords));

    };
};

/**
 * Get all the users
 * @param accountId
 * @param gridID
 * @param itemsPerPage
 * @returns {function(*)}
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

            // set the total records for the grid
            dispatch(StandardGridActions.setTotalRecords(gridID, response.data.length));

            // run through the pipeline and update the grid
            dispatch(doUpdate(gridID, StandardGridState.defaultGridState, itemsPerPage));

        }).catch(error => {
            dispatch(failedAccountUsers(error));
            if (error.response && error.response.status === 403) {
                logger.parseAndLogError(LogLevel.WARN, error.response, 'accountUserService.getAccountUsers:');
                WindowLocationUtils.update(FORBIDDEN);
            } else if (!(error.response && error.response.status === 401)) {
                // Since BaseService might be in the process of handling the redirect to current stack,
                // we have to provide an additional IF guard here so that we don't redirect to INTERNAL_SERVER_ERROR
                logger.parseAndLogError(LogLevel.ERROR, error.response, 'accountUserService.getAccountUsers:');
                WindowLocationUtils.update(INTERNAL_SERVER_ERROR);
            }
        });
    };
};
