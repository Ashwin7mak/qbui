import React from 'react';
import {Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';
import Loader  from 'react-loader';
import {I18nMessage} from '../../utils/i18nMessage';
import qbLogo from '../../assets/images/intuit_logo_white.png';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import AppsList from './appsList';
import TablesList from './tablesList';
import ReportsList from './reportsList';

import './leftNav.scss';


let LeftNav = React.createClass({

    getInitialState() {
        return {
            appsIsOpen: false
        };
    },

    toggleApps: function() {
        this.setState({appsIsOpen: !this.state.appsIsOpen});
    },

    createBranding() {
        let app = _.findWhere(this.props.apps, {id: this.props.selectedAppId});
        return (this.props.open &&
            <div className="branding">
                <img src={qbLogo} />
                {this.props.selectedAppId &&
                    <div className="appsToggle" onClick={this.toggleApps}>{app ? app.name : ''}&nbsp;
                        <Glyphicon glyph="triangle-bottom"/></div>
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
                        <Glyphicon glyph={item.icon}/> {this.props.open ? label : ""}
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

            <div className={"leftMenu " + (this.props.open ? "open " : "closed ") + (this.state.appsIsOpen ? "appsListOpen" : "")}>
                {this.createBranding()}

                <ReactCSSTransitionGroup transitionName="leftNavList" component="div" className={"transitionGroup"} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                    {!this.props.selectedAppId || this.state.appsIsOpen ?
                        <AppsList key={"apps"} {...this.props} toggleApps={this.toggleApps} buildItem={this.buildNavItem} buildHeadingItem={this.buildHeadingItem} /> :
                        <TablesList key={"tables"} {...this.props} showReports={(id)=>{this.props.onSelectReports(id);} } buildItem={this.buildNavItem} buildHeadingItem={this.buildHeadingItem} getAppTables={this.getAppTables}/> }
                </ReactCSSTransitionGroup>

                <ReportsList open={this.props.open} reportsOpen={this.props.showReports} onBack={this.props.onHideReports} reportsData={this.props.reportsData} buildItem={this.buildNavItem} buildHeading={this.buildHeadingItem} />
            </div>
        );
    }
});

export default LeftNav;
