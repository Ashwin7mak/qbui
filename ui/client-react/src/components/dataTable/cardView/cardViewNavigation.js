import React from 'react';
import './cardViewList.scss';
import QBicon from '../../qbIcon/qbIcon';
import {I18nMessage} from '../../../utils/i18nMessage';


/**
 * Navigation component for the small breakpoint. This will generate the fetch previous page button
 */
var CardViewNavigation = React.createClass({
    propTypes: {
        getPreviousReportPage: React.PropTypes.func,
    },

    /**
     * renders the report fetch previous button
     */
    render() {
        return (
            <div className="cardViewHeader">
                <button className="fetchPreviousButton" onClick={this.props.getPreviousReportPage}>
                    <QBicon className="fetchPreviousArrow" icon="iconUiSturdy_ascending" />
                    <I18nMessage message="report.previousPage"/>
                </button>
            </div>
        );
    }
});

export default CardViewNavigation;
