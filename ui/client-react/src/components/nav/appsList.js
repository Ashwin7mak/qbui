import React from 'react';

import Locale from '../../locales/locales';
import NavItem from './navItem';

let AppsList = React.createClass({

    propTypes: {
        apps: React.PropTypes.array.isRequired,
        onSelectApp: React.PropTypes.func.isRequired,
        open: React.PropTypes.bool.isRequired
    },
    getInitialState() {
        return {
            searching:false,
            searchText:""
        };
    },

    onChangeSearch(ev) {
        this.setState({searchText: ev.target.value});
    },
    searchMatches(name) {
        return name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1;
    },
    appList() {
        return this.props.apps && this.props.apps.map((app) => {
            app.icon = 'star';
            return this.searchMatches(app.name) && <NavItem key={app.id} item={app} onSelect={this.props.onSelectApp} {...this.props} />;
        });
    },
    onClickApps() {
        const wasSearching = this.state.searching;
        this.setState({searching: !this.state.searching});

        if (!wasSearching) {
            this.setState({searchText: ""});
        }
    },
    render() {
        return (
            <div className="appsList leftNavList">
                <ul>

                    <NavItem item={{msg: 'nav.appsHeading'}} isHeading={true} secondaryIcon={"search"} onClick={this.onClickApps} {...this.props} />

                    <li className={this.state.searching ? "search open" : "search"}>
                        <input type="text" placeholder={Locale.getMessage('nav.searchAppsPlaceholder')} value={this.state.searchText} onChange={this.onChangeSearch}/>
                    </li>

                    {this.appList()}
                </ul>

            </div>
        );
    }
});

export default AppsList;
