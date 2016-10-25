import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';
import * as query from '../../constants/query';
import Fluxxor from 'fluxxor';
import Header from '../headers/smallHeader';
import './recordHeader.scss';

/**
 * A header that takes the place of the top nav when viewing a report
 * (visible on small breakpoint currently)
 */
var RecordHeader = React.createClass({
    propTypes: {
        title: React.PropTypes.object
    },
    // no top nav present so the hamburger exists here
    onNavClick() {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },

    render: function() {
        return <Header centerContent={this.props.title} classes="recordHeader"/>;
    }
});

export default RecordHeader;
