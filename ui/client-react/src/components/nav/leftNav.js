import React from 'react';
import {Nav, Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router';
import Loader  from 'react-loader';
import './leftNav.scss';
import {I18nMessage} from '../../utils/i18nMessage';

let LeftNav = React.createClass({

    getGlyphName(item) {

        if (item.icon) {
            return item.icon;
        } else {
            return 'th-list';
        }
    },

    buildHeadingItem: function(item, loadingCheck) {

        if (this.props.open) {
            return (
                <li key={item.key}>
                    <Loader scale={.5} right={'90%'} loaded={!loadingCheck}/>
                    <a className="heading"><I18nMessage message={item.key}/></a>
                </li>);
        } else {
            return (<li key={item.key}><a className="heading"></a></li>);
        }
    },

    buildNavItem: function(item, selectedId) {

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
                <li className={selectedClass}>
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


            <div className={"leftMenu " + (this.props.open ? "open" : "closed")}>

                <Nav stacked activeKey={1}>
                    {this.props.items ? this.props.items.map((item) => {
                        return item.heading ?
                            this.buildHeadingItem(item) :
                            this.buildNavItem(item);
                    }) : null}

                    {this.props.apps && this.buildHeadingItem({key: 'nav.appsHeading'}, false)}
                    {this.props.apps && this.props.apps.map((app) => {
                        app.icon = 'apple';
                        return this.buildNavItem(app, this.props.selectedAppId);
                    })}

                    {this.props.selectedAppId && this.buildHeadingItem({key: 'nav.tablesHeading'}, false)}
                    {this.props.selectedAppId && this.getAppTables(this.props.selectedAppId).map((table) => {
                        table.link = '/app/' + this.props.selectedAppId + '/table/' + table.id;
                        table.icon = 'book';
                        return this.buildNavItem(table, this.props.selectedTableId);
                    })}

                    {this.props.selectedTableId && this.buildHeadingItem({key: 'nav.reportsHeading'}, this.props.reportsData.loading)}
                    {this.props.selectedTableId && this.props.reportsData.list && this.props.reportsData.list.map((report) => {
                        report.icon = 'list-alt';
                        return this.buildNavItem(report, this.props.selectedReportId);
                    })}

                  </Nav>

            </div>

        );
    }
});

export default LeftNav;
