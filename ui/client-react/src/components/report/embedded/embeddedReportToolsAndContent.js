import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {TrackableReportToolsAndContent} from '../reportToolsAndContent';
import {loadDynamicReport, unloadEmbeddedReport} from '../../../actions/reportActions';

import Logger from '../../../utils/logger';
import QueryUtils from '../../../utils/queryUtils';
import NumberUtils from '../../../utils/numberUtils';

import constants from '../../../../../common/src/constants';

import '../report.scss';

let logger = new Logger();

/**
 * A wrapper for ReportToolsAndContent to be rendered as an embedded report in a form.
 */
// Export the unconnected base component for testing, the default export is wrapped with `connect`
export const EmbeddedReportToolsAndContent = React.createClass({
    // TODO: the tablePropertiesEndpoint on EE has the noun for records
    nameForRecords: "Records",

    propTypes: {
        appId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        tblId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        rptId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /** The fid of the field containing the foreignkey. */
        detailKeyFid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /** The value entered in the foreignkey field. */
        detailKeyValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /** The display value entered in the foreignkey field. */
        detailKeyDisplay: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    },

    /**
     * Load a report with query parameters.
     */
    loadDynamicReport(appId, tblId, rptId, format, filter, queryParams) {
        // Display a filtered child report, the child report should only contain children that
        // belong to a parent. A child has a parent if its detailKey field contains the
        // detailKeyValue that contains a parent record's masterKeyValue.
        queryParams.query = QueryUtils.parseStringIntoExactMatchExpression(this.props.detailKeyFid, this.props.detailKeyValue);

        this.props.loadDynamicReport(this.props.uniqueId, appId, tblId, rptId, format, filter, queryParams);
    },

    /**
     * Figure out what report we need to load based on the props.
     */
    loadReportFromProps() {
        const {appId, tblId, rptId, detailKeyFid, detailKeyValue} = this.props;
        const validProps = [appId, tblId, rptId, detailKeyFid, detailKeyValue].every(prop => prop || typeof prop === 'number');

        if (validProps) {
            //  loading a report..always render the 1st page on initial load
            const queryParams = {
                offset: constants.PAGE.DEFAULT_OFFSET,
                numRows: NumberUtils.getNumericPropertyValue(this.props.reportData, 'numRows') || constants.PAGE.DEFAULT_NUM_ROWS
            };
            this.loadDynamicReport(appId, tblId, rptId, true, /*filter*/{}, queryParams);
        }
    },

    render() {
        const report = this.props.report;
        const params = {
            appId: _.get(report, 'appId'),
            tblId: _.get(report, 'tblId'),
            rptId: _.get(report, 'rptId')
        };
        return (
            <div className="embeddedReportContainer reportContainer">
                <TrackableReportToolsAndContent
                    uniqueId={this.props.uniqueId}
                    loadEntry={this.loadReportFromProps}
                    unloadEntry={this.unloadEmbeddedReport}
                    hasEntry={!!report}

                    params={params}
                    reportData={report}
                    appUsers={this.props.appUsers}
                    routeParams={this.props.routeParams}
                    selectedAppId={_.get(report, 'appId')}
                    fields={this.props.fields || !("not used in phase1")}
                    nameForRecords={this.nameForRecords}
                    phase1={true}
                    loadDynamicReport={this.loadDynamicReport}
                    handleDrillIntoChild={this.props.handleDrillIntoChild}
                />
            </div>);
    }
});

// instead of relying on our parent route component to pass our props down,
// the react-redux container will generate the required props for this route
// from the Redux state (the presentational component has no code dependency on Redux!)
// Exported for unit testing purposes only.
export const mapStateToProps = (state, ownProps) => {
    return {
        // find the report which applies to this specific instance
        // ownProps.uniqueId is the uniqueId prop passed in by the withUniqueId HOC
        report: _.get(state, `embeddedReports[${ownProps.uniqueId}]`)
    };
};

// similarly, abstract out the Redux dispatcher from the presentational component
// (another bit of boilerplate to keep the component free of Redux dependencies)
const mapDispatchToProps = (dispatch) => {
    return {
        loadDynamicReport: (context, appId, tblId, rptId, format, filter, queryParams) =>
            dispatch(loadDynamicReport(context, appId, tblId, rptId, format, filter, queryParams)),
        unloadEmbeddedReport: (context) =>
            dispatch(unloadEmbeddedReport(context))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmbeddedReportToolsAndContent);
