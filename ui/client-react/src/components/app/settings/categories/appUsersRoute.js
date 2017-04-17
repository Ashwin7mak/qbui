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
import './appUsersRoute.scss';

const AppUsersRoute = React.createClass({

    componentDidMount() {
        this.props.flux.actions.loadAppRoles(this.props.params.appId);
        this.props.flux.actions.loadAppOwner(this.props.selectedApp.ownerId);
    },

    componentWillReceiveProps(props) {
        if (props.params.appId && props.selectedApp.ownerId) {
            if (this.props.params.appId !== props.params.appId) {
                this.props.flux.actions.loadAppRoles(this.props.params.appId);
                this.props.flux.actions.loadAppOwner(this.props.selectedApp.ownerId);
            }
        } else {
            this.props.flux.actions.loadAppRoles(null);
            this.props.flux.actions.loadAppOwner(null);
        }

        if (this.props.params.appId !== props.params.appId && this.props.selectedApp.ownerId !== props.selectedApp.ownerId) {
            this.props.flux.actions.loadAppRoles(this.props.params.appId);
            this.props.flux.actions.loadAppOwner(this.props.selectedApp.ownerId);
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

                    <AppSettingsStage appUsers={this.props.appUsersUnfiltered}
                                      appRoles={this.props.appRoles}
                                      appOwner={this.props.appOwner}/>
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
