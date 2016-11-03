import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import QbIcon from '../qbIcon/qbIcon';
import UrlUtils from '../../utils/urlUtils';
import {I18nMessage} from '../../utils/i18nMessage';

import _ from 'lodash';

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
    appExists() {
        let {selectedAppId, apps} = this.props;
        let foundAppId = _.find(apps, {id: selectedAppId});
        return (selectedAppId && foundAppId);
    },
    displayAppNotFound() {
        if (this.props.appsLoading || this.appExists()) {
            return null;
        } else {
            return (
                <div className="appNotFound">
                    <QbIcon icon="alert" />
                    <p className="appNotFoundText">
                        <I18nMessage message="appNotFoundError.notFound"/>
                        <I18nMessage message="appNotFoundError.quickBaseClassic" />
                        {this.renderQuickBaseClassicLink()}
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
