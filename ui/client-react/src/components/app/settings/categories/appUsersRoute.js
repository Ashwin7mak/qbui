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
import {connect} from 'react-redux';
import {loadAppOwner} from '../../../../actions/userActions';
import {loadAppRoles} from '../../../../actions/appRoleActions';
import {getAppRoles} from '../../../../reducers/appRoles';
import {getSelectedAppId, getApp, getAppOwner} from '../../../../reducers/app';
import './appUsersRoute.scss';

export const AppUsersRoute = React.createClass({
    getInitialState() {
        return {
            roleId: ''
        };
    },
    componentDidMount() {
        this.props.loadAppRoles(this.props.appId);
        this.props.loadAppOwner(this.props.appId, this.props.selectedApp.ownerId);
    },

    componentWillUnmount() {
        this.selectRows([]);
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
        return (<UserActions selection={this.props.selectedUserRows} actions={this.props.flux.actions} appId={this.props.appId} roleId={this.state.roleId}/>);
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
        let appUsers = this.props.selectedApp.unfilteredUsers;
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
        if (this.props.selectedUserRows.length === this.props.selectedApp.users) {
            this.deselectAllRows();
        } else {
            this.selectAllRows();
        }
    },
    areAllRowsSelected() {
        return this.props.selectedUserRows.length === this.props.selectedApp.users;
    },

    render() {
        if (this.props.appRoles && this.props.selectedApp) {
            return (
                <div>
                    <Stage stageHeadline={this.getStageHeadline()}
                           pageActions={this.getPageActions()}>

                        <AppSettingsStage appUsers={this.props.selectedApp.unfilteredUsers}
                                          appRoles={this.props.appRoles}
                                          appOwner={this.props.appOwner}/>
                    </Stage>
                    {this.getTableActions()}
                    <div className="userManagementContainer">
                        <UserManagement appId={this.props.appId}
                                        appUsers={this.props.selectedApp.unfilteredUsers}
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
        appOwner: getAppOwner(state.app)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadAppRoles: (appId) => {dispatch(loadAppRoles(appId));},
        loadAppOwner: (appId, userId) => {dispatch(loadAppOwner(appId, userId));}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppUsersRoute);
