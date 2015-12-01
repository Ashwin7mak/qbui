import React from 'react';
import {Nav, Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';
import Loader  from 'react-loader';
import {I18nMessage} from '../../utils/i18nMessage';
import qbLogo from '../../assets/images/intuit_logo_white.png';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import Fluxxor from 'fluxxor';
import './leftNav.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

let LeftNav = React.createClass({
    mixins: [FluxMixin],

    getInitialState() {
        return {
            appsIsOpen: false,
            reportsIsOpen: false
        };
    },

    toggleApps: function() {
        this.setState({appsIsOpen: !this.state.appsIsOpen});
    },

    createBranding() {
        return (
            <div className="branding">
                <img src={qbLogo} />
                {this.props.selectedAppId &&
                    <div className="appsToggle" onClick={this.toggleApps}>{this.props.selectedAppId}<Glyphicon
                        glyph="triangle-bottom"/></div>
                }
            </div>
        );
    },

    showReports(tableId) {
        const flux = this.getFlux();
        flux.actions.loadReports(this.props.selectedAppId, tableId);
        this.setState({reportsIsOpen: true});
    },
    hideReports() {
        this.setState({reportsIsOpen: false});
    },

    getGlyphName(item) {

        if (item.icon) {
            return item.icon;
        } else {
            return 'th-list';
        }
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

    buildNavItem(item, selectedId) {

        let label = item.name;
        let tooltipID = item.key ? item.key : item.name;
        if (item.key) {
            label = (<I18nMessage message={item.key}/>);
        }

        const tooltip = (<Tooltip className={ this.props.open ? 'leftNavTooltip' : 'leftNavTooltip show' }
                                  id={tooltipID}>{label}:{selectedId}</Tooltip>);

        let selectedClass = item.id && (item.id.toString() === selectedId) ? 'selected' : '';

        return (
            <OverlayTrigger key={tooltipID} placement="right" overlay={tooltip}>
                <li className={"link " + selectedClass}>
                    <Link className="leftNavLink" to={item.link} onClick={this.props.onSelect}>
                        <Glyphicon glyph={this.getGlyphName(item)}/> {label}
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
                    {!this.props.selectedAppId || this.state.appsIsOpen ? <AppsView key={this.state.appsIsOpen} {...this.props} buildItem={this.buildNavItem} buildHeading={this.buildHeadingItem}/> :
                    <TablesView key={this.state.appsIsOpen} {...this.props} showReports={this.showReports} buildItem={this.buildNavItem} buildHeading={this.buildHeadingItem} getAppTables={this.getAppTables}/> }
                </ReactCSSTransitionGroup>

                <ReportsView reportsOpen={this.state.reportsIsOpen} onBack={()=>{this.hideReports();}} {...this.props} buildItem={this.buildNavItem} buildHeading={this.buildHeadingItem} />
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
                <div className="searchApps">
                    <input type="text" placeholder="Search apps..." value={this.state.searchText} onChange={this.onChangeSearch}/>
                </div>
                <ul>

                    {this.props.apps && this.props.buildHeading({key: 'nav.appsHeading'}, false)}
                    {this.props.apps && this.props.apps.map((app) => {
                        app.icon = 'apple';
                        return this.props.buildItem(app, this.props.selectedAppId);
                    })}
                </ul>

            </div>
        );
    }
});

let TablesView = React.createClass({

    buildTableItem(table, selectedId) {

        let label = table.name;

        const tooltip = (<Tooltip className={ this.props.open ? 'leftNavTooltip' : 'leftNavTooltip show' }
                                  id={label}>{label}</Tooltip>);

        let selectedClass = table.id && (table.id.toString() === selectedId) ? 'selected' : '';

        return (
            <OverlayTrigger key={table.id} placement="right" overlay={tooltip}>
                <li className={"link " + selectedClass}>
                    <Link className="leftNavLink" to={table.link} onClick={this.props.onSelect}>
                        <Glyphicon glyph={table.icon}/> {label}
                    </Link>
                    <a href="#" className="right" onClick={()=>this.props.showReports(table.id)}><Glyphicon glyph="list"/></a>
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
                        return this.buildTableItem(table, table.id);
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
    render() {
        return (
            <div className={"reportsView " + (this.props.reportsOpen ? "open" : "")}>
                <ul>
                    <li><a className="backLink" onClick={this.props.onBack}><Glyphicon glyph="chevron-left"/> Back</a></li>
                    <li className="searchReports">
                        <input type="text" placeholder="Search my reports..." value={this.state.searchText} onChange={this.onChangeSearch}/>
                    </li>

                    {this.props.selectedTableId && this.props.buildHeading({key: 'nav.reportsHeading'}, this.props.reportsData.loading)}
                    {this.props.selectedTableId && this.props.reportsData.list && this.props.reportsData.list.map((report) => {
                        report.icon = 'list-alt';
                        return this.props.buildItem(report, this.props.selectedReportId);
                    })}
                </ul>
            </div>
        );
    }
});



export default LeftNav;
