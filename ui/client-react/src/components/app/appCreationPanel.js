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
                                      value={this.props.appName}
                                      onChange={this.props.setAppProperty}
                                      placeholder={Locale.getMessage("appCreation.appNamePlaceHolder")}
                                      required
                                      autofocus />

                    <DialogFieldInput title={Locale.getMessage("appCreation.descriptionHeading")}
                                      className="appCreationPanel"
                                      name="description"
                                      value={this.props.appDescription}
                                      onChange={ this.props.setAppProperty}
                                      component={DIALOG_FIELD_INPUT_COMPONENT_TYPE.textarea}
                                      rows="3" />

                    <IconChooser selectedIcon={this.props.appIcon}
                                 className="appCreationIconChooser"
                                 isOpen={this.props.isAppIconChooserOpen}
                                 onOpen={this.props.openIconChooserForApp}
                                 onClose={this.props.closeIconChooserForApp}
                                 placeHolder="appCreation.searchPlaceholder"
                                 typeForSuggestionsText="appCreation.typeForSuggestions"
                                 noSuggestedIconsText="appCreation.noSuggestedIcons"
                                 font={AVAILABLE_ICON_FONTS.TABLE_STURDY}
                                 name={this.props.appName}
                                 setIconChoice={(icon) => this.props.setAppProperty('icon', icon)}
                                 listOfIconsByNames={tableIconNames}
                                 listOfIconsByTagNames={tableIconsByTag} />
                </div>
            </div>);
    }
}


const mapStateToProps = (state) => {
    return {
        appName: AppBuilderSelectors.getAppProperty(state, 'name'),
        appDescription: AppBuilderSelectors.getAppProperty(state, 'description'),
        appIcon: AppBuilderSelectors.getAppProperty(state, 'icon'),
        isAppIconChooserOpen: AppBuilderSelectors.isAppIconChooserOpen(state)
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
