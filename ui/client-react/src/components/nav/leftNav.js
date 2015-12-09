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

    buildHeadingItem(item, loadingCheck) {

        if (this.props.open) {
            return (
                <li key={item.key} className="heading"><I18nMessage message={item.key}/>
                    <Loader scale={.5} right={'90%'} loaded={!loadingCheck}/>
                </li>);
        } else {
            return (<li key={item.key}><a className="heading"></a></li>);
        }
    },

    buildNavItem(item, onSelect) {

        let label = item.name;
        let tooltipID = item.key ? item.key : item.name;
        if (item.key) {
            label = (<I18nMessage message={item.key}/>);
        }

        const tooltip = (<Tooltip className={ this.props.open ? 'leftNavTooltip' : 'leftNavTooltip show' }
                                  id={tooltipID}>{label}</Tooltip>);

        return (
            <OverlayTrigger key={tooltipID} placement="right" overlay={tooltip}>
                <li className={"link" }>
                    <Link className="leftNavLink" to={item.link} onClick={onSelect}>
                        <Hicon icon={item.icon}/> {this.props.open ? label : ""}
                    </Link>
                </li>
            </OverlayTrigger>
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
                        <AppsList key={"apps"} {...this.props} toggleApps={this.toggleAppsList} buildItem={this.buildNavItem} buildHeadingItem={this.buildHeadingItem} /> :
                        <TablesList key={"tables"} {...this.props} showReports={(id)=>{this.props.onSelectReports(id);} } buildItem={this.buildNavItem} buildHeadingItem={this.buildHeadingItem} getAppTables={this.getAppTables}/> }

                </ReactCSSTransitionGroup>
                {this.props.globalActions && <GlobalActions actions={this.props.globalActions} onSelect={this.props.onSelect}/>}

                <ReportsList open={this.props.open} onSelect={this.props.onSelect} reportsOpen={this.props.showReports} onBack={this.props.onHideReports} reportsData={this.props.reportsData} buildItem={this.buildNavItem} buildHeading={this.buildHeadingItem} />

            </div>
        );
    }
});

export default LeftNav;
