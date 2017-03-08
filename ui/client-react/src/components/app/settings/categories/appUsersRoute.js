/**
 * Created by rbeyer on 2/4/17.
 */
import React from 'react';
import Logger from '../../../../utils/logger';
import {Link} from 'react-router';
import {APP_ROUTE} from '../../../../constants/urlConstants';
import UserManagement from './userManagement';
import Stage from '../../../stage/stage';
import IconActions from '../../../actions/iconActions';
import QBIcon from '../../../qbIcon/qbIcon';
import AppSettingsStage from '../appSettingsStage';


let logger = new Logger(); 

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
            {msg: 'unimplemented.print', icon:'print', disabled: true}
        ];
        return (<IconActions className="pageActions" actions={actions}/>);
    },


    getStageHeadline() {
        const settingsName = `${this.props.selectedApp.name}: Users`;
        const settingsLinkText = `${this.props.selectedApp.name} Settings`;
        const appId = this.props.params.appId;
        const settingsLink = `${APP_ROUTE}/${appId}/settings`;
        return (
            <div className="reportStageHeadline">

                <div className="navLinks">
                    <Link className="tableHomepageIconLink" to={settingsLink}><QBIcon icon="settings"/></Link>
                    {<Link className="tableHomepageLink" to={settingsLink}>{settingsLinkText}</Link>}
                </div>

                <div className="stageHeadline">
                    <h3 className="reportName">{settingsName}</h3>
                </div>
            </div>);
    },

    render() {
        return (
            <div className="userManagementContainer">
                <Stage stageHeadline={this.getStageHeadline()}
                       pageActions={this.getPageActions()}>

                    <AppSettingsStage appUsers={this.props.appUsersUnfiltered} appRoles={this.props.appRoles}/>
                </Stage>
                <UserManagement appId={this.props.params.appId}
                                appUsers={this.props.appUsersUnfiltered}
                                appRoles={this.props.appRoles}
                />
            </div>
        );
    }

});

export default AppUsersRoute;
