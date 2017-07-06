import React from 'react';
import ReactDOM from 'react-dom';
import Locale from '../../locales/locales';
import NavItem from './navItem';
import SearchBox from '../search/searchBox';
import {connect} from 'react-redux';
import {showAppCreationDialog} from '../../actions/appBuilderActions';
import CreateNewItemButton from '../../../../reuse/client/src/components/sideNavs/createNewItemButton';
import EmptyStateForLeftNav from '../../../../reuse/client/src/components/sideNavs/emptyStateForLeftNav';
import {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';

import _ from 'lodash';

const DEFAULT_APP_ICON = 'favicon';

export const AppsList = React.createClass({

    propTypes: {
        apps: React.PropTypes.array.isRequired
    },
    getInitialState() {
        return {
            searching:false,
            searchText:""
        };
    },

    /**
     * Clear search text
     */
    onClearSearch() {
        this.setState({searchText:""});
    },

    onChangeSearch(ev) {
        this.setState({searchText: ev.target.value});
    },

    searchMatches(name) {
        return name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1;
    },

    appList() {
        // app icon has an edge case where the default app icon uses the AVAILABLE_ICON_FONTS.DEFAULT
        let getFontIcon = app.icon === DEFAULT_APP_ICON || app.icon === undefined ? AVAILABLE_ICON_FONTS.DEFAULT : AVAILABLE_ICON_FONTS.TABLE_STURDY;

        return this.props.apps && this.props.apps.map((app) => {
            // Give all apps in the left nav list a default icon of 'favicon'
            return this.searchMatches(app.name) &&
                <NavItem key={app.id}
                         item={app}
                         icon={app.icon}
                         defaultIcon={DEFAULT_APP_ICON}
                         defaultIconFont={AVAILABLE_ICON_FONTS.DEFAULT}
                         iconFont={getFontIcon}
                         onSelect={this.props.onSelectApp}
                         selected={app.id === this.props.selectedAppId}
                         open={true}  />;
        });
    },
    onClickApps() {
        if (this.state.searching) {
            this.setState({searching: false});
        } else {
            this.setState({searching: true, searchText: ""},
                () => {setTimeout(() => ReactDOM.findDOMNode(this.refs.appsSearchBox).querySelector("input.searchInput").focus(), 200);});
        }
    },

    /**
     * render fixed footer (new app link)
     * @returns {XML}
     */
    getNewAppItem() {
        return <CreateNewItemButton handleOnClick={this.createNewApp}
                                    message="appCreation.newApp"
                                    className="newApp"
                                    key="newAppButton"
                />;
    },

    /**
     * open the create app wizard
     */
    createNewApp() {
        this.props.showAppCreationDialog();
    },

    renderEmptyStateOrNewButton() {
        return _.isEmpty(this.props.apps) ?
            <EmptyStateForLeftNav handleOnClick={this.createNewApp}
                                  emptyMessage="emptyAppState.message"
                                  className="appsListForLeftNav"
                                  iconMessage="emptyAppState.createNewApp"
            /> :
            this.getNewAppItem();
    },

    render() {
        return (
            <ul className={"appsList"} >

                <NavItem item={{msg: 'nav.appsHeading'}}
                         isHeading={true}
                         onClick={this.onClickApps}
                         open={true} />

                <li className={this.state.searching ? "search open" : "search"}>
                    <SearchBox ref="appsSearchBox"
                               value={this.state.searchText}
                               onChange={this.onChangeSearch}
                               onClearSearch={this.onClearSearch}
                               placeholder={Locale.getMessage('nav.searchAppsPlaceholder')} />
                </li>

                {this.appList()}
                {this.renderEmptyStateOrNewButton()}

            </ul>
        );
    }
});

const mapDispatchToProps = {
    showAppCreationDialog
};

export default connect(
    null,
    mapDispatchToProps
)(AppsList);
