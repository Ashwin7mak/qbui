import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import QbIcon from '../qbIcon/qbIcon';
import UrlUtils from '../../utils/urlUtils';
import {I18nMessage} from '../../utils/i18nMessage';

import './alertBanner.scss';

/**
 * Creates an alert that spans the width of the page
 * This is a wrapper component that renders any child components inside of the alert.
 */
const AlertBanner = React.createClass({
    propTypes: {
        /**
         * If true, show the alert */
        show: PropTypes.bool,
    },
    displayAlertBanner() {
        if (this.props.show) {
            return (
                <div className="alertBanner">
                    <QbIcon icon="alert" />
                    <p className="mainText">
                        {this.props.children}
                    </p>
                </div>
            );
        } else {
            return null;
        }
    },

    render() {
        return (
            <ReactCSSTransitionGroup transitionName="alertBanner" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
                {this.displayAlertBanner()}
            </ReactCSSTransitionGroup>
        );
    }
});

export default AlertBanner;
