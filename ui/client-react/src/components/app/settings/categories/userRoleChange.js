import React from 'react';
import {connect} from 'react-redux';
import MultiStepDialog from '../../../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {I18nMessage} from "../../../../utils/i18nMessage";
import Locale from '../../../../locales/locales';
import {toggleChangeUserRoleDialog} from '../../../../actions/appActions';
import {removeUsersFromAppRole, assignUsersToAppRole} from '../../../../actions/appRoleActions';
import  Select from 'react-select';
import constants from '../../../../../../common/src/constants';
import {NotificationManager} from 'react-notifications';

import './userRoleChange.scss';

class UserRoleChange extends React.Component {

    constructor(props) {
        super(props);
        this.state = {selectedRole: ''};
        this.onFinished = this.onFinished.bind(this);
        this.getRoles = this.getRoles.bind(this);
        this.updateRole = this.updateRole.bind(this);
    }

	/**
	 * dialog finished
	 */
    onFinished = () => {
        const {appId, roleId, selectedUserRows} = this.props;
        this.props.removeUsersFromAppRole(appId, roleId, selectedUserRows).then(()=>{
            this.props.assignUsersToAppRole(appId, this.state.selectedRole, selectedUserRows).then(()=>{
                this.props.toggleChangeUserRoleDialog(false);
                let msg = this.props.getSelectionTip(selectedUserRows > 1 ? "changeUserRole.success" : "changeUserRole.pluralSuccess");
                NotificationManager.success(msg);
            });
        });
    };


	/**
	 * get user roles in a react-select key-value pair structure
	 * @returns [] User Roles
	 */
    getRoles() {
        let defaultRole = constants.DEFAULT_ROLE;
        const roles = this.props.appRoles.map((appRole)=>{
            if (appRole.name === defaultRole) {defaultRole = appRole.id;}
            return {value: appRole.id, label: appRole.name, clearableValue: false};
        });
        roles.sort((a, b)=>{
            return b.value - a.value;
        });
        if (this.state.selectedRole === '') {
            this.state.selectedRole = defaultRole;
        }
        return roles;
    }

	/**
	 * update role in state on user selection
	 * @param roleId
	 */
    updateRole(roleId) {
        this.setState({
            selectedRole: roleId
        });
    }


	/**
	 * render the modal dialog after succesfully adding user to an app
	 * @returns {XML}
	 */
    render() {
        let {selectedUserRows} = this.props;
        return (
			<MultiStepDialog
				show={this.props.changeUserRoleDialog}
				classes="userRoleChange"
				onFinished={this.onFinished}
				onCancel={()=>{this.props.toggleChangeUserRoleDialog(false);}}
				showCancelButton={true}
				showFinishedButton={true}
				finishedButtonLabel={Locale.getMessage("changeUserRole.change")}>
				<div className="userRoleContent">
					<div className="title"><I18nMessage message="changeUserRole.userRoleTitle"/></div>
					<div className="description">{this.props.getSelectionTip(selectedUserRows > 1 ? "changeUserRole.userRoleText" : "changeUserRole.pluralUserRoleText")}</div>
					<div className="userRoleText">
						<div className="userRoleDetails">
							<div className="assignRole panel-items">
								<Select
									autofocus
									options={this.getRoles()}
									searchable={false}
									simpleValue
									clearable={false}
									value={this.state.selectedRole}
									onChange={this.updateRole}
								/>
							</div>
						</div>
					</div>
				</div>
			</MultiStepDialog>);
    }
}

const mapStateToProps = (state) => {
    return {
        changeUserRoleDialog: state.appUsers.changeUserRoleDialog
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleChangeUserRoleDialog: (isOpen)=> {dispatch(toggleChangeUserRoleDialog(isOpen));},
        removeUsersFromAppRole: (appId, roleId, userId)=> {return dispatch(removeUsersFromAppRole(appId, roleId, userId));},
        assignUsersToAppRole: (appId, roleId, userId)=> {return dispatch(assignUsersToAppRole(appId, roleId, userId));}
    };
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserRoleChange);
