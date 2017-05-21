import React from 'react';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {NotificationManager} from 'react-notifications';
import {I18nMessage} from "../../utils/i18nMessage";
import AddUserPanel from './addUserPanel';
import Locale from '../../locales/locales';
import './addUserDialog.scss';

export class AddUserDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isValid: false
        };
        // bind to fix context for event handlers
        this.onFinished = this.onFinished.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.isValid = this.isValid.bind(this);
    }

    /**
     * cancel
     */
    onCancel() {
        this.state.isValid = false;
        this.props.hideDialog(false);
    }

    /**
     * On click of the Add Button
     */
    onFinished() {
        const userInfo = {
            // refs is used here to get the instance of
            // AddUserPanel, as opposed to using redux/flux actions
            userId: this.userPanel.getSelectedUser(),
            roleId: this.props.userRoleToAdd,
        };
        const responsePromise = this.props.assignUserToApp(this.props.appId, userInfo);

        if (responsePromise) {
            responsePromise.then(
            (response) => {
                this.props.hideDialog(false);
                this.props.onAddedUser(userInfo.userId);
            },
            (error) => {
                // leave the dialog open but issue a growl indicating an error
                NotificationManager.error(Locale.getMessage('users.addUser'), Locale.getMessage('failed'));
            }
        );
        }

    }

    /**
     * check for any validation errors
     * @returns {boolean}
     */
    isValid(validState) {
        this.setState({
            isValid: validState
        });
    }

    /**
     * render the multi-step modal dialog
     * @returns {XML}
     */
    render() {

        const classes = ['addUserDialog'];
        return (<MultiStepDialog show={this.props.addUserToAppDialogOpen}
                                 classes={classes.join(' ')}
                                 onCancel={this.onCancel}
                                 onFinished={this.onFinished}
                                 canProceed={this.state.isValid}
                                 finishedButtonLabel="Add"
        >
            <div className="addUserPanel">
                <div className="title"><I18nMessage message="addUserToApp.title"/> {this.props.selectedApp.name}</div>
                <div className="description"><I18nMessage message="addUserToApp.description"/></div>
                <AddUserPanel appRoles={this.props.appRoles}
                              allUsers={this.props.allUsers}
                              searchUsers={this.props.searchUsers}
                              isValid={this.isValid}
                              existingUsers={this.props.existingUsers}
                              setUserRoleToAdd={this.props.setUserRoleToAdd}
                              ref={(userPanel)=>{this.userPanel = userPanel;}}
                               />
            </div>
        </MultiStepDialog>);
    }
}

AddUserDialog.propTypes = {
    // TODO: add proptypes
};

export default AddUserDialog;
