import React from 'react';
import Locale from '../../locales/locales';
import ActionIcon from './actionIcon';
import QBModal from '../qbModal/qbModal';
import './reportActions.scss';

/**
 * User-level actions
 *
 */
export const UserActions = React.createClass({
    propTypes: {
        selection: React.PropTypes.array,
        roleId: React.PropTypes.string,
        appId: React.PropTypes.string,
        onEditSelected: React.PropTypes.func
    },

    getInitialState() {
        return {
            confirmDeletesDialogOpen: false
        };
    },
    getEmailSubject() {
        return "Email subject goes here";
    },

    getEmailBody() {
        return "Email body goes here";
    },

    getSelectionTip(actionMsg) {
        const action = Locale.getMessage(actionMsg);
        const user = Locale.getMessage('app.users.singular');
        const users = Locale.getMessage('app.users.plural');
        const suffix = this.props.selection.length === 1 ? user : users;

        return action + " " + this.props.selection.length + " " + suffix;
    },

    /**
     * delete the selected users, after confirmation if multiple users selected
     */
    handleDelete() {
        this.setState({confirmDeletesDialogOpen: true});
    },

    /**
     * multiple user delete was cancelled from dialog
     */
    cancelBulkDelete() {
        this.setState({confirmDeletesDialogOpen: false});
    },
    /**
     * this.props.selection has the current selected rows with the unique identifier as the value in the array
     */
    handleBulkDelete() {
        {this.props.actions.unassignUsers(this.props.appId, this.props.roleId, this.props.selection);}
        this.setState({confirmDeletesDialogOpen: false});
    },

    /**
     * render a QBModal
     * @returns {XML}
     */
    getConfirmDialog() {

        let msg;

        if (this.props.selection.length > 1) {
            const users = "users";
            const deleteMSg = "Remove";
            msg = `${deleteMSg} ${this.props.selection.length} ${users}?`;
        } else {
            msg = Locale.getMessage('app.users.removeUser');
        }

        const bodymsg  = Locale.getMessage('app.users.unassignUser');

        return (
            <QBModal
                show={this.state.confirmDeletesDialogOpen}
                primaryButtonName={Locale.getMessage('app.users.remove')}
                primaryButtonOnClick={this.handleBulkDelete}
                leftButtonName={Locale.getMessage('app.users.cancel')}
                leftButtonOnClick={this.cancelBulkDelete}
                bodyMessage={bodymsg}
                type="error"
                title={msg}/>);
    },
    getEmailAction() {
        //TODO Email action is disabled for now until its implemented.
        return <ActionIcon icon="download-cloud" tip={Locale.getMessage("unimplemented.downloadCloud")} disabled={true}/>;
    },

    /**
     * render the actions
     */
    render() {
        return (
            <div className={'reportActions'}>
                <div>
                    {<span className="selectedRowsLabel">{this.props.selection.length}</span>}
                    <div className="actionIcons">
                        <ActionIcon icon="mail" tip={Locale.getMessage("unimplemented.emailApp")} disabled={true}/>
                        {this.getEmailAction()}
                        <ActionIcon icon="settings" tip={Locale.getMessage("unimplemented.settingsRole")} disabled={true}/>
                        <ActionIcon icon="errorincircle-fill" tip={this.getSelectionTip("app.users.remove")} onClick={this.handleDelete}/>
                    </div>
                </div>
                {this.getConfirmDialog()}
            </div>
        );
    }
});

export default UserActions;
