/**
 * Created by rbeyer on 2/4/17.
 */
import React from 'react';
import UserManagement from './userManagement';
import Stage from '../../../../../../reuse/client/src/components/stage/stage';
import IconActions from '../../../actions/iconActions';
import QBIcon from '../../../../../../reuse/client/src/components/icon/icon';
import AppSettingsStage from '../appSettingsStage';
import Locale from '../../../../../../reuse/client/src/locales/locale';
import UserActions from '../../../actions/userActions';
import './appUsersRoute.scss';

const AppUsersRoute = React.createClass({
    roleId:"",
    componentDidMount() {
        this.props.flux.actions.loadAppRoles(this.props.match.params.appId);
        this.props.flux.actions.loadAppOwner(this.props.selectedApp.ownerId);
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

    getPageActions() {
        const actions = [
            {msg: 'app.users.addUser', icon: 'add-new-filled', className: 'addRecord', disabled: true},
            {msg: 'unimplemented.makeFavorite', icon: 'star', disabled: true},
            {msg: 'unimplemented.email', icon: 'mail', disabled: true},
            {msg: 'unimplemented.print', icon: 'print', disabled: true}
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={4}/>);
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
        return (<UserActions selection={this.props.selectedUserRows} actions={this.props.flux.actions} appId={this.props.match.params.appId} roleId={this.roleId}/>);
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

        this.roleId = roleId;

        this.props.flux.actions.selectUsersRows(selectedRows);
    },

    /**
     * select all grid rows
     */

    selectAllRows(){
        let roleId = this.roleId;
        let appUsers = this.props.appUsersUnfiltered;
        let selected = [];
        // Transform the records first so that subHeaders (grouped records) can be handled appropriately
        this.props.appRoles.map(role => {

            if (appUsers[role.id]) {

                selected = appUsers[role.id].map(user => {
                    debugger;
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
    areAllRowsSelected(){
        if (this.props.selectedUserRows.length === this.props.appUsers.length) {
            return true;
        } else {
            return false;
        }
    },

    addRoleIds(){
        let appUsers = this.props.appUsers;
        let selectedRows = this.props.selectedRows;
        this.props.appRoles.forEach(function(role) {
            if (appUsers[role.id]) {
                appUsers[role.id].forEach(function(user) {
                    user.roleName = role.name;
                    user.name = `${user.firstName} ${user.lastName}`;
                    user.roleId = role.id;
                    user.isSelected = selectedRows.indexOf(user.userId) > -1 ;
                    appUsersFiltered.push(user);
                });
            }
        });
        return appUsersFiltered;
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
