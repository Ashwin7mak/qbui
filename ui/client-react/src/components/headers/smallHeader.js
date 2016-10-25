import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';
import * as query from '../../constants/query';
import Fluxxor from 'fluxxor';
let FluxMixin = Fluxxor.FluxMixin(React);
import './smallHeader.scss';

/**
 * A header that takes the place of the top nav when viewing a report
 * (visible on small breakpoint currently)
 */
var Header = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        centerContent: React.PropTypes.object,
        rightContent: React.PropTypes.object,
        classes: React.PropTypes.string
    },
    // no top nav present so the hamburger exists here
    onNavClick() {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },

    render: function() {
        let headerClasses = 'smallHeader';
        headerClasses += this.props.classes ? ' ' + this.props.classes: '';

        return (<div className={headerClasses}>
            <div className="left">
                <a className="iconLink toggleNavButton" href="#" onClick={this.onNavClick}>
                    <QBicon icon="hamburger" />
                </a>
            </div>

            <div className="center title">
                {this.props.centerContent}
            </div>

            <div className="right">
                {this.props.rightContent}
            </div>
        </div>);
    }
});

export default Header;
