import React from 'react';
import PageActions from '../actions/pageActions';
import Record from './record';

import Fluxxor from 'fluxxor';
import './record.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

var RecordRoute = React.createClass({
    mixins: [FluxMixin],


    componentDidMount: function() {

        let flux = this.getFlux();
        flux.actions.showTopNav();

        //this.loadRecordFromParams(this.props.params);
    },

    // Triggered when properties change
    componentWillReceiveProps: function(/* props */) {

        //this.loadRecordFromParams(props.params,true);
    },

    getSecondaryBar() {
        return (
            <div className="secondaryFormActions">
                {/* todo */}
            </div>);
    },
    getPageActions() {
        const actions = [
            {name: 'i.e. edit', icon:'edit'},
            {name: 'i.e. mail', icon:'mail'},
            {name: 'i.e. delete', icon:'delete'},
            {name: 'i.e. print', icon:'print'},
            {name: 'i.e. help 1', icon:'help'},
            {name: 'i.e. help 2', icon:'help'},
            {name: 'i.e. help 3', icon:'help'}
        ];
        return (<PageActions actions={actions} menuAfter={2} {...this.props}/>);
    },
    render: function() {
        return (<div className="recordContainer">
            <div className="recordActionsContainer secondaryBar">
                {this.getSecondaryBar()}
                {this.getPageActions()}
            </div>
            <Record recordData={this.props.recordData} />
        </div>);
    }
});

export default RecordRoute;
