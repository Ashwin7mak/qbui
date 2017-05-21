/**
 * Created by rbeyer on 2/4/17.
 */
import React from 'react';
import UserManagement from './userManagement';
import AddUserDialog from '../../../user/addUserDialog';
import Stage from '../../../../../../reuse/client/src/components/stage/stage';
import IconActions from '../../../actions/iconActions';
import QBIcon from '../../../../../../reuse/client/src/components/icon/icon';
import AppSettingsStage from '../appSettingsStage';
import Locale from '../../../../../../reuse/client/src/locales/locale';
import UserActions from '../../../actions/userActions';
import './appUsersRoute.scss';

const AppUsersRoute = React.createClass({
    getInitialState() {
        return {
            roleId: ''
        };
    },
    componentDidMount() {
        this.props.flux.actions.loadAppRoles(this.props.match.params.appId);
        this.props.flux.actions.loadAppOwner(this.props.selectedApp.ownerId);
        this.props.flux.actions.getAllUsers();
    },

    componentWillReceiveProps(props) {
        if (props.match.params.appId && props.selectedApp.ownerId) {
            if (this.props.match.params.appId !== props.match.params.appId) {
                this.props.flux.actions.loadAppRoles(this.props.match.params.appId);
                this.props.flux.actions.loadAppOwner(this.props.selectedApp.ownerId);
            }
        } else {
            this.props.flux.actions.loadAppRoles(null);
            this.props.flux.actions.loadAppOwner(null);
        }

        if (this.props.match.params.appId !== props.match.params.appId && this.props.selectedApp.ownerId !== props.selectedApp.ownerId) {
            this.props.flux.actions.loadAppRoles(this.props.match.params.appId);
            this.props.flux.actions.loadAppOwner(this.props.selectedApp.ownerId);
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
        this.props.flux.actions.openAddUserDialog(state);
    },

    setUserRoleToAdd(roleId) {
        this.props.flux.actions.setUserRoleToAdd(roleId);
    },

    assignUserToApp(appId, userInfo) {
        return this.props.flux.actions.assignUserToApp(appId, userInfo.userId, userInfo.roleId);
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
        return (<UserActions selection={this.props.selectedUserRows} actions={this.props.flux.actions} appId={this.props.match.params.appId} roleId={this.state.roleId}/>);
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
        this.props.flux.actions.selectUsersRows(selectedRows);
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

        this.props.flux.actions.selectUsersRows(selectedRows);
    },

    /**
     * select all grid rows
     */

    selectAllRows() {
        let roleId = this.state.roleId;
        let appUsers = this.props.appUsersUnfiltered;
        let selected = [];
        // Transform the records first so that subHeaders (grouped records) can be handled appropriately
        this.props.appRoles.map(role => {

            if (appUsers[role.id]) {

                selected = appUsers[role.id].map(user => {
                    roleId = user.roleId;
                    return user.userId;

                });
            }
        });
        this.selectRows(selected);
    },

    deselectAllRows() {
        this.selectRows([]);
    },

    toggleSelectAllRows() {
        if (this.props.selectedUserRows.length === this.props.appUsers.length) {
            this.deselectAllRows();
        } else {
            this.selectAllRows();
        }
    },
    areAllRowsSelected() {
        return this.props.selectedUserRows.length === this.props.appUsers.length;
    },

    render() {
        return (
            <div>
                <Stage stageHeadline={this.getStageHeadline()}
                       pageActions={this.getPageActions()}>

                    <AppSettingsStage appUsers={this.props.appUsersUnfiltered}
                                      appRoles={this.props.appRoles}
                                      appOwner={this.props.appOwner}/>
                </Stage>
                <AddUserDialog allUsers={this.props.allUsers}
                               searchUsers={this.props.flux.actions.getAllUsers}
                               appRoles={this.props.appRoles}
                               assignUserToApp={this.assignUserToApp}
                               setUserRoleToAdd={this.setUserRoleToAdd}
                               userRoleToAdd={this.props.userRoleToAdd}
                               appId={this.props.match.params.appId}
                               selectedApp={this.props.selectedApp}
                               existingUsers={this.props.appUsersUnfiltered}
                               addUserToAppDialogOpen={this.props.addUserToAppDialogOpen}
                               hideDialog={this.toggleAddUserDialog}/>
                {this.getTableActions()}
                <div className="userManagementContainer">
                    <UserManagement appId={this.props.match.params.appId}
                                    appUsers={this.props.appUsersUnfiltered}
                                    appRoles={this.props.appRoles}
                                    onClickToggleSelectedRow={this.toggleSelectedRow}
                                    onClickToggleSelectAllRows={this.toggleSelectAllRows}
                                    selectedRows={this.props.selectedUserRows}
                                    areAllRowsSelected={this.areAllRowsSelected()}
                    />
                </div>
            </div>
        );
    }

});

export default AppUsersRoute;
