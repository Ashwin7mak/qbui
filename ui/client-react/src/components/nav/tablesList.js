import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import QBicon from '../qbIcon/qbIcon';
import NavItem from './navItem';
import Locale from '../../locales/locales';
import {I18nMessage} from '../../utils/i18nMessage';
import SearchBox from '../search/searchBox';
import {APP_ROUTE} from '../../constants/urlConstants';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import UrlUtils from '../../utils/urlUtils';
import {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';

import CreateNewItemButton from '../../../../reuse/client/src/components/sideNavs/createNewItemButton';
import EmptyStateForLeftNav from '../../../../reuse/client/src/components/sideNavs/emptyStateForLeftNav';
import _ from 'lodash';

const DEFAULT_TABLE_ICON = 'Spreadsheet';

let TablesList = React.createClass({

    propTypes: {
        selectedAppId: React.PropTypes.string.isRequired,
        onSelect: React.PropTypes.func,
        showReports: React.PropTypes.func.isRequired,
        expanded: React.PropTypes.bool,
        onCreateNewTable: React.PropTypes.func,
        tables: React.PropTypes.array
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
     * Clear search text
     */
    onClearSearch() {
        this.setState({searchText:""});
    },
    /**
     * check for table name matching search text
     */
    searchMatches(name) {
        if (name !== undefined) {
            return name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1;
        }
        return true;
    },
    /**
     * toggle search tables list
     */
    onClickTables() {
        if (this.state.searching) {
            this.setState({searching: false});
        } else {
            this.setState({searching: true, searchText: ""},
                () => {setTimeout(() => ReactDOM.findDOMNode(this.refs.tablesSearchBox).querySelector("input.searchInput").focus(), 200);});
        }
    },

    /**
     * get link to table homepage
     */
    getTableLink(table) {
        return `${APP_ROUTE}/${this.props.selectedAppId}/table/${table.id}`;
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
        // sorts tables list in order of id which is approx order of creation
        // if the tables list gets very large this should happen server side instead
        const tableItems = this.props.getAppTables(this.props.selectedAppId, this.props.apps).map((table) => {
            table.link = this.getTableLink(table);
            return this.searchMatches(table.name) &&
                <NavItem item={table}
                         icon={table.tableIcon}
                         defaultIcon={DEFAULT_TABLE_ICON}
                         defaultIconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY}
                         iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY}
                         key={table.id}
                         showSecondary={this.props.expanded}
                         secondaryIcon={"report-menu-3"}
                         secondaryOnSelect={this.props.showReports}
                         hoverComponent={this.getHoverComponent(table)}
                         onSelect={this.props.onSelect}
                         selected={table.id === this.props.selectedTableId}
                         open={true}/>;
        });

        return tableItems;
    },

    getNavItem(msg, link, icon, selected) {
        const hoverComponent = (<div className="hoverComponent">
            <Link to={link}><I18nMessage message={msg}/></Link>
        </div>);

        return (<NavItem item={{msg: msg, link:link}}
                         icon={icon}
                         iconFont={AVAILABLE_ICON_FONTS.DEFAULT}
                         selected={selected}
                         hoverComponent={hoverComponent}
                         open={true}
                         onSelect={this.props.onSelect}/>);

    },

    getTopLinksItem() {
        const appHomePageSelected = !this.props.selectedTableId &&
            (WindowLocationUtils.getPathname() === `${APP_ROUTE}/${this.props.selectedAppId}`);
        const appUsersPageSelected = !this.props.selectedTableId &&
            (WindowLocationUtils.getPathname() === UrlUtils.getAppUsersLink(this.props.selectedAppId));

        return (
        <li className="horizontal">
            <ul className="topLinks">
                {this.getNavItem('nav.home', `${APP_ROUTE}/${this.props.selectedAppId}`, 'home', appHomePageSelected)}
                {this.getNavItem('app.users.users', UrlUtils.getAppUsersLink(this.props.selectedAppId), 'users', appUsersPageSelected)}
            </ul>
        </li>);
    },

    /**
     * render fixed footer (new table link)
     * @returns {XML}
     */
    getNewTableItem() {
        return <CreateNewItemButton handleOnClick={this.props.onCreateNewTable}
                                    message="tableCreation.newTablePageTitle"
                                    className="newTable"
                                    key="newTableButton"
        />;
    },

    renderEmptyStateOrButton() {
        // Using expanded to hide the error message for tables when collapsed
        if (_.isEmpty(this.props.tables) && this.props.expanded) {
            return <EmptyStateForLeftNav handleOnClick={this.props.onCreateNewTable}
                                         emptyMessage="emptyTableState.message"
                                         className="tableList"
                                         iconMessage="emptyTableState.createNewTable"
            />;
        } else if (this.props.onCreateNewTable) {
            return this.getNewTableItem();
        }
    },

    render() {
        return (
            <div className="tablesHeadingAndList">
                <ul className="tablesHeading">
                    {this.getTopLinksItem()}

                    <NavItem item={{msg: 'nav.tablesHeading'}}
                             isHeading={true}
                             onClick={this.onClickTables}
                             open={true} />

                    <li key="tableSearchBox" className={this.state.searching ? "search open" : "search"}>
                        <SearchBox ref="tablesSearchBox" searchBoxKey="tablesSearchBox"
                                   value={this.state.searchText}
                                   onChange={this.onChangeSearch}
                                   onClearSearch={this.onClearSearch}
                                   placeholder={Locale.getMessage('nav.searchTablesPlaceholder')} />
                    </li>
                </ul>

                <ul className={"tablesList"}>
                        {this.tablesList()}
                        {this.renderEmptyStateOrButton()}
                </ul>
            </div>
        );
    }
});

export default TablesList;
