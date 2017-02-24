import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

import {smallReport, largeReport, reportData} from '../../mocks/reports';
import EmbeddedReportToolsAndContent from '../report/embeddedReportToolsAndContent';
import ReportGrid from '../dataTable/reportGrid/reportGrid';

import UrlUtils from '../../utils/urlUtils';
import Breakpoints from '../../utils/breakpoints';
import {I18nMessage} from '../../utils/i18nMessage';

/**
 * This component renders a link to a child report, which is the behavior in the small breakpoint.
 * In medium/large breakpoint, we will show an embedded report of the children(not implemented yet).
 */
class ChildReport extends React.Component {
    constructor(...args) {
        super(...args);
    }
    render() {
        const {appId, childTableId, childReportId, detailKeyFid, detailKeyValue} = this.props;
        const validProps = [appId, childTableId, childReportId, detailKeyFid, detailKeyValue].every(prop => prop || typeof prop === 'number');
        if (!validProps) {
            return null;
        } else if (Breakpoints.isSmallBreakpoint() || this.props.type === 'REPORTLINK') {
            const link = UrlUtils.getRelatedChildReportLink(appId, childTableId, childReportId, detailKeyFid, detailKeyValue);
            let reportLink;
            if (this.props.childTableName) {
                reportLink = <span>{this.props.childTableName}</span>;
            } else {
                reportLink = <I18nMessage message="relationship.childTable" />;
            }
            return (
                <Link to={link} className="relatedChildReport childReportLink">
                    {reportLink}
                </Link>
            );
        } else if (this.props.type === 'EMBEDREPORT') {
            // TODO: render embedded report for medium and large breakpoint
            //return <ReportGrid isViewOnly={true} {...smallReport} />;
            return <EmbeddedReportToolsAndContent {...reportData} />;
        } else {
            return null;
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

export default ChildReport;
