import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import QbIcon from '../qbIcon/qbIcon';

import './alertBanner.scss';

/**
 * Creates an alert that spans the width of the page
 * This is a wrapper component that renders any child components inside of the alert.
 */
const AlertBanner = ({show, children}) => (
    <ReactCSSTransitionGroup transitionName="alertBanner" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
        {show &&
        <div className="alertBanner" key={1}>
            <QbIcon icon="alert"/>
            <p className="mainText">
                {children}
            </p>
        </div>}
    </ReactCSSTransitionGroup>
);

AlertBanner.propTypes = {
    /**
     * If true, show the alert */
    show: PropTypes.bool
};

export default AlertBanner;
