import React from 'react';
import {connect} from 'react-redux'

//import Fluxxor from 'fluxxor';
import AppsList from './appsList';
import {getApps} from '../../reducers/app';

import './apps.css';
import {I18nMessage} from '../../utils/i18nMessage';
//
//let FluxMixin = Fluxxor.FluxMixin(React);
//let StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppsHeader = React.createClass({

    render: function() {
        return <I18nMessage message={'apps.header'}/>;
    }
});

var App = React.createClass({
    //mixins: [FluxMixin, StoreWatchMixin("AppsStore")],
    //
    //getStateFromFlux: function() {
    //    let flux = this.getFlux();
    //    return {
    //        apps: flux.store("AppsStore").getState(),
    //    };
    //},


    render: function() {
        return (
            <div className="apps-container">
                <h4><AppsHeader /></h4>
                <AppsList data={this.props.getApps}/>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        getApps: () => getApps(state.app)
    };
};

export default connect(mapStateToProps)(App);
