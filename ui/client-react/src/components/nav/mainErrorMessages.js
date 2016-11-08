import React, {PropTypes} from 'react';
import {I18nMesage} from '../../utils/i18nMessage';
import AlertBanner from '../alertBanner/alertBanner';

const MainErrorMessage = React.createClass({
    propTypes: {
        apps: PropTypes.array,
        appsLoading: PropTypes.bool,
        selectedAppId: PropTypes.string
    },
    renderAppNotFound() {
        let {apps, appsLoading, selectedAppId} = this.props;
        let show = (!appsLoading && !AppUtils.appExists(selectedAppId, apps));
        return (
            <AlertBanner show={show} showCreateInQuickBaseClassicLink={true} selectedAppId={selectedAppId}>
                <I18nMessage message="appNotFoundError.notFound"/>
            </AlertBanner>
        );
    },

    render() {
        return (
            <div className="mainErrorMessages">
                {this.renderAppNotFound()}
            </div>
        );
    }
});

export default MainErrorMessage;
