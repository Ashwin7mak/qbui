import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import {loadReportRecordsCount} from '../../actions/reportActions';
import {I18nMessage} from '../../utils/i18nMessage';

import EmbeddedReportToolsAndContent from '../report/embedded/embeddedReportToolsAndContent';
import EmbeddedReportLink from '../report/embedded/embeddedReportLink';
import EmbeddedAddChildLink from '../report/embedded/embeddedAddChildLink';
import QueryUtils from '../../utils/queryUtils';
import Breakpoints from '../../utils/breakpoints';

/**
 * This component renders child records as an embedded report. In small-breakpoint, we render a link
 * to a child report.
 */
class ChildReport extends React.Component {
    constructor(...args) {
        super(...args);
    }

    renderChildReportOrLink(childTableId, childReportId) {
        if (Breakpoints.isSmallBreakpoint() || this.props.type === 'REPORTLINK') {
            return (
                <EmbeddedReportLink {...this.props}/>
            );
        } else if (this.props.type === 'EMBEDREPORT') {
            return (
                <EmbeddedReportToolsAndContent
                    tblId={childTableId}
                    rptId={childReportId}
                    {...this.props}
                />);
        } else {
            return null;
        }
    }

    renderAddChildLink() {
        return <EmbeddedAddChildLink {...this.props}/>;
    }

    /**
     * Load a report with query parameters.
     */
    loadReportRecordsCount() {

        const {appId, childTableId, childReportId, detailKeyFid, detailKeyValue} = this.props;
        // Display a filtered child report, the child report should only contain children that
        // belong to a parent. A child has a parent if its detailKey field contains the
        // detailKeyValue that contains a parent record's masterKeyValue.
        const queryParams = {
            query: QueryUtils.parseStringIntoExactMatchExpression(detailKeyFid, detailKeyValue)
        };

        this.props.loadReportRecordsCount(this.props.uniqueId, appId, childTableId, childReportId, queryParams);
    }

    componentDidMount() {
        this.loadReportRecordsCount();
    }

    reportDetails(tableName) {
        const count = _.get(this, `props.report.recordsCount`);
        let recordsCount = '';
        if (typeof count === 'number') {
            recordsCount = ` (${count})`;
        }
        return <span className="reportDetail">{tableName}{recordsCount}</span>;
    }

    render() {
        const {appId, childAppId,  childTableId, childReportId, detailKeyFid, detailKeyValue} = this.props;
        const validProps = [appId, childAppId,  childTableId, childReportId, detailKeyFid, detailKeyValue].every(prop => prop || typeof prop === 'number');
        let rowOfButtons = false;

        let tableName;
        if (this.props.childTableName) {
            tableName  = this.props.childTableName;
        } else {
            tableName = <I18nMessage message="relationship.childTable" />;
        }

        if (!validProps) {
            return null;
        } else {
            let item1, item2;
            if (Breakpoints.isSmallBreakpoint() || this.props.type === 'REPORTLINK') {
                rowOfButtons = true;
                item1 = this.renderChildReportOrLink(childTableId, childReportId);
                item2 =  this.renderAddChildLink();
            } else {
                item1 = this.renderAddChildLink();
                item2 = this.renderChildReportOrLink(childTableId, childReportId);
            }

            const classNames = ['childReportContainer'];
            classNames.push(rowOfButtons ? 'linkContainerRowOfButtons' : '');
            return (
                <div>
                    {rowOfButtons ?  <div className="details">{this.reportDetails(tableName)}</div> : null}
                    <div className={classNames.join(' ')}>
                        {item1}
                        {item2}
                    </div>
                </div>
            );
        }
    }
}

ChildReport.propTypes = {
    appId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    childTableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    childReportId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** The name of the child table. The same as what would be shown in the left nav for that table */
    childTableName: PropTypes.string,
    /** The fid of the field containing the foreignkey. */
    detailKeyFid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** The value entered in the foreignkey field. */
    detailKeyValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.oneOf(['EMBEDREPORT', 'REPORTLINK'])
};

export {ChildReport};

//  abstract out the Redux dispatcher from the presentational component
// (another bit of boilerplate to keep the component free of Redux dependencies)
const mapDispatchToProps = (dispatch) => {
    return {
        loadReportRecordsCount: (context, appId, tblId, rptId, queryParams) => {
            dispatch(loadReportRecordsCount(context, appId, tblId, rptId, queryParams));
        }
    };
};

export default connect(null, mapDispatchToProps)(ChildReport);
