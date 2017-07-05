import React from 'react';
import ReactDOM from 'react-dom';
import Locale from '../../locales/locales';
import NavItem from './navItem';
import SearchBox from '../search/searchBox';
import {connect} from 'react-redux';
import {showAppCreationDialog} from '../../actions/appBuilderActions';
import CreateNewItemButton from '../../../../reuse/client/src/components/sideNavs/createNewItemButton';
import EmptyStateForLeftNav from '../../../../reuse/client/src/components/sideNavs/emptyStateForLeftNav';
import _ from 'lodash';

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
        return this.props.apps && this.props.apps.map((app) => {
            // Give all apps in the left nav list a default icon of 'favicon'
            // TODO:: Refactor where the icon is obtain from in MC-3596. Patching for the purpose of the current story.
            let appForNavItem = {icon: 'favicon', tableIcon: 'favicon', ...app};
            return this.searchMatches(app.name) &&
                <NavItem key={app.id}
                         item={appForNavItem}
                         tableIcon={true}
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
        return (_.isEmpty(this.props.apps) && this.props.expanded) ?
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
