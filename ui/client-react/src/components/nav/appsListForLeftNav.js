import React from 'react';
import ReactDOM from 'react-dom';
import Locale from '../../locales/locales';
import NavItem from './navItem';
import SearchBox from '../search/searchBox';
import {connect} from "react-redux";
import {showAppCreationDialog} from '../../actions/appBuilderActions';
import CreateNewItemButton from '../../../../reuse/client/src/components/sideNavs/createNewItemButton';
import EmptyStateForLeftNav from '../../../../reuse/client/src/components/sideNavs/emptyStateForLeftNav';

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
            app.icon = 'favicon';
            return this.searchMatches(app.name) &&
                <NavItem key={app.id}
                         item={app}
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
                />;
    },

    /**
     * open the create app wizard
     */
    createNewApp() {
        this.props.showAppCreationDialog();
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

                {_.isEmpty(this.props.apps) ?
                    <EmptyStateForLeftNav handleOnClick={this.createNewApp}
                                          emptyMessage="emptyAppState.message"
                                          className="appsListForLEftNav"
                                          icon="add-new-filled"
                                          iconMessage="emptyAppState.createNewApp"
                    /> :
                    <div>
                        {this.appList()}
                        {this.getNewAppItem()}
                    </div>
                }

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
