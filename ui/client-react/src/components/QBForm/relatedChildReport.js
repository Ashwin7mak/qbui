import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

import UrlUtils from '../../utils/urlUtils';
import Breakpoints from '../../utils/breakpoints';

class ChildReport extends React.Component {
    constructor(...args) {
        super(...args);
    }
    render() {
        // TODO: render embedded report for medium and large breakpoint
        const {appId, childTableId, childReportId, foreignKeyFid, foreignKeyValue} = this.props;
        const validProps = [appId, childTableId, childReportId, foreignKeyFid, foreignKeyValue].every(prop => prop || typeof prop === 'number');
        if (!validProps) {
            return null;
        } else if (Breakpoints.isSmallBreakpoint() || true) { //TODO: medium/large breakpoint
            const link = UrlUtils.getRelatedChildReportLink(appId, childTableId, childReportId, foreignKeyFid, foreignKeyValue);
            return <Link to={link} className="relatedChildReport childReportLink">{this.props.childTableName || "Child Table"}</Link>;
        } else {
            //TODO: show embedded report in medium/large breakpoint
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
    foreignKeyFid: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    /** The value entered in the foreignkey field. */
    foreignKeyValue: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
};
ChildReport.defaultProps = {

};

export default ChildReport;
