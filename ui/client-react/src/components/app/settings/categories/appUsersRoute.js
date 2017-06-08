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
import UserActions from '../../../actions/userActions';
import {connect} from 'react-redux';
import {loadAppRoles} from '../../../../actions/appRoleActions';
import {getAppRoles} from '../../../../reducers/appRoles';
import './appUsersRoute.scss';
import {toggleAddToAppSuccessDialog} from '../../../../actions/appsActions';
import UserSuccessDialog from './userSuccessDialog.js';

export const AppUsersRoute = React.createClass({
    getInitialState() {
        return {
            roleId: '',
        };
    },
    componentDidMount() {
        this.props.loadAppRoles(this.props.match.params.appId);
        this.props.flux.actions.loadAppOwner(this.props.selectedApp.ownerId);
        this.props.flux.actions.searchRealmUsers();
    },

    componentWillReceiveProps(props) {
        if (props.match.params.appId && props.selectedApp.ownerId) {
            if (this.props.match.params.appId !== props.match.params.appId) {
                this.props.loadAppRoles(this.props.match.params.appId);
                this.props.flux.actions.loadAppOwner(this.props.selectedApp.ownerId);
            }
        } else {
            this.props.loadAppRoles(null);
            this.props.flux.actions.loadAppOwner(null);
        }

        if (this.props.match.params.appId !== props.match.params.appId && this.props.selectedApp.ownerId !== props.selectedApp.ownerId) {
            this.props.loadAppRoles(this.props.match.params.appId);
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
        if (this.props.appRoles) {
            return (
            <div>
                <Stage stageHeadline={this.getStageHeadline()}
                       pageActions={this.getPageActions()}>

                        <AppSettingsStage appUsers={this.props.appUsersUnfiltered}
                                          appRoles={this.props.appRoles}
                                          appOwner={this.props.appOwner}/>
                    </Stage>
                <AddUserDialog realmUsers={this.props.realmUsers}
                               searchUsers={this.props.flux.actions.searchRealmUsers}
                               appRoles={this.props.appRoles}
                               assignUserToApp={this.assignUserToApp}
                               setUserRoleToAdd={this.setUserRoleToAdd}
                               userRoleIdToAdd={this.props.userRoleIdToAdd}
                               appId={this.props.match.params.appId}
                               selectedApp={this.props.selectedApp}
                               existingUsers={this.props.appUsersUnfiltered}
                               addUserToAppDialogOpen={this.props.addUserToAppDialogOpen}
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

        } else {
            return (<div></div>);
        }
    }

});

const mapStateToProps = (state, ownProps) => {
    return {
        appRoles: getAppRoles(state.appRoles, ownProps.match.params.appId),
        successDialogOpen: state.appUsers.successDialogOpen,
        addedAppUser: state.appUsers.addedAppUser,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadAppRoles: (appId) => {dispatch(loadAppRoles(appId));},
        showSuccessDialog: (isOpen, email) => {
            dispatch(toggleAddToAppSuccessDialog(isOpen, email));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppUsersRoute);
