import React from 'react';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
import {Link} from 'react-router';
import Loader  from 'react-loader';
import {I18nMessage} from '../../utils/i18nMessage';
import qbLogo from '../../assets/images/intuit_logo_white.png';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import GlobalActions from '../global/globalActions';
import AppsList from './appsList';
import TablesList from './tablesList';
import ReportsList from './reportsList';
import QBicon from '../qbIcon/qbIcon';
import './leftNav.scss';

let LeftNav = React.createClass({

    propTypes: {
        open:React.PropTypes.bool.isRequired,
        appsListOpen:React.PropTypes.bool.isRequired,
        selectedAppId:React.PropTypes.string,
        selectedTableId:React.PropTypes.string,
        onToggleAppsList:React.PropTypes.func,
        onSelect:React.PropTypes.func,
        onSelectReports:React.PropTypes.func,
        globalActions:React.PropTypes.array
    },

    /**
     * create a branding section (logo with an apps toggle if an app is selected)
     */
    createBranding() {
        let app = _.findWhere(this.props.apps, {id: this.props.selectedAppId});
        return (this.props.open &&
            <div className="branding">
                <img src={qbLogo} />
                {this.props.selectedAppId &&
                    <div className="appsToggle" onClick={this.props.toggleAppsList}>{app ? app.name : ''}&nbsp;
                        <QBicon icon="caret-down"/>
                    </div>
                }
            </div>
        );
    },

    getAppTables(appId) {
        let app = _.findWhere(this.props.apps, {id: appId});

        return app ? app.tables : [];
    },

    onSelectApp() {
        this.props.toggleAppsList(false);
    },
    render() {
        return (

            <div className={"leftNav " + (this.props.open ? "open " : "closed ") + (this.props.appsListOpen ? "appsListOpen" : "")}>
                {this.createBranding()}

                <ReactCSSTransitionGroup transitionName="leftNavList" component="div" className={"transitionGroup"} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                    {!this.props.selectedAppId || this.props.appsListOpen ?
                        <AppsList key={"apps"} {...this.props} onSelectApp={this.onSelectApp}  /> :
                        <TablesList key={"tables"} {...this.props} showReports={(id)=>{this.props.onSelectReports(id);} } getAppTables={this.getAppTables}/> }

                </ReactCSSTransitionGroup>

                {this.props.globalActions && <GlobalActions actions={this.props.globalActions} onSelect={this.props.onSelect}/>}

            </div>
        );
    }
});

export default LeftNav;
