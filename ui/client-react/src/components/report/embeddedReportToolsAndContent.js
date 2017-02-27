import React, {PropTypes} from 'react';
import Logger from '../../utils/logger';
import QueryUtils from '../../utils/queryUtils';
import NumberUtils from '../../utils/numberUtils';
import simpleStringify from '../../../../common/src/simpleStringify';
import constants from '../../../../common/src/constants';
import Fluxxor from 'fluxxor';
import _ from 'lodash';
import './report.scss';
import ReportToolsAndContent from '../report/reportToolsAndContent';
import {connect} from 'react-redux';
import {loadDynamicEmbeddedReport} from '../../mocks/mockReportActions';
import {CONTEXT} from '../../actions/context';

let logger = new Logger();
//let FluxMixin = Fluxxor.FluxMixin(React);

/**
 * A wrapper for ReportToolsAndContent that renders a report with report tools within a form.
 */
const EmbeddedReportToolsAndContent = React.createClass({
    //mixins: [FluxMixin],
    nameForRecords: "Records",  // get from table meta data

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
    loadDynamicReport(appId, tblId, rptId, queryParams) {
        //const flux = this.getFlux();
        //flux.actions.loadFields(appId, tblId);

        this.props.loadDynamicEmbeddedReport(this.uniqId, appId, tblId, rptId, true, /*filter*/{}, queryParams);
    },

    /**
     * Figure out what report we need to load.
     */
    loadReportFromProps() {
        const {appId, tblId, rptId, detailKeyFid, detailKeyValue} = this.props;
        const validProps = [appId, tblId, rptId, detailKeyFid, detailKeyValue].every(prop => prop || typeof prop === 'number');

        if (validProps) {
            //  loading a report..always render the 1st page on initial load
            const offset = constants.PAGE.DEFAULT_OFFSET;
            const numRows = NumberUtils.getNumericPropertyValue(this.props.reportData, 'numRows') || constants.PAGE.DEFAULT_NUM_ROWS;

            // Display a filtered child report, the child report should only contain children that
            // belong to a parent. A child has a parent if its detailKey field contains the
            // detailKeyValue that contains a parent record's masterKeyValue.
            const queryParams = {
                query: QueryUtils.parseStringIntoExactMatchExpression(detailKeyFid, detailKeyValue),
                offset,
                numRows
            };
            this.loadDynamicReport(appId, tblId, rptId, queryParams);
        } else {
            return null;
        }
    },

    componentDidMount() {
        this.uniqId = 'FORM' + Math.floor(Math.random() * 100000);
        let thing = this.uniqId;
        this.loadReportFromProps();
    },

    componentWillUnmount() {
        // TODO: cleanup entry in store
        // this.uniqId
    },

    render() {
        const record = _.get(this, `props.records[${this.uniqId}]`);
        if (!record) {
            logger.info("the necessary params were not specified to embeddedReportToolsAndContent render params=" + simpleStringify(this.props.params));
            return null;
        } else {
            const params = {
                appId: record.appId,
                tblId: record.tblId,
                rptId: record.rptId
            };
            return (
                <div className="reportContainer">
                    <ReportToolsAndContent
                        params={params}
                        reportData={record}
                        appUsers={this.props.appUsers}
                        routeParams={this.props.routeParams}
                        selectedAppId={record.appId}
                        fields={this.props.fields || !("nope, viewOnly")}
                        nameForRecords={this.nameForRecords}
                        isViewOnly={true}
                    />
                </div>);
        }
    }
});

const mapStateToProps = (state) => {
    return {
        records: state.mockReportReducer
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadDynamicEmbeddedReport: (context, appId, tblId, rptId, format, filter, queryParams) => {
            dispatch(loadDynamicEmbeddedReport(context, appId, tblId, rptId, format, filter, queryParams));
        }
    };
};

// create mapDispatchToProps function here if you want dispatch available when using mapStateToProps
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmbeddedReportToolsAndContent);
