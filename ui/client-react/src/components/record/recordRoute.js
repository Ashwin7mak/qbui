import React from 'react';
import ReactIntl from 'react-intl';
import ReactBootstrap from 'react-bootstrap';

import Record from './record';
import Logger from '../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';
import './record.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
var IntlMixin = ReactIntl.IntlMixin;

var RecordRoute = React.createClass({
    mixins: [IntlMixin, FluxMixin],


    componentDidMount: function() {
        //this.loadRecordFromParams(this.props.params);
    },

    // Triggered when properties change
    componentWillReceiveProps: function(props) {

        //this.loadRecordFromParams(props.params,true);
    },

    render: function() {

        return (<div className='recordContainer'>

            <Record {...this.props.i18n} recordData={this.props.recordData} mobile={this.props.mobile}/>
        </div>);
    }
});

export default RecordRoute;