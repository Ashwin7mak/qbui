import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import MultiStepDialog from '../../../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {assignUserToAppRole} from '../../../../actions/appRoleActions';
import {NotificationManager} from 'react-notifications';
import {I18nMessage} from "../../../../utils/i18nMessage";
import AddUserPanel from './addUserPanel';
import Locale from '../../../../locales/locales';
import './addUserDialog.scss';

export class AddUserDialog extends React.Component {

    constructor(props) {
        super(props);

        // bind to fix context for event handlers
        this.onFinished = this.onFinished.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.isValid = this.isValid.bind(this);
    }

    componentWillMount() {
        this.isValid(false);
    }

    /**
     * Handles multi-step modal dialog cancel event
     * @returns void
     */
    onCancel() {
        this.isValid(false);
        this.props.hideDialog(false);
    }

    /**
     * Handles On click of the Add Button
     * @returns void
     */
    onFinished() {
        if (this.props.assignUserToAppRole) {
            const userInfo = {
                userId: this.userPanel.getSelectedUser(),
                roleId: this.props.userRoleIdToAdd
            };

            this.props.assignUserToAppRole(this.props.appId, userInfo.roleId, userInfo.userId).then(
                () => {
                    this.isValid(false);
                    this.props.hideDialog(false);
                    //this.props.onAddedUser(userInfo.userId);
                    NotificationManager.success(Locale.getMessage('app.users.userAdded'));
                },
                () => {
                    // leave the dialog open but issue a growl indicating an error
                    NotificationManager.error(Locale.getMessage('app.users.userAddError'));
                }
            );
        }
    }

    /**
     * sets Modal input valid state
     * @returns void
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
        return (<MultiStepDialog show={Boolean(this.props.addUserToAppDialogOpen)}
                                 classes={classes.join(' ')}
                                 onCancel={this.onCancel}
                                 onFinished={this.onFinished}
                                 canProceed={this.state.isValid}
                                 finishedTooltip={"Select a user"}
                                 finishedButtonLabel="Add"
        >
            <div className="addUserPanel">
                <div className="title"><I18nMessage message="addUserToApp.title"/> {this.props.selectedApp.name}</div>
                <div className="description"><I18nMessage message="addUserToApp.description"/></div>
                <AddUserPanel appRoles={this.props.appRoles}
                              realmUsers={this.props.realmUsers}
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
    realmUsers: PropTypes.arrayOf(PropTypes.object),
    searchUsers: PropTypes.func,
    appRoles: PropTypes.arrayOf(PropTypes.object),
    assignUserToAppRole: PropTypes.func,
    setUserRoleToAdd: PropTypes.func,
    userRoleIdToAdd: PropTypes.number,
    appId: PropTypes.string,
    selectedApp: PropTypes.any,
    existingUsers: PropTypes.object,
    hideDialog: PropTypes.func
};

const mapDispatchToProps = (dispatch) => {
    return {
        assignUserToAppRole: (appId, roleId, userId) => {return dispatch(assignUserToAppRole(appId, roleId, userId));}
    };
};

export default connect(
    null,
    mapDispatchToProps
)(AddUserDialog);
