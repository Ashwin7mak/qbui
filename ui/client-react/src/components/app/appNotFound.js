import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import QbIcon from '../qbIcon/qbIcon';
import UrlUtils from '../../utils/urlUtils';

import _ from 'lodash';

import './appNotFound.scss';

const AppNotFound = React.createClass({
    propTypes: {
        appsLoading: PropTypes.bool.isRequired,
        selectedAppId: PropTypes.string.isRequired,
        apps: PropTypes.array.isRequired
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
                        Oops, we can't find your app. {this.renderQuickBaseClassicLink()} for QuickBase Classic.
                    </p>
                </div>
            );
        }
    },
    renderQuickBaseClassicLink() {
        let realmId = UrlUtils.getRealmId(window.location.href);
        let link = `https://${realmId}.quickbase.com/db/`;

        if (this.props.selectedAppId) {
            link += this.props.selectedAppId;
        } else {
            link += 'main';
        }

        return <a href={link}>Click here</a>
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
