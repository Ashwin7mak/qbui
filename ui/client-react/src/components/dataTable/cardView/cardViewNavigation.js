import React from 'react';
import './cardViewList.scss';
import QBicon from '../../qbIcon/qbIcon';
import {I18nMessage} from '../../../utils/i18nMessage';
import Loader  from 'react-loader';

/**
 * Navigation component for the small breakpoint. This will generate the fetch previous page button.
 */
var CardViewNavigation = React.createClass({
    propTypes: {
        getPreviousReportPage: React.PropTypes.func,
    },

    /**
     * renders the report fetch previous button
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
            className: 'spinner',
            top: '50%',
            left: '30%',
            shadow: false,
            hwaccel: false,
            position: 'absolute'
        };

        return (
            <div>
                <div className="headerLoadingIndicator">
                    <Loader loaded={false} options={loaderOptions}/>
                    <I18nMessage message="report.previousPageLoadingOnSwipe"/>
                </div>
                <div className="cardViewHeader">
                    <button className="fetchPreviousButton" onClick={this.props.getPreviousReportPage}>
                        <QBicon className="fetchPreviousArrow" icon="iconUiSturdy_ascending" />
                        <I18nMessage message="report.previousPage"/>
                    </button>
                </div>
            </div>
        );
    }
});

export default CardViewNavigation;