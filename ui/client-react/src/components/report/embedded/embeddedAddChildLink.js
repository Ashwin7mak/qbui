import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import _ from 'lodash';

import {loadReportRecordsCount, unloadEmbeddedReport} from '../../../actions/reportActions';
import withUniqueId from '../../hoc/withUniqueId';
import {CONTEXT} from '../../../actions/context';
import QBicon from '../../qbIcon/qbIcon';

import UrlUtils from '../../../utils/urlUtils';
import QueryUtils from '../../../utils/queryUtils';
import Locale from '../../../../../reuse/client/src/locales/locale';
import {I18nMessage} from '../../../utils/i18nMessage';

import './embeddedLink.scss';

/**
 * Renders a clickable Add Child Link as a button in a form.
 */
export const EmbeddedAddChildLink = React.createClass({
    propTypes: {
        appId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        tblId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        rptId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        rptId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /** The fid of the field containing the foreignkey. */
        detailKeyFid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /** The noun used for records in the child table . */
        childTableNoun: PropTypes.string
    },


    render() {
        const {appId, childTableId, childReportId, detailKeyFid, detailKeyValue, childTableNoun} = this.props;
        // render add child link
        const link = UrlUtils.getAddRelatedChildLink(appId, childTableId, childReportId, detailKeyFid, detailKeyValue);
        const noun = childTableNoun ? childTableNoun.toLowerCase() : Locale.getMessage("records.singular");
        const childTableMessage = <I18nMessage message="relationship.addChildRecord" tableNoun={noun}/>;
        return (
            <div className="linkContainer addChild">
                <Link to={link} className="linkInRecord btn btn-default">
                    <QBicon icon="add-mini" />
                    {childTableMessage}
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
    };
};

const ConnectedEmbeddedAddChildLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(EmbeddedAddChildLink);

export default withUniqueId(ConnectedEmbeddedAddChildLink, CONTEXT.REPORT.EMBEDDED);
