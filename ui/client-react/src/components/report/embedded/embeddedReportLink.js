import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';

import {unloadEmbeddedReport} from '../../../actions/reportActions';
import QBicon from '../../qbIcon/qbIcon';

import Breakpoints from '../../../utils/breakpoints';
import UrlUtils from '../../../utils/urlUtils';
import {I18nMessage} from '../../../utils/i18nMessage';

import './embeddedLink.scss';

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


    componentWillUnmount() {
        this.props.unloadEmbeddedReport(this.props.uniqueId);
    },


    render() {
        const {appId, childTableId, childReportId, detailKeyFid, detailKeyValue, detailKeyDisplay} = this.props;

        let link;
        if (Breakpoints.isSmallBreakpoint()) {
            link = this.props.match.url + UrlUtils.getReportDrawerSegment(appId, childTableId, childReportId, detailKeyFid,
                    detailKeyValue, detailKeyDisplay);
        } else {
            link = UrlUtils.getRelatedChildReportLink(appId, childTableId, childReportId, detailKeyFid,
                detailKeyValue, detailKeyDisplay);
        }

        let tableName;
        if (this.props.childTableName) {
            tableName  = this.props.childTableName;
        } else {
            tableName = <I18nMessage message="relationship.childTable" />;
        }

        return (
                <div className="linkContainer">
                    <Link to={link} className="linkInRecord btn btn-default">
                        <QBicon icon="eye" />
                        <span className="tableName">{tableName}</span>
                    </Link>
                </div>
        );
    }
});

// instead of relying on our parent route component to pass our props down,
// the react-redux container will generate the required props for this route
// from the Redux state (the presentational component has no code dependency on Redux!)
const mapStateToProps = (state, ownProps) => {
    return {
        reports: state.embeddedReports[ownProps.uniqueId]
    };
};

// similarly, abstract out the Redux dispatcher from the presentational component
// (another bit of boilerplate to keep the component free of Redux dependencies)
const mapDispatchToProps = (dispatch) => {
    return {
        unloadEmbeddedReport: (context) =>
            dispatch(unloadEmbeddedReport(context))
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(EmbeddedReportLink));
