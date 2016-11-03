import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import QbIcon from '../qbIcon/qbIcon';
import AppUtils from '../../utils/appUtils';
import UrlUtils from '../../utils/urlUtils';
import {I18nMessage} from '../../utils/i18nMessage';

import './appNotFound.scss';

const AppNotFound = React.createClass({
    propTypes: {
        apps: PropTypes.array.isRequired,
        appsLoading: PropTypes.bool.isRequired,
        selectedAppId: PropTypes.string
    },
    componentDidUpdate() {
        this.appExists();
    },
    displayAppNotFound() {
        let {apps, appsLoading, selectedAppId} = this.props;

        if (appsLoading || AppUtils.appExists(selectedAppId, apps)) {
            return null;
        } else {
            return (
                <div className="appNotFound">
                    <QbIcon icon="alert" />
                    <p className="appNotFoundText">
                        <I18nMessage message="appNotFoundError.notFound"/>
                        {this.renderQuickBaseClassicLink()}
                        <I18nMessage message="appNotFoundError.quickBaseClassic" />
                    </p>
                </div>
            );
        }
    },
    renderQuickBaseClassicLink() {
        return (
            <a href={UrlUtils.getQuickBaseClassicLink(this.props.selectedAppId)}>
                <I18nMessage message="appNotFoundError.clickHere" />
            </a>
        );
    },
    render() {
        return (
            <ReactCSSTransitionGroup transitionName="appNotFound" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
                {this.displayAppNotFound()}
            </ReactCSSTransitionGroup>
        );
    }
});

export default AppNotFound;
