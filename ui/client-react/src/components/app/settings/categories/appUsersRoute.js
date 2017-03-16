/**
 * Created by rbeyer on 2/4/17.
 */
import React from 'react';
import UserManagement from './userManagement';
import Stage from '../../../stage/stage';
import IconActions from '../../../actions/iconActions';
import QBIcon from '../../../qbIcon/qbIcon';
import AppSettingsStage from '../appSettingsStage';
import Locale from '../../../../locales/locales';
import {I18nMessage} from '../../../../utils/i18nMessage';
import './appUsersRoute.scss';

const AppUsersRoute = React.createClass({

    componentDidMount() {
        this.props.flux.actions.loadAppRoles(this.props.params.appId);
    },

    componentWillReceiveProps(props) {
        if (props.params.appId) {
            if (this.props.params.appId !== props.params.appId) {
                this.props.flux.actions.loadAppRoles(this.props.params.appId);
            }
        } else {
            this.props.flux.actions.loadAppRoles(null);
        }

        if (this.props.params.appId !== props.params.appId) {
            this.props.flux.actions.loadAppRoles(this.props.params.appId);
        }
    },

    getPageActions() {
        const actions = [
            {msg: 'app.users.addUser', icon:'add', className:'addRecord', disabled: true},
            {msg: 'unimplemented.makeFavorite', icon:'star', disabled: true},
            {msg: 'unimplemented.email', icon:'mail', disabled: true},
            {msg: 'unimplemented.print', icon:'print', disabled: true}
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

    render() {
        return (
            <div>
                <Stage stageHeadline={this.getStageHeadline()}
                       pageActions={this.getPageActions()}>

                    <AppSettingsStage appUsers={this.props.appUsersUnfiltered} appRoles={this.props.appRoles}/>
                </Stage>
                <div className="userManagementContainer">
                    <UserManagement appId={this.props.params.appId}
                                    appUsers={this.props.appUsersUnfiltered}
                                    appRoles={this.props.appRoles}
                    />
                </div>
            </div>
        );
    }

});

export default AppUsersRoute;
