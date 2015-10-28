import React from 'react';
import Fluxxor from 'fluxxor';
import './mobileAddFooter.scss';

import {Glyphicon} from 'react-bootstrap';

let FluxMixin = Fluxxor.FluxMixin(React);

let MobileAddFooter = React.createClass({
    mixins: [FluxMixin],

    addNew: function() {
        //let flux = this.getFlux();
        // todo: flux.actions.showNewItems();
    },

    render: function() {
        return (
            <div>
                {this.props.newItemsOpen ?
                    <div className="mobileAddFooter">
                    record selection component goes here (like qbo native app)
                    </div>  :
                <div className="mobileAddButton">
                    <Glyphicon onClick={this.addNew} glyph={'plus-sign'}/>
                </div>}
            </div>);
    }
});

export default MobileAddFooter;
