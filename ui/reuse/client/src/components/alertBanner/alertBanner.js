import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Icon from '../icon/icon';

import './alertBanner.scss';

/**
 * Creates an alert that spans the width of the page
 * This is a wrapper component that renders any child components inside of the alert.
 *
 * You can use this component by passing text as a prop or as a child element. The prop will take precedence over the child element.
 * <AlertBanner isVisible={true}>My Text</AlertBanner>
 * <AlertBanner isVisible={true} text="My Text" />
 */
const AlertBanner = ({isVisible, children, text}) => (
    <ReactCSSTransitionGroup transitionName="alertBanner" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
        {isVisible &&
        <div className="alertBanner" key={1}>
            <Icon icon="alert"/>
            <p className="mainText">
                {text || children}
            </p>
        </div>}
    </ReactCSSTransitionGroup>
);

AlertBanner.propTypes = {
    /**
     * If true, show the alert */
    isVisible: PropTypes.bool,

    /**
     *  */
    text: PropTypes.string,
};

export default AlertBanner;
