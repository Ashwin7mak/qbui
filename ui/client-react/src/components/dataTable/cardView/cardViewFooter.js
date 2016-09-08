import React from 'react';
import './cardViewList.scss';
import QBicon from '../../qbIcon/qbIcon';
import {I18nMessage} from '../../../utils/i18nMessage';
import Loader  from 'react-loader';

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
        // TODO Code hygiene, set up loader options as an external constant. https://quickbase.atlassian.net/browse/MB-503
        let loaderOptions = {
            lines: 7,
            length: 0,
            width: 5,
            radius: 5,
            scale: 1,
            corners: 1,
            opacity: 0,
            rotate: 0,
            direction: 1,
            speed: 1.1,
            trail: 60,
            fps: 20,
            zIndex: 2e9,
            color: '#7090ab',
            className: 'spinner',
            top: '50%',
            left: '30%',
            shadow: false,
            hwaccel: false,
            position: 'absolute'
        };

        return (
            <div>
                <div className="cardViewFooter">
                    <button className="fetchNextButton" onClick={this.props.getNextReportPage}>
                        <QBicon className="fetchNextArrow" icon="iconUiSturdy_descending" />
                        <I18nMessage message="report.nextPage"/>
                    </button>
                </div>
                <div className="footerLoadingIndicator">
                    <Loader loaded={false} options={loaderOptions}/>
                    <I18nMessage message="report.nextPageLoadingOnSwipe"/>
                </div>
            </div>
        );
    }
});

export default CardViewFooter;
