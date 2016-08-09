import React from 'react';
import Fluxxor from 'fluxxor';

import './report.scss';

import ReportNavigation from './reportNavigation';
let FluxMixin = Fluxxor.FluxMixin(React);


/**
 * A footer for a table report. This footer contains the report page navigation links.
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
        let recordCount = 0;
        if (this.props.reportData) {
            if (this.props.reportData.loading) {
                isLoading = this.props.reportData.loading;
            }
            recordCount = this.props.reportData.data.recordsCount;
        }

        return (
            <div className="reportFooter">
                <div className="leftReportFooter">
                </div>
                <div className="rightReportFooter">
                    <div className="rightReportFooterSpacer"></div>
                    { !isLoading && !(recordCount === this.props.pageEnd && this.props.pageStart === 1) ?
                        (<ReportNavigation pageStart={this.props.pageStart}
                                           pageEnd={this.props.pageEnd}
                                           recordsCount={recordCount}
                                           getNextReportPage={this.props.getNextReportPage}
                                           getPreviousReportPage={this.props.getPreviousReportPage}
                        />) :
                        null
                    }
                    { isLoading ? <div className="loadedContent"></div> :
                        null
                    }
                </div>
            </div>
        );
    }
});

export default ReportToolbar;

