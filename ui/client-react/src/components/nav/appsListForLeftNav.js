import React from 'react';
import ReactDOM from 'react-dom';
import Locale from '../../locales/locales';
import NavItem from './navItem';
import SearchBox from '../search/searchBox';
import {connect} from "react-redux";
import {showAppCreationDialog} from '../../actions/appBuilderActions';
import CreateNewItemButton from '../../../../reuse/client/src/components/sideNavs/createNewItemButton';
import _ from 'lodash';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import "./leftNav.scss";

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
    buildEmptyStateMessage()  {
        return Locale.getMessage('emptyAppState.message');
    },
    appList() {
        return this.props.apps && this.props.apps.map((app) => {
            app.icon = 'favicon';
            return this.searchMatches(app.name) &&
                    <NavItem key={app.id}
                             item={app}
                             onSelect={this.props.onSelectApp}
                             selected={app.id === this.props.selectedAppId}
                             open={true}
                    />;
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
     * returns icon when the appList is empty
     */
    emptyStateAppIcon() {
        return (
            <div className="createNewApp">
                <div className="appIcon" onClick={this.createNewApp}>
                    <Icon iconFont={AVAILABLE_ICON_FONTS.UI_STURDY} classes="primaryIcon createNewAppIcon" icon="add-new-filled"/>
                    <li className="newApp">{Locale.getMessage('emptyAppState.createNewApp')}</li>
                </div>
            </div>
        );
    },

    /**
     * returns the message and a new icon to create apps when there are no apps otherwise returns the appList
     */
    emptyAppMessage() {
        if (_.isEmpty(this.props.apps)) {
            return (
                <div className="emptyState">
                    {this.buildEmptyStateMessage()}
                    {this.emptyStateAppIcon()}
                </div>
            );
        } else {
            return (
                <div>
                    {this.appList()}
                    {this.getNewAppItem()}
                </div>
            );
        }
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

                <li>{this.emptyAppMessage()}</li>
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
