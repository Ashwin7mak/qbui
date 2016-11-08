import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import QbIcon from '../qbIcon/qbIcon';
import UrlUtils from '../../utils/urlUtils';
import {I18nMessage} from '../../utils/i18nMessage';

import './alertBanner.scss';

const AlertBanner = React.createClass({
    propTypes: {
        show: PropTypes.bool,
        showCreateInQuickBaseClassicLink: PropTypes.bool,
        selectedAppId: PropTypes.string
    },
    displayAlertBanner() {
        if (this.props.show) {
            return (
                <div className="alertBanner">
                    <QbIcon icon="alert" />
                    <p className="mainText">
                        {this.props.children}
                        {this.renderQuickBaseClassicLink()}
                    </p>
                </div>
            );
        } else {
            return null;
        }
    },
    renderQuickBaseClassicLink() {
        if (this.props.showCreateInQuickBaseClassicLink) {
            return (
                <span>
                    <a href={UrlUtils.getQuickBaseClassicLink(this.props.selectedAppId)}>
                        <I18nMessage message="appNotFoundError.clickHere" />
                    </a>
                    <I18nMessage message="appNotFoundError.quickBaseClassic" />
                </span>
        );
        }

        return null;
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
