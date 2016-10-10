import React from 'react';
import './cardViewList.scss';
import QBicon from '../../qbIcon/qbIcon';
import {I18nMessage} from '../../../utils/i18nMessage';
import Loader  from 'react-loader';
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";

/**
 * Footer component for report pagination small breakpoint. This adds the 'fetch next' text.
 */
var CardViewFooter = React.createClass({
    propTypes: {
        getNextReportPage: React.PropTypes.func,
    },

    /**
     * renders the report footer next button
     */
    render() {
        return (
            <div className="cardViewFooterContainer">
                <div className="cardViewFooter">
                    <button className="fetchNextButton" onClick={this.props.getNextReportPage}>
                        <QBicon className="fetchNextArrow" icon="iconUiSturdy_descending" />
                        <I18nMessage message="report.nextPage"/>
                    </button>
                </div>
                <div className="footerLoadingIndicator">
                    <Loader loaded={false} options={SpinnerConfigurations.CARD_VIEW_NAVIGATION}/>
                    <I18nMessage message="report.nextPageLoadingOnSwipe"/>
                </div>
            </div>
        );
    }
});

export default CardViewFooter;
