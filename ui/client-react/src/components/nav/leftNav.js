import React from 'react';
import {Nav, Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';
import Loader  from 'react-loader';
import {I18nMessage} from '../../utils/i18nMessage';
import qbLogo from '../../assets/images/intuit_logo_white.png';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

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

            <div className={"leftMenu " + (this.props.open ? "open " : "closed ") + (this.state.appsIsOpen ? "appsViewOpen" : "")}>
                {this.createBranding()}

                <ReactCSSTransitionGroup transitionName="leftNavView" component="div"  transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
                    {!this.props.selectedAppId || this.state.appsIsOpen ? <AppsView key={this.state.appsIsOpen} {...this.props} toggleApps={this.toggleApps} buildItem={this.buildNavItem} buildHeading={this.buildHeadingItem} /> :
                    <TablesView key={this.state.appsIsOpen} {...this.props} showReports={(id)=>{this.props.onSelectReports(id);} } buildItem={this.buildNavItem} buildHeading={this.buildHeadingItem} getAppTables={this.getAppTables}/> }
                </ReactCSSTransitionGroup>

                <ReportsView open={this.props.open} reportsOpen={this.props.showReports} onBack={this.props.onHideReports} reportsData={this.props.reportsData} buildItem={this.buildNavItem} buildHeading={this.buildHeadingItem} />
            </div>
        );
    }
});

let AppsView = React.createClass({

    getInitialState() {
        return {searchText:""};
    },

    onChangeSearch(ev) {
        this.setState({searchText: ev.target.value});
    },
    render() {
        return (
            <div className="appsView leftNavView">
                {this.props.open ?
                <div className="searchApps">
                    <input type="text" placeholder="Search apps..." value={this.state.searchText} onChange={this.onChangeSearch}/>
                </div> : ""}
                <ul>
                    {this.props.apps && this.props.buildHeading({key: 'nav.appsHeading'}, false)}
                    {this.props.apps && this.props.apps.map((app) => {
                        app.icon = 'star';
                        return this.props.buildItem(app, this.props.toggleApps);
                    })}
                </ul>

            </div>
        );
    }
});

let TablesView = React.createClass({

    buildTableItem(table) {

        let label = table.name;

        const tooltip = (<Tooltip className={ this.props.open ? 'leftNavTooltip' : 'leftNavTooltip show' }
                                  id={label}>{label}</Tooltip>);

        return (
            <OverlayTrigger key={table.id} placement="right" overlay={tooltip}>
                <li className={"link"}>
                    <Link className="leftNavLink" to={table.link} onClick={this.props.onSelect}>
                        <Glyphicon glyph={table.icon}/> {this.props.open ? label : ""}
                    </Link>
                    { this.props.open ?
                        <a href="#" className="right" onClick={()=>this.props.showReports(table.id)}><Glyphicon glyph="list"/></a> : ""}
                </li>
            </OverlayTrigger>
        );
    },

    render() {
        return (
            <div className="tablesView leftNavView">

                <ul>
                    {this.props.items ? this.props.items.map((item) => {
                        return item.heading ?
                            this.props.buildHeading(item) :
                            this.props.buildItem(item);
                    }) : null}

                    {this.props.selectedAppId && this.props.buildHeading({key: 'nav.tablesHeading'}, false)}
                    {this.props.selectedAppId && this.props.getAppTables(this.props.selectedAppId).map((table) => {
                        table.link = '/app/' + this.props.selectedAppId + '/table/' + table.id;
                        table.icon = 'book';
                        return this.buildTableItem(table);
                    })}
                </ul>
            </div>
        );
    }
});

let ReportsView = React.createClass({

    getInitialState() {
        return {searchText:""};
    },

    onChangeSearch(ev) {
        this.setState({searchText: ev.target.value});
    },
    searchMatches(name) {
        return name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1;
    },
    reportList() {
        return this.props.reportsData.list && this.props.reportsData.list.map((report) => {
            report.icon = 'list-alt';

            return this.searchMatches(report.name) && this.props.buildItem(report);
        });
    },
    render() {
        return (
            <div className={"reportsView " + (this.props.reportsOpen ? "open" : "")}>
                {this.props.open ?
                <ul>

                    <li><a className="backLink" onClick={this.props.onBack}><Glyphicon glyph="chevron-left"/> Back</a></li>
                    <li className="searchReports">
                        <input type="text" placeholder="Search my reports..." value={this.state.searchText} onChange={this.onChangeSearch}/>
                    </li>

                    { this.props.buildHeading({key: 'nav.reportsHeading'}, this.props.reportsData.loading) }

                    {this.reportList()}
                </ul> :
                <ul>
                    <li><a className="backLink" onClick={this.props.onBack}><Glyphicon glyph="chevron-left"/></a></li>
                    {this.reportList()}
                </ul>}
            </div>
        );
    }
});



export default LeftNav;
