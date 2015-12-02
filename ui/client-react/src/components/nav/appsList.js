import React from 'react';

import Locale from '../../locales/locales';

let AppsList = React.createClass({

    propTypes: {
        apps: React.PropTypes.array.isRequired,
        toggleApps: React.PropTypes.func.isRequired,
        buildHeadingItem: React.PropTypes.func.isRequired
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
            return this.searchMatches(app.name) && this.props.buildItem(app, this.props.toggleApps);
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
                    {this.props.apps && this.props.buildHeadingItem({key: 'nav.appsHeading'}, false)}
                    {this.appList()}
                </ul>

            </div>
        );
    }
});

export default AppsList;
