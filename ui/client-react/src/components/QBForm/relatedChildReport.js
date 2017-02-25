import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

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
    // remove the eslint override when true case is removed
    /* eslint no-constant-condition:0 */
    render() {
        const {appId, childTableId, childReportId, detailKeyFid, detailKeyValue} = this.props;
        const validProps = [appId, childTableId, childReportId, detailKeyFid, detailKeyValue].every(prop => prop || typeof prop === 'number');
        if (!validProps) {
            return null;
        } else if (Breakpoints.isSmallBreakpoint() || true) {
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
        } else {
            // TODO: render embedded report for medium and large breakpoint
            return null;
        }
    }
}

ChildReport.propTypes = {
    appId: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    childTableId: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    childReportId: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    /** The name of the child table. The same as what would be shown in the left nav for that table */
    childTableName: React.PropTypes.string,
    /** The fid of the field containing the foreignkey. */
    detailKeyFid: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    /** The value entered in the foreignkey field. */
    detailKeyValue: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
};

export default ChildReport;
