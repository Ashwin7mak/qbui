import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Locale from '../../../../reuse/client/src/locales/locale';
import ActionIcon from './actionIcon';
import QBModal from '../qbModal/qbModal';
import {removeUsersFromAppRole} from '../../actions/appRoleActions';
import {clearSelectedUserRows} from '../../actions/userActions';
import {toggleChangeUserRoleDialog} from '../../actions/appActions';
import NotificationManager from '../../../../reuse/client/src/scripts/notificationManager';
import {getSelectedUsers} from '../../reducers/users';
import UserRoleChange from '../app/settings/categories/userRoleChange';
import './reportActions.scss';

/**
 * User-level actions
 *
 */
export class UserActions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {confirmDeletesDialogOpen: false};
    }
    getEmailSubject = () => {
        return Locale.getMessage('app.users.emailSubject');
    }

    getEmailBody = () => {
        return Locale.getMessage('app.users.emailBody');
    }

    getSelectionTip = (actionMsg) => {
        return Locale.getPluralizedMessage(actionMsg, {value: this.props.selectedUserRows.length});
    }

    /**
     * delete the selected users, after confirmation if multiple users selected
     */
    handleDelete = () => {
        this.setState({confirmDeletesDialogOpen: true});
    }

    /**
     * multiple user delete was cancelled from dialog
     */
    cancelBulkDelete = ()=> {
        this.setState({confirmDeletesDialogOpen: false});
    }
    /**
     * this.props.selectedUserRows has the current selected rows with the unique identifier as the value in the array
     */
    handleBulkDelete = () => {
        const selectedRows = this.props.selectedUserRows;
        this.props.removeUsersFromAppRole(this.props.appId, selectedRows).then(
            (userIds) => {
                let msg;
                if (selectedRows.length > 1) {
                    msg = Locale.getMessage('app.users.usersRemovedFromAppRole', {numOfUsers: selectedRows.length});
                } else {
                    msg = Locale.getMessage('app.users.userRemovedFromAppRole');
                }
                NotificationManager.success(msg);

                //  clear out the selected user rows..
                this.props.clearSelectedUserRows();
            },
            () => {
                NotificationManager.error(Locale.getMessage('app.users.userRemovingError'));
            }
        );
        this.setState({confirmDeletesDialogOpen: false});
    }

    /**
     * render a QBModal
     * @returns {XML}
     */
    getConfirmDialog = () => {

        let msg;
        if (this.props.selectedUserRows.length > 1) {
            msg = this.getSelectionTip("app.users.deleteUsers") + '?';
        } else {
            msg = Locale.getMessage('app.users.removeUser');
        }
        const bodyMsg  = Locale.getMessage('app.users.unAssignUser');

        return (
            <QBModal
                show={this.state.confirmDeletesDialogOpen}
                primaryButtonName={Locale.getMessage('app.users.removeButton')}
                primaryButtonOnClick={this.handleBulkDelete}
                leftButtonName={Locale.getMessage('app.users.cancel')}
                leftButtonOnClick={this.cancelBulkDelete}
                bodyMessage={bodyMsg}
                type="delete"
                title={msg}/>);
    }
    getEmailAction = () => {
        //TODO Email action is disabled for now until its implemented.
        return <ActionIcon icon="download-cloud" tip={Locale.getMessage("unimplemented.emailUsers")} disabled={true} identifier="download-cloud"/>;
    }

    /**
     * render the actions
     */
    render() {
        const numSelectedRows = this.props.selectedUserRows.length;
        return (
            <div className={'reportActions'}>
                <div className={'reportActionsBlock'}>
                    {<span className="selectedRowsLabel">{numSelectedRows}</span>}
                    <div className="actionIcons">
                        <ActionIcon icon="mail" tip={Locale.getMessage("unimplemented.emailApp")} disabled={true} identifier="mail"/>
                        {this.getEmailAction()}
                        <ActionIcon icon="change-user-role" tip={this.getSelectionTip(numSelectedRows > 1 ? "app.users.changeUserRoles" : "app.users.changeUserRole")} onClick={()=>{this.props.toggleChangeUserRoleDialog(true);}} identifier="change-user-role"/>
                        <ActionIcon icon="errorincircle-fill" tip={this.getSelectionTip(numSelectedRows > 1 ? "app.users.deleteUsers" : "app.users.deleteUser")} onClick={this.handleDelete} identifier="errorincircle-fill"/>
                   </div>
                </div>
                {this.getConfirmDialog()}
                <UserRoleChange
                    appRoles={this.props.appRoles}
                    appId={this.props.appId}
                    roleId={this.props.roleId}
                    selectedUserRows={this.props.selectedUserRows}
                    clearSelectedUserRows={this.props.clearSelectedUserRows}
                    getSelectionTip={this.getSelectionTip}

                />
            </div>
        );
    }
}

UserActions.propTypes = {
    appId: PropTypes.string,
    updateRowCount: PropTypes.bool,
    removeUsersFromAppRole: PropTypes.func,
    selectedUserRows: PropTypes.array,
    clearSelectedUserRows: PropTypes.func
};

const mapStateToProps = (state) => {
    return {
        selectedUserRows: getSelectedUsers(state.users)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        removeUsersFromAppRole: (appId, userIds) => {return dispatch(removeUsersFromAppRole(appId, userIds));},
        clearSelectedUserRows: () => {dispatch(clearSelectedUserRows());},
        toggleChangeUserRoleDialog: (isOpen)=> {dispatch(toggleChangeUserRoleDialog(isOpen));}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserActions);
