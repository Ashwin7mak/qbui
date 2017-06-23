import React from 'react';
import {connect} from 'react-redux';

import AppsList from './appsList';
import {getApps} from '../../reducers/app';

import './apps.css';
import {I18nMessage} from '../../utils/i18nMessage';

export const AppsHeader = React.createClass({

    render: function() {
        return <I18nMessage message={'apps.header'}/>;
    }
});

export const App = React.createClass({
    render: function() {
        const apps = this.props.getApps();
        return (
            <div className="apps-container">
                <h4><AppsHeader /></h4>
                <AppsList data={apps}/>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        getApps: () => getApps(state)
    };
};

export default connect(mapStateToProps)(App);
