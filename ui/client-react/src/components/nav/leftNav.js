import React from 'react';
import {Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';
import Loader  from 'react-loader';
import {I18nMessage} from '../../utils/i18nMessage';
import qbLogo from '../../assets/images/intuit_logo_white.png';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import GlobalActions from '../global/GlobalActions';
import AppsList from './appsList';
import TablesList from './tablesList';
import ReportsList from './reportsList';
import Fluxxor from 'fluxxor';
import Hicon from '../harmonyIcon/harmonyIcon';

import './leftNav.scss';

//let FluxMixin = Fluxxor.FluxMixin(React);

let LeftNav = React.createClass({

    toggleAppsList: function() {
        let flux = this.props.flux;
        flux.actions.toggleAppsList();
    },

    createBranding() {
        let app = _.findWhere(this.props.apps, {id: this.props.selectedAppId});
        return (this.props.open &&
            <div className="branding">
                <img src={qbLogo} />
                {this.props.selectedAppId &&
                    <div className="appsToggle" onClick={this.toggleAppsList}>{app ? app.name : ''}&nbsp;
                        <Hicon icon="chevron-down"/></div>
                }
            </div>
        );
    },

    getAppTables(appId) {
        let app = _.findWhere(this.props.apps, {id: appId});

        return app ? app.tables : [];
    },

    render() {
        return (

            <div className={"leftNav " + (this.props.open ? "open " : "closed ") + (this.props.appsListOpen ? "appsListOpen" : "")}>
                {this.createBranding()}

                <ReactCSSTransitionGroup transitionName="leftNavList" component="div" className={"transitionGroup"} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                    {!this.props.selectedAppId || this.props.appsListOpen ?
                        <AppsList key={"apps"} {...this.props} toggleApps={this.toggleAppsList}  /> :
                        <TablesList key={"tables"} {...this.props} showReports={(id)=>{this.props.onSelectReports(id);} } getAppTables={this.getAppTables}/> }

                </ReactCSSTransitionGroup>
                {this.props.globalActions && <GlobalActions actions={this.props.globalActions} onSelect={this.props.onSelect}/>}

                <ReportsList open={this.props.open} onSelect={this.props.onSelect} reportsOpen={this.props.showReports} onBack={this.props.onHideReports} reportsData={this.props.reportsData} />

            </div>
        );
    }
});

export default LeftNav;
