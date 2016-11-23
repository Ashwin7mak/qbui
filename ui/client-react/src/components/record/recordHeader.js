import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import {I18nMessage} from '../../utils/i18nMessage';
import _ from 'lodash';
import * as query from '../../constants/query';
import Fluxxor from 'fluxxor';
import Header from '../header/smallHeader';

let FluxMixin = Fluxxor.FluxMixin(React);
/**
 * A header that takes the place of the top nav when viewing a record
 * (visible on small breakpoint currently)
 */
let RecordHeader = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        title: React.PropTypes.object
    },
    // no top nav present so the hamburger exists here
    onNavClick() {
        let flux = this.getFlux();
        flux.actions.toggleLeftNav();
    },

    render() {
        const headerClasses = "recordHeader";
        return <Header
            headerClasses={headerClasses}
            title={this.props.title}
        />;
    }
});

export default RecordHeader;
