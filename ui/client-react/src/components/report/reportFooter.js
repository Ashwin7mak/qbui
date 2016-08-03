import React from 'react';
import Fluxxor from 'fluxxor';

import './report.scss';

import {I18nMessage} from '../../../src/utils/i18nMessage';
import ReportNavigation from './reportNavigation';
import _ from 'lodash';

let FluxMixin = Fluxxor.FluxMixin(React);


/**
 * a footer for a table report. This footer contains the report page navigation links.
 */
const ReportToolbar = React.createClass({
    //interaction options

    mixins: [FluxMixin],

    propTypes: {
        /**
         *  Takes in for properties the reportData which includes the list of facets
         *  and a function to call when a facet value is selected.
         **/
        reportData: React.PropTypes.shape({
            data: React.PropTypes.shape({
                facets:  React.PropTypes.array
            })
        }),
        getPreviousReportPage: React.PropTypes.func,
        getNextReportPage: React.PropTypes.func,
        pageStart: React.PropTypes.number,
        pageEnd: React.PropTypes.number,
    },

    render() {
        let isLoading = false;
        let recordsCount = 0;
        if (this.props.reportData) {
            if (this.props.reportData.loading) {
                isLoading = this.props.reportData.loading;
            }
            recordsCount = this.props.reportData.data.recordsCount;
        }

        return (
            <div className="reportFooter">
                <div className="leftReportFooter">
                </div>
                <div className="rightReportFooter">
                    {(!isLoading) ?
                        (<ReportNavigation pageStart={this.props.pageStart}
                                           pageEnd={this.props.pageEnd}
                                           recordsCount={recordsCount}
                                           getNextReportPage={this.props.getNextReportPage}
                                           getPreviousReportPage={this.props.getPreviousReportPage}
                        />) :
                        this.props.loading ? <div className="loadedContent"></div> : null
                    }
                </div>
            </div>
        );
    }
});

export default ReportToolbar;

