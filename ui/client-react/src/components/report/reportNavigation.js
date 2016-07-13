import React from 'react';

import Logger from '../../utils/logger';
let logger = new Logger();

import Fluxxor from 'fluxxor';
import './report.scss';
import {I18nMessage} from '../../../src/utils/i18nMessage';

let FluxMixin = Fluxxor.FluxMixin(React);

var ReportNavigation = React.createClass({
    propTypes: {
        offset: React.PropTypes.number,
        numRows : React.PropTypes.number,
    },

    /**
     * renders the report navigation toolbar
     */
    render() {
        let navBar = "report.reportNavigationBar";

        return (<div className="reportNavigation">
                <I18nMessage message={navBar}
                             offset={this.props.offset}
                             numRows={this.props.numRows}
                />
            </div>);

    }
});


export default ReportNavigation;
