import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import ReportToolsAndContent from '../reportToolsAndContent';
import {loadDynamicReport, unloadEmbeddedReport} from '../../../actions/reportActions';
import {CONTEXT} from '../../../actions/context';

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
    nameForRecords: "Records",

    propTypes: {
        appId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        tblId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        rptId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /** The fid of the field containing the foreignkey. */
        detailKeyFid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /** The value entered in the foreignkey field. */
        detailKeyValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    },

    /**
     * Load a report with query parameters.
     */
    loadDynamicReport(appId, tblId, rptId, format, filter, queryParams) {
        // Display a filtered child report, the child report should only contain children that
        // belong to a parent. A child has a parent if its detailKey field contains the
        // detailKeyValue that contains a parent record's masterKeyValue.
        queryParams.query = QueryUtils.parseStringIntoExactMatchExpression(this.props.detailKeyFid, this.props.detailKeyValue);

        this.props.loadDynamicReport(this.uniqueId, appId, tblId, rptId, format, filter, queryParams);
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

    componentDidMount() {
        this.uniqueId = CONTEXT.REPORT.EMBEDDED + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        //this.setState({});
        this.loadReportFromProps();
    },

    componentWillUnmount() {
        this.props.unloadEmbeddedReport(this.uniqueId);
    },

    render() {
        const report = _.get(this, `props.reports[${this.uniqueId}]`);
        if (!report) {
            logger.info('no report exists in store for embeddedReportToolsAndContent with uniqueId: ' + this.uniqueId);
            return null;
        } else {
            const params = {
                appId: report.appId,
                tblId: report.tblId,
                rptId: report.rptId
            };
            return (
                <div className="embeddedReportContainer reportContainer">
                    <ReportToolsAndContent
                        params={params}
                        reportData={report}
                        appUsers={this.props.appUsers}
                        routeParams={this.props.routeParams}
                        selectedAppId={report.appId}
                        fields={this.props.fields || !("not used in phase1")}
                        nameForRecords={this.nameForRecords}
                        phase1={true}
                        loadDynamicReport={this.loadDynamicReport}
                    />
                </div>);
        }
    }
});

// instead of relying on our parent route component to pass our props down,
// the react-redux container will generate the required props for this route
// from the Redux state (the presentational component has no code dependency on Redux!)
const mapStateToProps = (state) => {
    return {
        reports: state.embeddedReports
    };
};

// similarly, abstract out the Redux dispatcher from the presentational component
// (another bit of boilerplate to keep the component free of Redux dependencies)
const mapDispatchToProps = (dispatch) => {
    return {
        loadDynamicReport: (context, appId, tblId, rptId, format, filter, queryParams) => {
            dispatch(loadDynamicReport(context, appId, tblId, rptId, format, filter, queryParams));
        },
        unloadEmbeddedReport: (context) =>
            dispatch(unloadEmbeddedReport(context))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmbeddedReportToolsAndContent);
