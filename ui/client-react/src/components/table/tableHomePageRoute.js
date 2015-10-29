import React from 'react';

import Fluxxor from 'fluxxor';
let FluxMixin = Fluxxor.FluxMixin(React);

let TableHomePageRoute = React.createClass({
    mixins: [FluxMixin],

    render: function() {

        return (<div>
            <div>Table Homepage goes here... {this.props.breakpoint}</div>
        </div>);
    }
});

export default TableHomePageRoute;
