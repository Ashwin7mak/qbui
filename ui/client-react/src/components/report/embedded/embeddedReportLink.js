import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import _ from 'lodash';

import {loadReportRecordsCount, unloadEmbeddedReport} from '../../../actions/reportActions';
import {CONTEXT} from '../../../actions/context';
import QBicon from '../../qbIcon/qbIcon';

import UrlUtils from '../../../utils/urlUtils';
import QueryUtils from '../../../utils/queryUtils';
import {I18nMessage} from '../../../utils/i18nMessage';

import './embeddedReportLink.scss';

/**
 * Renders a clickable Report Link as a button in a form.
 */
export const EmbeddedReportLink = React.createClass({
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
    loadReportRecordsCount() {
        const {appId, childTableId, childReportId, detailKeyFid, detailKeyValue} = this.props;
        // Display a filtered child report, the child report should only contain children that
        // belong to a parent. A child has a parent if its detailKey field contains the
        // detailKeyValue that contains a parent record's masterKeyValue.
        const queryParams = {
            query: QueryUtils.parseStringIntoExactMatchExpression(this.props.detailKeyFid, this.props.detailKeyValue)
        };

        this.props.loadReportRecordsCount(this.uniqueId, appId, childTableId, childReportId, queryParams);
    },

    componentDidMount() {
        this.uniqueId = CONTEXT.REPORT.EMBEDDED + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        this.loadReportRecordsCount();
    },

    componentWillUnmount() {
        this.props.unloadEmbeddedReport(this.uniqueId);
    },

    reportDetails(tableName) {
        const count = _.get(this, `props.reports[${this.uniqueId}].recordsCount`);
        let recordsCount = '';
        if (typeof count === 'number') {
            recordsCount = ` (${count})`;
        }
        return <span className="reportDetail">{tableName}{recordsCount}</span>;
    },

    render() {
        const {appId, childTableId, childReportId, detailKeyFid, detailKeyValue} = this.props;
        // render report link for small-breakpoint or if the element type is defined as a
        // reportLink
        const link = UrlUtils.getRelatedChildReportLink(appId, childTableId, childReportId, detailKeyFid, detailKeyValue);
        let tableName;
        if (this.props.childTableName) {
            tableName  = this.props.childTableName;
        } else {
            tableName = <I18nMessage message="relationship.childTable" />;
        }
        return (
            <div className="childReportLinkContainer">
                {this.reportDetails(tableName)}
                <Link to={link} className="childReportLink btn btn-default">
                    <QBicon icon="eye" />
                    {tableName}
                </Link>
            </div>
        );
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
        loadReportRecordsCount: (context, appId, tblId, rptId, queryParams) => {
            dispatch(loadReportRecordsCount(context, appId, tblId, rptId, queryParams));
        },
        unloadEmbeddedReport: (context) =>
            dispatch(unloadEmbeddedReport(context))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmbeddedReportLink);
