import React from 'react';
import {PropTypes} from 'react';
import AppCreationPanel from './appCreationPanel';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {connect} from 'react-redux';
import * as AppBuilderActions from '../../actions/appBuilderActions';
import * as ShellActions from '../../actions/shellActions';
import * as AppBuilderSelectors from '../../reducers/appBuilder';
import Locale from '../../locales/locales';
import UrlUtils from '../../utils/urlUtils';
import AppHistory from '../../globals/appHistory';
import {NotificationManager} from 'react-notifications';

import '../../../../reuse/client/src/components/multiStepDialog/creationDialog.scss';

export class AppCreationDialog extends React.Component {
    /**
     * cancel
     */
    onCancel = () => {
        this.props.hideAppCreationDialog();
    };

    /**
     * last page has finished
     */
    onFinished = () => {
        if (this.props.app) {
            this.props.createApp(this.props.app).then((response) => {
                let appId = _.get(response, 'data.id', null);
                //reroutes to app home page link
                AppHistory.history.push(UrlUtils.getAppHomePageLink(appId));
                //this forces the table list to show, after the user is navigated to the app home page link
                this.props.toggleAppsList(false);
            }, (error) => {
                // leave the dialog open but issue a growl indicating an error
                NotificationManager.error(Locale.getMessage('appCreation.appCreationFailed'), Locale.getMessage('failed'));
            });
        }
    };

    /**
     * check for any validation errors in app
     * @returns {boolean}
     */
    isValid = () => {
        // form can be saved if the state of the field is valid, regardless of what previous validation error is being shown
        return  !this.props.pendingValidationError;
    };

    /**
     * render the multi-step modal dialog for creating a app
     * @returns {XML}
     */
    render() {
        const classes = ['appCreationDialog creationDialog'];

        // if icon chooser is open, add class to allow it to overflow the bottom buttons (while open)
        if (this.props.isAppIconChooserOpen) {
            classes.push('allowOverflow');
        }

        return (
            <MultiStepDialog show={this.props.appDialogOpen}
                             classes={classes.join(' ')}
                             onCancel={this.onCancel}
                             onFinished={this.onFinished}
                             canProceed={this.isValid()}
                             finishedButtonLabel={Locale.getMessage("appCreation.finishedButtonLabel")}
                             titles={[Locale.getMessage("appCreation.newAppPageTitle")]}>
                <div className="dialogCreationPanel">
                    <AppCreationPanel />
                </div>
            </MultiStepDialog>
        );
    }
}

AppCreationDialog.propTypes = {
    hideAppCreationDialog: PropTypes.func.isRequired,
    appDialogOpen: PropTypes.bool.isRequired,
    isAppIconChooserOpen: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    let {pendingValidationError} = AppBuilderSelectors.getValidationErrorAndIsEdited(state);
    return {
        pendingValidationError: pendingValidationError,
        appDialogOpen: AppBuilderSelectors.getIsDialogOpenState(state),
        app: AppBuilderSelectors.getNewAppInfo(state),
        isAppIconChooserOpen: AppBuilderSelectors.isAppIconChooserOpen(state)
    };
};

const mapDispatchToProps = {
    hideAppCreationDialog: AppBuilderActions.hideAppCreationDialog,
    createApp: AppBuilderActions.createApp,
    toggleAppsList: ShellActions.toggleAppsList
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppCreationDialog);
