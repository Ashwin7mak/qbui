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
import {loadAppOwner, searchUsers, setUserRoleToAdd, openAddUserDialog, selectUserRows} from '../../../../actions/userActions';
import {loadAppRoles} from '../../../../actions/appRoleActions';
import {getAppRoles} from '../../../../reducers/appRoles';
import {getSelectedAppId, getApp, getAppOwner, getSelectedAppUsers, getSelectedAppUnfilteredUsers} from '../../../../reducers/app';
import {getSearchedUsers, getDialogStatus, getRoleIdToAdd, getSelectedUsers} from '../../../../reducers/users';
import './appUsersRoute.scss';

export const AppUsersRoute = React.createClass({
    getInitialState() {
        return {
            roleId: ''
        };
    },
    componentDidMount() {
        this.props.loadAppRoles(this.props.match.params.appId);

        const selectedApp = this.props.selectedApp;
        if (selectedApp) {
            this.props.loadAppOwner(this.props.appId, this.props.selectedApp.ownerId);
        }
        this.props.searchUsers();
    },

    componentWillReceiveProps(props) {
        const selectedApp = this.props.selectedApp || {};
        if (props.match.params.appId && selectedApp.ownerId) {
            if (this.props.match.params.appId !== props.match.params.appId) {
                this.props.loadAppRoles(this.props.match.params.appId);
                this.props.loadAppOwner(selectedApp.ownerId);
            }
        } else {
            const propsSelectedApp = props.selectedApp || {};
            if (this.props.match.params.appId !== props.match.params.appId && selectedApp.ownerId !== propsSelectedApp.ownerId) {
                this.props.loadAppRoles(this.props.match.params.appId);
                this.props.loadAppOwner(selectedApp.ownerId);
            }
        }
    },

    componentWillUnmount() {
        this.selectRows([]);
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
        return (<UserActions appId={this.props.appId} roleId={this.state.roleId} />);
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
        if (selectedRows.indexOf(id) === -1) {
            selectedRows.push(id);
        } else {
            // id is in the list, remove it
            selectedRows = _.without(selectedRows, id);
        }
        this.setState({roleId:roleId});

        this.props.selectUserRows(selectedRows);
    },

    /**
     * select all grid rows
     */

    selectAllRows() {
        let roleId = this.state.roleId;
        let appUsers = this.props.unfilteredAppUsers;
        let selected = [];
        // Transform the records first so that subHeaders (grouped records) can be handled appropriately
        this.props.appRoles.map(role => {
            if (appUsers[role.id]) {
                appUsers[role.id].map(user => {
                    roleId = user.roleId;
                    selected.push(user.userId);
                });
            }
        });
        this.selectRows(selected);
    },

    deselectAllRows() {
        this.selectRows([]);
    },

    toggleSelectAllRows() {
        const selectedUserRows = this.props.selectedUserRows.length;
        if (selectedUserRows === 0 || (selectedUserRows === this.props.selectedAppUsers.length)) {
            this.deselectAllRows();
        } else {
            this.selectAllRows();
        }
    },
    areAllRowsSelected() {
        const selectedUserRows = this.props.selectedUserRows.length;
        return selectedUserRows > 0 && (selectedUserRows === this.props.selectedAppUsers.length);
    },

    render() {
        if (this.props.appRoles && this.props.selectedApp) {
            return (
            <div>
                <Stage stageHeadline={this.getStageHeadline()}
                       pageActions={this.getPageActions()}>

                        <AppSettingsStage appUsers={this.props.unfilteredAppUsers}
                                          appRoles={this.props.appRoles}
                                          appOwner={this.props.appOwner}/>
                    </Stage>
                <AddUserDialog realmUsers={this.props.realmUsers}
                               searchUsers={this.props.searchUsers}
                               appRoles={this.props.appRoles}
                               setUserRoleToAdd={this.setUserRoleToAdd}
                               userRoleIdToAdd={this.props.roleIdToAdd}
                               appId={this.props.match.params.appId}
                               selectedApp={this.props.selectedApp}
                               existingUsers={this.props.unfilteredAppUsers}
                               addUserToAppDialogOpen={this.props.openDialogStatus}
                               hideDialog={this.toggleAddUserDialog}/>
                    {this.getTableActions()}
                    <div className="userManagementContainer">
                        <UserManagement appId={this.props.appId}
                                        appUsers={this.props.unfilteredAppUsers}
                                        appRoles={this.props.appRoles}
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
    let selectedAppId = getSelectedAppId(state.app);
    return {
        appRoles: getAppRoles(state.appRoles, ownProps.match.params.appId),
        appId: selectedAppId,
        selectedApp: getApp(state.app, selectedAppId),
        appOwner: getAppOwner(state.app),
        realmUsers: getSearchedUsers(state.users),
        unfilteredAppUsers: getSelectedAppUnfilteredUsers(state.app),
        selectedAppUsers: getSelectedAppUsers(state.app),
        openDialogStatus: getDialogStatus(state.users),
        roleIdToAdd: getRoleIdToAdd(state.users),
        selectedUserRows: getSelectedUsers(state.users)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadAppRoles: (appId) => {dispatch(loadAppRoles(appId));},
        loadAppOwner: (appId, userId) => {dispatch(loadAppOwner(appId, userId));},
        searchUsers: (searchTerm) => {return dispatch(searchUsers(searchTerm));},
        setUserRoleToAdd: (roleId) => {dispatch(setUserRoleToAdd(roleId));},
        openAddUserDialog: (status) => {dispatch(openAddUserDialog(status));},
        selectUserRows: (selected) => {dispatch(selectUserRows(selected));}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppUsersRoute);
