import React from 'react';
import './cardViewList.scss';
import QBicon from '../../qbIcon/qbIcon';
import {I18nMessage} from '../../../utils/i18nMessage';

/**
 * Footer component for report pagination small breakpoint. This adds the 'fetch next' text.
 */
var CardViewFooterNav = React.createClass({
    propTypes: {
        getNextReportPage: React.PropTypes.func,
    },

    /**
     * renders the report footer next button
     */
    render() {
        return (<div className="cardViewFooter">
                    <button className="fetchNextButton" onClick={this.props.getNextReportPage}>
                        <QBicon className="fetchNextArrow" icon="iconUiSturdy_descending" />
                        <I18nMessage message="report.nextPage"/>
                    </button>
                </div>
        );

    }
});

export default CardViewFooterNav;
