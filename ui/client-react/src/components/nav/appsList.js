import React from 'react';
import ReactDOM from 'react-dom';
import Locale from '../../locales/locales';
import NavItem from './navItem';
import SearchBox from '../search/searchBox';
import CreateInQuickBaseClassicMessage from './createInQuickBaseClassicMessage';

let AppsList = React.createClass({

    propTypes: {
        apps: React.PropTypes.array.isRequired,
        onSelectApp: React.PropTypes.func.isRequired
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
    hasNoApps() {
        return (!this.props.appsLoading && this.props.apps && this.props.apps.length === 0);
    },
    render() {
        let apps = this.appList();

        if (this.hasNoApps()) {
            apps = <CreateInQuickBaseClassicMessage nameOfElements="apps" />;
        }

        return (
            <ul className={"appsList"} >

                <NavItem item={{msg: 'nav.appsHeading'}}
                         isHeading={true}
                         secondaryIcon={"search"}
                         onClick={this.onClickApps}
                         open={true} />

                <li className={this.state.searching ? "search open" : "search"}>
                    <SearchBox ref="appsSearchBox"
                               value={this.state.searchText}
                               onChange={this.onChangeSearch}
                               onClearSearch={this.onClearSearch}
                               placeholder={Locale.getMessage('nav.searchAppsPlaceholder')} />
                </li>

                {apps}
            </ul>

        );
    }
});

export default AppsList;
