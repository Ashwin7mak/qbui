import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import Fluxxor from 'fluxxor';
import './header.scss';

let FluxMixin = Fluxxor.FluxMixin(React);

var Header = React.createClass({
    mixins: [FluxMixin],

    onNavClick() {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },
    render: function() {
        return (<div className="secondaryNav">
            <a className="iconLink toggleNavButton" href="#" onClick={this.onNavClick}>
                <QBicon icon="hamburger" />
            </a>
            {this.props.children}
        </div>);
    }
});

export default Header;
