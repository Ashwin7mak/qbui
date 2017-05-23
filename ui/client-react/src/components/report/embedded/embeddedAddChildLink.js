import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import Icon from '../../../../../reuse/client/src/components/icon/icon';

import {addChildRecord} from '../../../actions/recordActions';
import QBicon from '../../qbIcon/qbIcon';

import UrlUtils from '../../../utils/urlUtils';
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
        childAppId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        childTableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        childReportId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        detailKeyValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /** The fid of the field containing the foreignKey. */
        detailKeyFid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /** The noun used for records in the child table . */
        childTableNoun: PropTypes.string
    },


    render() {
        const {childAppId, childTableId, childReportId, detailKeyFid, detailKeyValue, childTableNoun, location} = this.props;
        // render add child link
        const urlPath = _.get(location, 'pathname', '');
        const link = UrlUtils.getAddRelatedChildLink(urlPath, childAppId, childTableId, childReportId, detailKeyFid, encodeURI(detailKeyValue));
        const noun = childTableNoun ? childTableNoun.toLowerCase() : Locale.getMessage("records.singular");
        const childTableMessage = <I18nMessage message="relationship.addChildRecord" tableNoun={noun}/>;
        return (
            <div className="linkContainer addChild">
                <Link to={link} className="linkInRecord btn btn-default addChildBtn">
                    <Icon icon="add-new-stroke" />
                    <span className="tableName">{childTableMessage}</span>
                </Link>
            </div>
        );
    }
});

// // instead of relying on our parent route component to pass our props down,
// // the react-redux container will generate the required props for this route
// // from the Redux state (the presentational component has no code dependency on Redux!)
// const mapStateToProps = (state, ownProps) => {
//     return {
//         //reports: state.embeddedReports[ownProps.uniqueId]
//     };
// };

// similarly, abstract out the Redux dispatcher from the presentational component
// (another bit of boilerplate to keep the component free of Redux dependencies)
const mapDispatchToProps = (dispatch) => {
    return {
        //http://localhost.localhost:9000/qbase/app/0duiiaaaaab/table/0duiiaaaaad/report/2/record/22?editRec=new
        addChildRecord: (context, childAppId, childTableId, childReportId, detailFid, parentValue) => {
            dispatch(addChildRecord(context, childAppId, childTableId, childReportId, detailFid, parentValue));
        }
    };
};

const ConnectedEmbeddedAddChildLink = connect(
    //mapStateToProps,
    null,
    mapDispatchToProps
)(EmbeddedAddChildLink);

export default withRouter(ConnectedEmbeddedAddChildLink);
