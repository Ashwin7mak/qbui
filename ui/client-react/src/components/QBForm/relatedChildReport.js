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
        if (Breakpoints.isSmallBreakpoint() || true) {
            const link = UrlUtils.getRelatedChildReportLink(this.props.appId, this.props.childTableId, this.props.childReportId, this.props.foreignKeyFid, this.props.foreignKeyValue);
            return <Link to={link}>{this.props.childTableName || "Child Table"}</Link>;
        } else {
            return null;
        }
    }
}

ChildReport.propTypes = {
    appId: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
    childTableId: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
    childReportId: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
    /** The name of the child table. The same as what would be shown in the left nav for that table */
    childTableName: React.PropTypes.string,
    /**
     * The fid of the field containing the foreignkey.
     */
    foreignKeyFid: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
    /**
     * The value entered in the foreignkey field.
     */
    foreignKeyValue: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired
};
ChildReport.defaultProps = {

};

export default ChildReport;
