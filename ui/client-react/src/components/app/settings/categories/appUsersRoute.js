/**
 * Created by rbeyer on 2/4/17.
 */
import React from 'react';
import UserManagement from './userManagement';
import AddUserDialog from './addUserDialog';
import Stage from '../../../../../../reuse/client/src/components/stage/stage';
import IconActions from '../../../actions/iconActions';
import QBIcon from '../../../../../../reuse/client/src/components/icon/icon';
import AppSettingsStage from '../appSettingsStage';
import Locale from '../../../../../../reuse/client/src/locales/locale';
import {connect} from 'react-redux';
import UserActions from '../../../actions/userActions';
import {loadAppAndOwner, searchUsers, setUserRoleToAdd, openAddUserDialog, selectUserRows, clearSelectedUserRows} from '../../../../actions/userActions';
import {toggleAddToAppSuccessDialog} from '../../../../actions/appActions';
import {loadAppRoles} from '../../../../actions/appRoleActions';
import {getAppRoles, getFilteredAppRoles} from '../../../../reducers/selectedApp';
import {getSelectedAppId, getApp, getAppOwner, getAppUsers, getAppUnfilteredUsers} from '../../../../reducers/app';
import {getSearchedUsers, getDialogStatus, getRoleIdToAdd, getSelectedUsers} from '../../../../reducers/users';
import './appUsersRoute.scss';
import UserSuccessDialog from './userSuccessDialog.js';

export const AppUsersRoute = React.createClass({
    getInitialState() {
        return {
            updateRowCount: true,
        };
    },

    componentDidMount() {
        const appId = this.props.match.params.appId;
        this.props.loadAppRoles(appId);
        this.props.loadAppAndOwner(appId);
    },

    componentWillUnmount() {
        this.deselectAllRows();
    },

    getPageActions() {
        const actions = [
            {msg: 'app.users.addUser', icon: 'add-new-filled', className: 'addRecord', onClick: this.toggleAddUserDialog},
            {msg: 'unimplemented.makeFavorite', icon: 'star', disabled: true},
            {msg: 'unimplemented.email', icon: 'mail', disabled: true},
            {msg: 'unimplemented.print', icon: 'print', disabled: true}
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={4}/>);
    },

    toggleAddUserDialog(state = true) {
        this.props.openAddUserDialog(state);
    },

    setUserRoleToAdd(roleId) {
        this.props.setUserRoleToAdd(roleId);
    },

    getStageHeadline() {
        const userHeadLine = `${this.props.selectedApp.name} : ${Locale.getMessage('app.users.users')}`;
        return (
            <div className="duder">
                <div className="navLinks">
                    <QBIcon icon="users"/>
                </div>
                <div className="userStageHeadline">
                    <h3 className="userHeadLine">{userHeadLine}</h3>
                </div>
            </div>);
    },

    getSelectionActions() {
        return (<UserActions appId={this.props.appId} updateRowCount={this.state.updateRowCount} />);
    },

    getTableActions() {
        const selectedRows = this.props.selectedUserRows;
        const hasSelection = !!(selectedRows && selectedRows.length > 0);
        let classes = "tableActionsContainer secondaryBar userManagementAction";

        if (hasSelection) {
            classes += " selectionActionsOpen";
        }
        return (
            hasSelection ? <div className={classes}> {this.getSelectionActions()} </div> : null
        );
    },

    selectRows(selectedRows) {
        this.props.selectUserRows(selectedRows);
    },

    toggleSelectedRow(id, roleId) {

        let selectedRows = this.props.selectedUserRows;
        if (!Array.isArray(selectedRows)) {
            selectedRows = [];
        }
        // add to selectedRows if id is not in the list
        let isAlreadySelected = _.find(selectedRows, (selectedRow)=>{
            return selectedRow.id === id && selectedRow.roleId === roleId;
        });

        if (!isAlreadySelected) {
            selectedRows.push({id, roleId});
        } else {
            // id is in the list, remove it
            selectedRows = _.without(selectedRows, isAlreadySelected);
        }
        this.setState({updateRowCount:!this.state.updateRowCount});
        this.props.selectUserRows(selectedRows);
    },

    /**
     * select all grid rows
     */

    selectAllRows() {
        let appUsers = this.props.unfilteredAppUsers;
        let selected = [];
        // Transform the records first so that subHeaders (grouped records) can be handled appropriately
        this.props.appRoles.map(role => {
            if (appUsers[role.id]) {
                appUsers[role.id].map(user => {
                    selected.push({id: user.userId, roleId: role.id});
                });
            }
        });
        this.selectRows(selected);
    },

    deselectAllRows() {
        if (this.props.clearUserRows) {
            this.props.clearUserRows();
        }
    },

    toggleSelectAllRows() {
        const selectedUserRows = this.props.selectedUserRows.length;
        if (selectedUserRows === 0 || (selectedUserRows !== this.props.appUsers.length)) {
            this.selectAllRows();
        } else {
            this.deselectAllRows();
        }
    },
    areAllRowsSelected() {
        const selectedUserRows = this.props.selectedUserRows.length;
        return selectedUserRows > 0 && (selectedUserRows === this.props.appUsers.length);
    },

    render() {
        if (this.props.appRoles && this.props.selectedApp && this.props.appOwner) {
            const unfilteredAppUsers = this.props.unfilteredAppUsers;
            const appId = this.props.match.params.appId;
            return (
            <div>
                <Stage stageHeadline={this.getStageHeadline()}
                       pageActions={this.getPageActions()}>

                        <AppSettingsStage appUsers={unfilteredAppUsers}
                                          appRoles={this.props.appRoles}
                                          appOwner={this.props.appOwner}
                        />
                    </Stage>
                <AddUserDialog realmUsers={this.props.realmUsers}
                               searchUsers={this.props.searchUsers}
                               appRoles={this.props.appRoles}
                               setUserRoleToAdd={this.setUserRoleToAdd}
                               userRoleIdToAdd={this.props.roleIdToAdd}
                               appId={appId}
                               selectedApp={this.props.selectedApp}
                               existingUsers={unfilteredAppUsers}
                               addUserToAppDialogOpen={this.props.openDialogStatus}
                               hideDialog={this.toggleAddUserDialog}
                               showSuccessDialog={this.props.showSuccessDialog}
                />
                <UserSuccessDialog successDialogOpen={this.props.successDialogOpen}
                                   addedAppUser={this.props.addedAppUser}
                                   showSuccessDialog={this.props.showSuccessDialog}
                                   selectedAppName={this.props.selectedApp.name}
                />
                    {this.getTableActions()}
                    <div className="userManagementContainer">
                        <UserManagement appId={appId}
                                        appUsers={unfilteredAppUsers}
                                        appRoles={this.props.filteredAppRoles}
                                        onClickToggleSelectedRow={this.toggleSelectedRow}
                                        onClickToggleSelectAllRows={this.toggleSelectAllRows}
                                        selectedRows={this.props.selectedUserRows}
                                        areAllRowsSelected={this.areAllRowsSelected()}
                        />
                    </div>
                </div>
            );

        } else {
            return (<div></div>);
        }
    }

});

const mapStateToProps = (state, ownProps) => {
    let selectedAppId = getSelectedAppId(state);
    return {
        unfilteredAppUsers: getAppUnfilteredUsers(state),
        appUsers: getAppUsers(state),
        appRoles: getAppRoles(state.selectedApp),
        appId: selectedAppId,
        selectedApp: getApp(state, selectedAppId),
        appOwner: getAppOwner(state),
        realmUsers: getSearchedUsers(state.users),
        openDialogStatus: getDialogStatus(state.users),
        roleIdToAdd: getRoleIdToAdd(state.users),
        selectedUserRows: getSelectedUsers(state.users),
        successDialogOpen: state.selectedApp.successDialogOpen,
        addedAppUser: state.selectedApp.addedAppUser,
        filteredAppRoles: getFilteredAppRoles(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadAppRoles: (appId) => {dispatch(loadAppRoles(appId));},
        loadAppAndOwner: (appId) => {dispatch(loadAppAndOwner(appId));},
        searchUsers: (searchTerm) => {return dispatch(searchUsers(searchTerm));},
        setUserRoleToAdd: (roleId) => {dispatch(setUserRoleToAdd(roleId));},
        openAddUserDialog: (status) => {dispatch(openAddUserDialog(status));},
        selectUserRows: (selected) => {dispatch(selectUserRows(selected));},
        clearUserRows: () => {dispatch(clearSelectedUserRows());},
        showSuccessDialog: (isOpen, email) => {
            dispatch(toggleAddToAppSuccessDialog(isOpen, email));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppUsersRoute);
