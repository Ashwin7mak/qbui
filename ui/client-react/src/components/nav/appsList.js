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
        return {searchText:""};
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
    render() {

        return (
            <div className="appsList leftNavList">
                {this.props.open ?
                    <div className="searchApps">
                        <input type="text" placeholder={Locale.getMessage('nav.searchAppsPlaceholder')} value={this.state.searchText} onChange={this.onChangeSearch}/>
                    </div> : ""}
                <ul>
                    {this.props.apps &&  <NavItem item={{msg: 'nav.appsHeading'}} isHeading={true} {...this.props} />}
                    {this.appList()}
                </ul>

            </div>
        );
    }
});

export default AppsList;
