import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';
import * as query from '../../constants/query';
import Fluxxor from 'fluxxor';
import '../header/smallHeader.scss';
import './recordHeader.scss';

let FluxMixin = Fluxxor.FluxMixin(React);
/**
 * A header that takes the place of the top nav when viewing a report
 * (visible on small breakpoint currently)
 */
var RecordHeader = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        title: React.PropTypes.object
    },
    // no top nav present so the hamburger exists here
    onNavClick() {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },

    render: function() {
        let headerClasses = 'smallHeader recordHeader';
        return (<div className={headerClasses}>
            <div className="left">
                <a className="iconLink toggleNavButton" href="#" onClick={this.onNavClick}>
                    <QBicon icon="hamburger" />
                </a>
            </div>

            <div className="center title">
                {this.props.title}
            </div>

            <div className="right">
            </div>
        </div>);
    }
});

export default RecordHeader;
