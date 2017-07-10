import React from 'react';
import {PropTypes, Component} from 'react';
import DialogFieldInput from '../../../../reuse/client/src/components/multiStepDialog/dialogFieldInput';
import {DIALOG_FIELD_INPUT_COMPONENT_TYPE} from '../../../../reuse/client/src/components/multiStepDialog/dialogFieldInput';
import {connect} from 'react-redux';
import * as AppBuilderActions from '../../actions/appBuilderActions';
import * as AppBuilderSelectors from '../../reducers/appBuilder';
import Locale from '../../locales/locales';
import IconChooser from '../../../../reuse/client/src/components/iconChooser/iconChooser';
import {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';

//TODO: XD needs to provide us with a list of appIconNames and appIconsByTag, currently none exists
import {tableIconNames, tableIconsByTag} from '../../../../reuse/client/src/components/icon/tableIcons';

import '../../../../reuse/client/src/components/multiStepDialog/dialogCreationPanel.scss';

export class AppCreationPanel extends Component {
    static propTypes = {
        setAppProperty: PropTypes.func,
        openIconChooser: PropTypes.func,
        closeIconChooser: PropTypes.func,
        appName: PropTypes.string,
        appDescription: PropTypes.string,
        appIcon: PropTypes.string,
        isAppIconChooserOpen: PropTypes.bool
    };

    /**
     * check existing app names for proposed name
     * @param name
     * @returns {boolean}
     */
    appNameExists = (name) => {
        return this.props.apps.some((app) => app.name.toLowerCase().trim() === name.toLowerCase().trim());
    };

    /**
     * get validation error property/value
     * @returns {*}
     */
    getValidationError = (property, value) => {
        let validationError = null;
        const trimmed = typeof value === "string" ? value.trim() : value;
        if (trimmed === '') {
            validationError = Locale.getMessage('appCreation.validateAppNameEmpty');
        } else if (this.appNameExists(trimmed)) {
            validationError = Locale.getMessage('appCreation.validateAppNameExists');
        }

        return validationError;
    };

    /**
     * set app properties
     * @param  property
     * @param  value
     */
    setAppProperty = (property, value) => {
        //only app name needs to be validated
        if (property === 'name') {
            let pendingValidationError = this.getValidationError(property, value);
            let validationError = null;

            this.props.setAppProperty(property, value, pendingValidationError, validationError);
        } else {
            this.props.setAppProperty(property, value);
        }
    };

    /**
     * handle loss of focus
     */
    onBlurInput = (property, value) => {
        // do validation on loss of focus unless it hasn't been edited
        if (this.props.isEdited && property === 'name') {
            const validationError = this.props.pendingValidationError;
            // set the validation error and the live validation error for the field (same)
            this.props.setAppProperty(property, value, validationError, validationError);
        }
    };

    /**
     * set app icon
     * @param  icon
     */
    setAppIcon = (icon) => {
        this.props.setAppProperty('icon', icon);
    };

    /**
     * render the app settings UI
     * @returns {XML}
     */
    render() {
        return (
            <div className="appCreationPanel dialogCreationPanelInfo">
                <div className="sections">
                    <DialogFieldInput title={Locale.getMessage("appCreation.appNameHeading")}
                                      className="appCreationPanel"
                                      name="name"
                                      value={this.props.appName || ""}
                                      onChange={this.setAppProperty}
                                      onBlur={this.onBlurInput}
                                      placeholder={Locale.getMessage("appCreation.appNamePlaceHolder")}
                                      required
                                      edited={this.props.isEdited}
                                      validationError={this.props.validationError}
                                      autofocus />

                    <DialogFieldInput title={Locale.getMessage("appCreation.descriptionHeading")}
                                      className="appCreationPanel"
                                      name="description"
                                      value={this.props.appDescription || ""}
                                      onChange={ this.props.setAppProperty}
                                      component={DIALOG_FIELD_INPUT_COMPONENT_TYPE.textarea}
                                      rows="3" />

                    <IconChooser selectedIcon={this.props.appIcon}
                                 className="appCreationIconChooser"
                                 isOpen={this.props.isAppIconChooserOpen}
                                 onOpen={this.props.openIconChooserForApp}
                                 onClose={this.props.closeIconChooserForApp}
                                 placeHolder="appCreation.searchPlaceholder"
                                 font={AVAILABLE_ICON_FONTS.TABLE_STURDY}
                                 name={this.props.appName}
                                 setIconChoice={this.setAppIcon}
                                 listOfIconsByNames={tableIconNames}
                                 listOfIconsByTagNames={tableIconsByTag} />
                </div>
            </div>);
    }
}


const mapStateToProps = (state) => {
    let {name, icon, description} = AppBuilderSelectors.getAppProperties(state);
    let {validationError, pendingValidationError, isEdited} = AppBuilderSelectors.getValidationErrorAndIsEdited(state);

    return {
        apps: _.get(state, 'app.apps', []),
        appName: name,
        appDescription: description,
        appIcon: icon,
        isAppIconChooserOpen: AppBuilderSelectors.isAppIconChooserOpen(state),
        pendingValidationError,
        validationError,
        isEdited
    };
};

const mapDispatchToProps = {
    setAppProperty: AppBuilderActions.setAppProperty,
    openIconChooserForApp: AppBuilderActions.openIconChooserForApp,
    closeIconChooserForApp: AppBuilderActions.closeIconChooserForApp
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppCreationPanel);
