import React from 'react';
import {Nav, Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';
import Loader  from 'react-loader';
import './leftNav.scss';
import {I18nMessage} from '../../utils/i18nMessage';
import qbLogo from '../../assets/images/intuit_logo_white.png';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

let LeftNav = React.createClass({

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
                <p onClick={this.toggleApps}>Sams Project Management <Glyphicon glyph="triangle-bottom" /></p>
            </div>
        );
    },

    toggleReport() {
        this.setState({reportsIsOpen: !this.state.reportsIsOpen});
        console.log('toggle Reports');
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
            <OverlayTrigger key={label} placement="right" overlay={tooltip}>
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
    renderMATT() {
        var className = "leftNav" + (this.state.appsIsOpen ? " leftNav--appsOpen" : "") + (this.state.reportsIsOpen ? " leftNav--reportsOpen" : "");

        var type = this.state.appsIsOpen ? "apps" : "tables";
        var content = this.state.appsIsOpen ? appsDummyData : tablesDummyData;
        return (
            <div className={className}>
                {this.createBranding()}
                <div className="leftNav__container">
                    <ReactCSSTransitionGroup transitionName="leftNav__content" component="div" className="leftNav__container" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
                        <PrimaryLevelContent key={type} type={type} data={content} toggleReports={this.toggleReport} />
                    </ReactCSSTransitionGroup>
                </div>
                <PrimaryLevelContent key="reports" type="reports" data={reportsDummyData} toggleReports={this.toggleReport} />
            </div>
        );
    },
    render() {
        return (

            <div className={"leftMenu " + (this.props.open ? "open" : "closed")}>
                {this.createBranding()}
                <ReactCSSTransitionGroup transitionName="leftNav__content" component="div" className="leftNav__container" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
                    {this.state.appsIsOpen ?
                        <AppsView {...this.props} buildItem={this.buildNavItem} buildHeading={this.buildHeadingItem}/> :
                        <TablesView {...this.props} buildItem={this.buildNavItem} buildHeading={this.buildHeadingItem} getAppTables={this.getAppTables}/>}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
});

let TablesView = React.createClass({

    render() {
        return (
            <div className="tablesView">
                <ul>
                    {this.props.selectedAppId && this.props.buildHeading({key: 'nav.tablesHeading'}, false)}
                    {this.props.selectedAppId && this.props.getAppTables(this.props.selectedAppId).map((table) => {
                        table.link = '/app/' + this.props.selectedAppId + '/table/' + table.id;
                        table.icon = 'book';
                        return this.props.buildItem(table, this.props.selectedTableId);
                    })}

                </ul>
            </div>
        );
    }
});

let ReportsView = React.createClass({

    render() {
        return (
            <div className="reportsView">
                <ul>
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

let AppsView = React.createClass({

    render() {
        return (
            <div className="appsView">
                <ul>
                {this.props.items ? this.props.items.map((item) => {
                    return item.heading ?
                        this.props.buildHeading(item) :
                        this.props.buildItem(item);
                }) : null}

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
let PrimaryLevelContent = React.createClass({
    render: function() {
        var className = "leftNav__content leftNav__" + this.props.type;

        return (
            <div className={className}>
                tables
                <ul>
                    {this.props.data.map((item, index) => (
                        <PrimaryLevelItem type={item.type} icon={item.icon} active={item.active} link={item.link} buttonClasses={item.buttonClasses} toggleReports={this.props.toggleReports}>{item.content}</PrimaryLevelItem>
                    ))}
                </ul>
            </div>
        );
    }
});

let PrimaryLevelItem = React.createClass({

    getDefaultProps: function() {
        return {
            type: 'link',
            link: '#',
            icon: null,
            active: false,
            buttonClasses: 'btn btn-primary btn-block'
        };
    },

    createGlyphicon: function() {
        if (this.props.icon) {
            return (<Glyphicon glyph={this.props.icon} />);
        } else {
            return null;
        }
    },

    render: function() {
        if (this.props.type === 'sectionHeader') {
            return <li className="section__header">{this.props.children}</li>;
        }

        if (this.props.type === 'button') {
            return <li><button className={this.props.buttonClasses} {...this.props}/></li>;
        }

        if (this.props.type === 'input') {
            return <li><div className="input-group input-group-sm"><input type="text" className="form-control" placeholder={this.props.children} /></div></li>;
        }

        if (this.props.type === 'back') {
            return <li onClick={this.props.toggleReports}><a href={this.props.link}>{this.createGlyphicon()}{this.props.children}</a></li>;
        }

        return (
            <li onClick={this.props.toggleReports}><a href={this.props.link}>{this.createGlyphicon()}{this.props.children}</a></li>
        );
    }
});


var reportsDummyData = [
    {
        type: 'back',
        content: 'Back',
        icon: 'chevron-left',
        link: '#',
        active: true,
        buttonClasses: null
    },
    {
        type: 'input',
        content: 'Search my reports',
        icon: null,
        link: null,
        active: false,
        buttonClasses: null
    },
    {
        type: 'sectionHeader',
        content: 'Recent Reports',
        icon: null,
        link: null,
        active: false,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'List All',
        icon: 'th-list',
        link: '#',
        active: false,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'List Changed',
        icon: 'th-list',
        link: '#',
        active: false,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'On Hold Projects',
        icon: 'dashboard',
        link: '#',
        active: false,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'Project Timeline',
        icon: 'calendar',
        link: '#',
        active: false,
        buttonClasses: null
    },
    {
        type: 'sectionHeader',
        content: 'Common Reports',
        icon: null,
        link: null,
        active: false,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'List All',
        icon: 'th-list',
        link: '#',
        active: false,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'List Changed',
        icon: 'th-list',
        link: '#',
        active: false,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'On Hold Projects',
        icon: 'dashboard',
        link: '#',
        active: false,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'Projects Cost Changed',
        icon: 'calendar',
        link: '#',
        active: false,
        buttonClasses: null
    }
];

var tablesDummyData = [
    {
        type: 'link',
        content: 'Home',
        icon: 'home',
        link: '#',
        active: true,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'Users',
        icon: 'user',
        link: '#',
        active: false,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'Favorites',
        icon: 'star',
        link: '#',
        active: false,
        buttonClasses: null
    },
    {
        type: 'sectionHeader',
        content: 'Tables',
        icon: null,
        link: '#',
        active: false,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'First Table',
        icon: 'stop',
        link: '#',
        active: true,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'Second Table',
        icon: 'stop',
        link: '#',
        active: false,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'Last Table',
        icon: 'stop',
        link: '#',
        active: false,
        buttonClasses: null
    }
];

var appsDummyData = [
    {
        type: 'input',
        content: 'Search my apps',
        icon: null,
        link: null,
        active: false,
        buttonClasses: null
    },
    {
        type: 'sectionHeader',
        content: 'Recent Apps',
        icon: null,
        link: null,
        active: false,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'App Name One',
        icon: 'star',
        link: '#',
        active: false,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'App Name Two',
        icon: 'star',
        link: '#',
        active: false,
        buttonClasses: null
    },
    {
        type: 'link',
        content: 'App Name Three',
        icon: 'star',
        link: '#',
        active: false,
        buttonClasses: null
    },
    {
        type: 'button',
        content: 'Apps Dashboard',
        icon: null,
        link: '#',
        active: false,
        buttonClasses: "btn btn-primary btn-block"
    }
];
export default LeftNav;
