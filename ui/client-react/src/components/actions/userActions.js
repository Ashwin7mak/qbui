import React, {PropTypes} from 'react';
import Locale from '../../locales/locales';
import ActionIcon from './actionIcon';
import QBModal from '../qbModal/qbModal';
import './reportActions.scss';

/**
 * User-level actions
 *
 */
class UserActions extends React.Component {

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
        return "Email subject goes here";
    }

    getEmailBody() {
        return "Email body goes here";
    }

    getSelectionTip(actionMsg) {
        return Locale.getPluralizedMessage(actionMsg, {value: this.props.selection.length});
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
     * this.props.selection has the current selected rows with the unique identifier as the value in the array
     */
    handleBulkDelete() {
        this.props.actions.unassignUsers(this.props.appId, this.props.roleId, this.props.selection);
        this.setState({confirmDeletesDialogOpen: false});
    }

    /**
     * render a QBModal
     * @returns {XML}
     */
    getConfirmDialog() {

        let msg;
        if (this.props.selection.length > 1) {
            msg = this.getSelectionTip("app.users.deleteUsers") + '?';
        } else {
            msg = Locale.getMessage('app.users.removeUser');
        }
        const bodymsg  = Locale.getMessage('app.users.unassignUser');

        return (
            <QBModal
                show={this.state.confirmDeletesDialogOpen}
                primaryButtonName={Locale.getMessage('app.users.removeButton')}
                primaryButtonOnClick={this.handleBulkDelete}
                leftButtonName={Locale.getMessage('app.users.cancel')}
                leftButtonOnClick={this.cancelBulkDelete}
                bodyMessage={bodymsg}
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
        return (
            <div className={'reportActions'}>
                <div className={'reportActionsBlock'}>
                    {<span className="selectedRowsLabel">{this.props.selection.length}</span>}
                    <div className="actionIcons">
                        <ActionIcon icon="mail" tip={Locale.getMessage("unimplemented.emailApp")} disabled={true} identifier="mail"/>
                        {this.getEmailAction()}
                        <ActionIcon icon="settings" tip={Locale.getMessage("unimplemented.settingsRole")} disabled={true} identifier="settings"/>
                        <ActionIcon icon="errorincircle-fill" tip={this.getSelectionTip(this.props.selection.length > 1 ? "app.users.deleteUsers" : "app.users.deleteUser")} onClick={this.handleDelete} identifier="errorincircle-fill"/>
                    </div>
                </div>
                {this.getConfirmDialog()}
            </div>
        );
    }
}

UserActions.propTypes = {
    selection: PropTypes.array,
    roleId: PropTypes.string,
    appId: PropTypes.string,
    onEditSelected: PropTypes.func
};

export default UserActions;
