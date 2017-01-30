import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

import UrlUtils from '../../utils/urlUtils';
import Breakpoints from '../../utils/breakpoints';

class ChildReport extends React.Component {
    constructor(...args) {
        super(...args);
        console.log(this.props);
    }
    render() {
        // TODO: render embedded report for medium and large breakpoint
        if (Breakpoints.isSmallBreakpoint() || true) {
            const link = UrlUtils.getRelatedChildReportLink(this.props.appId, this.props.childTableId, this.props.childReportId, this.props.fieldWithParentId, this.props.parentRecordId);
            return <Link to={link}>Child Table</Link>;
        } else {
            return null;
        }
    }
}

ChildReport.propTypes = {
    /** ##Really? */
    appId: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
};
ChildReport.defaultProps = {

};

export default ChildReport;
