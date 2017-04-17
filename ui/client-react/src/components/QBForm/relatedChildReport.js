import React, {PropTypes} from 'react';

import EmbeddedReportToolsAndContent from '../report/embedded/embeddedReportToolsAndContent';
import EmbeddedReportLink from '../report/embedded/embeddedReportLink';

import Breakpoints from '../../utils/breakpoints';

/**
 * This component renders child records as an embedded report. In small-breakpoint, we render a link
 * to a child report.
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
