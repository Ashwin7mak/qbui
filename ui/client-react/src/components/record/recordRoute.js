import React from 'react';

import Record from './record';

import Fluxxor from 'fluxxor';
import './record.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

var RecordRoute = React.createClass({
    mixins: [FluxMixin],


    componentDidMount: function() {
        //this.loadRecordFromParams(this.props.params);
    },

    // Triggered when properties change
    componentWillReceiveProps: function(/* props */) {

        //this.loadRecordFromParams(props.params,true);
    },

    render: function() {
        return (<div className="recordContainer">
            <Record recordData={this.props.recordData} />
        </div>);
    }
});

export default RecordRoute;
