import React from 'react';
import {PropTypes, Component} from 'react';
import DialogFieldInput from '../../../../reuse/client/src/components/multiStepDialog/dialogFieldInput';
import {DIALOG_FIELD_INPUT_COMPONENT_TYPE} from '../../../../reuse/client/src/components/multiStepDialog/dialogFieldInput';
import {connect} from 'react-redux';
import * as AppBuilderActions from '../../actions/appBuilderActions';
import * as AppBuilderSelectors from '../../reducers/appBuilder';
import IconChooser from '../../../../reuse/client/src/components/iconChooser/iconChooser';
import {I18nMessage} from "../../utils/i18nMessage";
import {tableIconNames, tableIconsByTag} from '../../../../reuse/client/src/components/icon/tableIcons';
import IconUtils from '../../../../reuse/client/src/components/icon/iconUtils';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';
import Locale from '../../locales/locales';
import _ from 'lodash';

import './appCreationPanel.scss';
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
     * get a table icon with a given name
     * @param name
     * @returns {XML}
     */
    getAppIcon = (name) => {
        return <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={name} tooltipTitle={IconUtils.getIconToolTipTitle(tableIconsByTag, name)}/>;
    };

    /**
     * display suggested icons in a list
     * @returns {XML}
     */
    getSuggestedIcons= () => {
        const name = _.get(this.props, 'appName', '').toLowerCase().trim();

        if (name === '') {
            return <div className="noSuggestedIcons iconList"><I18nMessage message="tableCreation.typeForSuggestions"/></div>;
        }
        // console.log('this.props.appName: ', this.props.appName);
        let suggestedIcons = tableIconNames.filter((icon) => IconUtils.filterMatches(tableIconsByTag, name, icon)).slice(0, 8);


        if (suggestedIcons.length === 0) {
            return <div className="noSuggestedIcons iconList"><I18nMessage message="tableCreation.noSuggestedIcons"/></div>;
        }

        return (
            <div className="iconList">
                {suggestedIcons.map((iconName, i) => (
                    <button key={i} onClick={() => this.selectIcon(iconName)} type="button">
                        {this.getAppIcon(iconName)}
                    </button>))}
            </div>);
    };

    /**
     * icon selected
     * @param icon
     */
    selectIcon = (icon) => {
        this.props.setAppProperty('icon', icon);
    };

    /**
     * render an icon selection section
     * @returns {XML}
     */
    renderIconSection = () => {

        return (<div className="dialogField iconSelection">
            <IconChooser selectedIcon={this.props.appIcon}
                         isOpen={this.props.isAppIconChooserOpen}
                         onOpen={this.props.openIconChooserForApp}
                         onClose={this.props.closeIconChooserForApp}
                         font={AVAILABLE_ICON_FONTS.TABLE_STURDY}
                         icons={tableIconNames}
                         iconsByTag={tableIconsByTag}
                         onSelect={this.selectIcon} />

            <div className="dialogFieldTitle suggestedIcons">
                <div className="tableFieldTitle"><I18nMessage message="tableCreation.suggestedIconsHeading"/></div>
                {this.getSuggestedIcons()}
            </div>
        </div>);
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
                    {this.renderIconSection()}
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
