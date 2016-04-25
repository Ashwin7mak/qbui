import React from 'react';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
import {Link} from 'react-router';
import QBicon from '../qbIcon/qbIcon';
import NavItem from './navItem';
import Locale from '../../locales/locales';
import {I18nMessage} from '../../utils/i18nMessage';
import {tableIcon} from './TagsToIconsMap';

let TablesList = React.createClass({

    propTypes: {
        selectedAppId: React.PropTypes.string.isRequired,
        onSelect: React.PropTypes.func,
        showReports: React.PropTypes.func.isRequired,
        expanded: React.PropTypes.bool
    },
    getDefaultProps() {
        return {
            expanded: true
        };
    },
    getInitialState() {
        return {
            searching:false,
            searchText:""
        };
    },
    /**
     * update search text
     * @param e
     */
    onChangeSearch(ev) {
        this.setState({searchText: ev.target.value});
    },
    /**
     * check for table name matching search text
     */
    searchMatches(name) {
        return name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1;
    },
    /**
     * toggle search tables list
     */
    onClickTables() {
        const wasSearching = this.state.searching;
        this.setState({searching: !this.state.searching});

        if (!wasSearching) {
            this.setState({searchText: ""});
        }
    },

    /**
     * get link to table homepage
     */
    getTableLink(table) {
        return `/app/${this.props.selectedAppId}/table/${table.id}`;
    },

    /**
     * get component that appears when hovering over collapsed left nav
     * @param table
     * @returns {XML}
     */
    getHoverComponent(table) {
        return (<div className="hoverComponent">
            <Link to={table.link}>{table.name}</Link>
            <a href="#" className="right" onClick={()=>this.props.showReports(table.id)}><QBicon icon={"report-menu-3"}/></a>
        </div>);
    },

    /**
     * get list of table links for left nav
     * @returns {*}
     */
    tablesList() {
        return this.props.getAppTables(this.props.selectedAppId).map((table) => {
            table.link = this.getTableLink(table);
            table.icon = tableIcon(table.name);
            return this.searchMatches(table.name) &&
                <NavItem item={table}
                         key={table.id}
                         showSecondary={this.props.expanded}
                         secondaryIcon={"report-menu-3"}
                         secondaryOnSelect={this.props.showReports}
                         hoverComponent={this.getHoverComponent(table)}
                         onSelect={this.props.onSelect}
                         selected={table.id === this.props.selectedTableId}
                         open={true}/>;
        });
    },
    getNavItem(msg, link, icon, selected) {
        const hoverComponent = (<div className="hoverComponent">
            <Link to={link}><I18nMessage message={msg}/></Link>
        </div>);

        return (<NavItem item={{msg: msg, link:link, icon:icon}} selected={selected}
            hoverComponent={hoverComponent} open={true} onSelect={this.props.onSelect}/>);

    },
    getTopLinksItem() {
        const appHomePageSelected = !this.props.selectedTableId;

        return (
        <li className="horizontal">
            <ul className="topLinks">
                {this.getNavItem('nav.home', `/app/${this.props.selectedAppId}`, 'home', appHomePageSelected)}
                {this.getNavItem('nav.users', '/users', 'user')}
            </ul>
        </li>);
    },

    render() {
        return (
            <ul className="tablesList">
                {this.getTopLinksItem()}

                <NavItem item={{msg: 'nav.tablesHeading'}}
                         isHeading={true}
                         secondaryIcon={"search"}
                         onClick={this.onClickTables} open={true} />
                <li className={this.state.searching ? "search open" : "search"}>
                    <input type="text" className={"searchInput"} placeholder={Locale.getMessage('nav.searchTablesPlaceholder')} value={this.state.searchText} onChange={this.onChangeSearch}/>
                </li>
                {this.tablesList()}
            </ul>
        );
    }
});

export default TablesList;
