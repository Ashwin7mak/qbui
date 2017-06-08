import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Locale from '../../../../reuse/client/src/locales/locale';
import ActionIcon from './actionIcon';
import QBModal from '../qbModal/qbModal';
import {removeUsersFromAppRole} from '../../actions/appRoleActions';
import {clearSelectedUserRows} from '../../actions/userActions';
import NotificationManager from '../../../../reuse/client/src/scripts/notificationManager';
import {getSelectedUsers} from '../../reducers/users';
import './reportActions.scss';

/**
 * User-level actions
 *
 */
export class UserActions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {confirmDeletesDialogOpen: false};
        this.getEmailSubject = this.getEmailSubject.bind(this);
        this.getEmailBody = this.getEmailBody.bind(this);
        this.getSelectionTip = this.getSelectionTip.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.cancelBulkDelete = this.cancelBulkDelete.bind(this);
        this.handleBulkDelete = this.handleBulkDelete.bind(this);
        this.getConfirmDialog = this.getConfirmDialog.bind(this);
        this.getEmailAction = this.getEmailAction.bind(this);
    }
    getEmailSubject() {
        return Locale.getMessage('app.users.emailSubject');
    }

    getEmailBody() {
        return Locale.getMessage('app.users.emailBody');
    }

    getSelectionTip(actionMsg) {
        return Locale.getPluralizedMessage(actionMsg, {value: this.props.selectedUserRows.length});
    }

    /**
     * delete the selected users, after confirmation if multiple users selected
     */
    handleDelete() {
        this.setState({confirmDeletesDialogOpen: true});
    }

    /**
     * multiple user delete was cancelled from dialog
     */
    cancelBulkDelete() {
        this.setState({confirmDeletesDialogOpen: false});
    }
    /**
     * this.props.selectedUserRows has the current selected rows with the unique identifier as the value in the array
     */
    handleBulkDelete() {
        const selectedRows = this.props.selectedUserRows;
        this.props.removeUsersFromAppRole(this.props.appId, this.props.roleId, selectedRows).then(
            (userIds) => {
                const msg = selectedRows.length > 1 ?
                    Locale.getMessage('app.users.usersRemovedFromAppRole', {numOfUsers:selectedRows.length}) : Locale.getMessage('app.users.userRemovedFromAppRole');
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
    getConfirmDialog() {

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
    getEmailAction() {
        //TODO Email action is disabled for now until its implemented.
        return <ActionIcon icon="download-cloud" tip={Locale.getMessage("unimplemented.emailUsers")} disabled={true} identifier="download-cloud"/>;
    }

    /**
     * render the actions
     */
    render() {
        const selectedRows = this.props.selectedUserRows.length;
        return (
            <div className={'reportActions'}>
                <div className={'reportActionsBlock'}>
                    {<span className="selectedRowsLabel">{selectedRows}</span>}
                    <div className="actionIcons">
                        <ActionIcon icon="mail" tip={Locale.getMessage("unimplemented.emailApp")} disabled={true} identifier="mail"/>
                        {this.getEmailAction()}
                        <ActionIcon icon="settings" tip={Locale.getMessage("unimplemented.settingsRole")} disabled={true} identifier="settings"/>
                        <ActionIcon icon="errorincircle-fill" tip={this.getSelectionTip(selectedRows > 1 ? "app.users.deleteUsers" : "app.users.deleteUser")} onClick={this.handleDelete} identifier="errorincircle-fill"/>
                    </div>
                </div>
                {this.getConfirmDialog()}
            </div>
        );
    }
}

UserActions.propTypes = {
    appId: PropTypes.string,
    roleId: PropTypes.string,
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
        removeUsersFromAppRole: (appId, roleId, userIds) => {return dispatch(removeUsersFromAppRole(appId, roleId, userIds));},
        clearSelectedUserRows: () => {dispatch(clearSelectedUserRows());}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserActions);
