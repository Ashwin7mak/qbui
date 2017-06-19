import React from 'react';
import {PropTypes} from 'react';
import DialogFieldInput from '../../../../reuse/client/src/components/multiStepDialog/dialogFieldInput';
import {I18nMessage} from "../../utils/i18nMessage";
import Locale from '../../locales/locales';
import {tableIconNames, tableIconsByTag} from '../../../../reuse/client/src/components/icon/tableIcons';
import IconChooser from '../../../../reuse/client/src/components/iconChooser/iconChooser';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';
import IconUtils from '../../../../reuse/client/src/components/icon/iconUtils';
import _ from 'lodash';

import './tableCreationPanel.scss';

class TableCreationPanel extends React.Component {

    constructor(props) {
        super(props);

        // bind to fix context for event handlers
        this.selectIcon = this.selectIcon.bind(this);
        this.updateTableProperty = this.updateTableProperty.bind(this);
        this.onFocusInput = this.onFocusInput.bind(this);
        this.onBlurInput = this.onBlurInput.bind(this);
    }


    /**
     * get a table icon with a given name
     * @param name
     * @returns {XML}
     */
    getTableIcon(name) {
        return <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={name} tooltipTitle={IconUtils.getIconToolTipTitle(tableIconsByTag, name)}/>;
    }

    /**
     * icon selected
     * @param icon
     */
    selectIcon(icon) {

        this.updateTableProperty('tableIcon', icon);
    }


    /**
     * display suggested icons in a list (temporary until icon chooser is built)
     * @returns {XML}
     */
    getSuggestedIcons() {
        const name = _.has(this.props, "tableInfo.name.value") ? this.props.tableInfo.name.value.toLowerCase().trim() : '';

        if (name === '') {
            return <div className="noSuggestedIcons iconList"><I18nMessage message="tableCreation.typeForSuggestions"/></div>;
        }

        let suggestedIcons = tableIconNames.filter((icon) => IconUtils.filterMatches(tableIconsByTag, name, icon)).slice(0, 8);


        if (suggestedIcons.length === 0) {
            return <div className="noSuggestedIcons iconList"><I18nMessage message="tableCreation.noSuggestedIcons"/></div>;
        }

        return (
            <div className="iconList">
                {suggestedIcons.map((iconName, i) => (
                    <button key={i} onClick={() => this.selectIcon(iconName)} type="button">
                        {this.getTableIcon(iconName)}
                    </button>))}
            </div>);
    }

    /**
     * check existing table names for proposed name
     * @param name
     * @returns {boolean}
     */
    tableNameExists(name) {

        return this.props.appTables.some((tableName) => tableName.toLowerCase().trim() === name.toLowerCase().trim());
    }

    /**
     * get validation error property/value
     * @returns {*}
     */
    getValidationError(property, value) {
        let validationError = null;

        const trimmed = typeof value === "string" ? value.trim() : value;

        switch (property) {
        case 'name': {
            if (trimmed === '') {
                validationError = Locale.getMessage('tableCreation.validateTableNameEmpty');
            } else if (this.tableNameExists(trimmed)) {
                validationError = Locale.getMessage('tableCreation.validateTableNameExists');
            }
            break;
        }
        case 'tableNoun': {
            if (trimmed === '') {
                validationError = Locale.getMessage('tableCreation.validateRecordNameEmpty');
            }
            break;
        }
        }

        return validationError;
    }

    /**
     * update a table property
     * @param property 'name' etc
     * @param value new value for property
     * @param isUserEdit did user initiate the edit?
     */
    updateTableProperty(property, value, isUserEdit = true) {

        const pendingValidationError = this.getValidationError(property, value);

        let validationError = this.props.tableInfo[property] ? this.props.tableInfo[property].validationError : null;

        this.props.setTableProperty(property, value, pendingValidationError, validationError, isUserEdit);
    }

    /**
     * handle loss of focus
     */
    onBlurInput(property, value) {

        // do validation on loss of focus unless it hasn't been edited

        if (this.props.tableInfo[property].edited) {

            // set the validation error and the live validation error for the field (same)

            const validationError = this.getValidationError(property, value);

            this.props.setTableProperty(property, value, validationError, validationError, false);
        }

        // unset edited property
        this.props.setEditingProperty(null);
    }

    /**
     * render an icon selection section (temporary until icon chooser is built)
     * @returns {XML}
     */
    renderIconSection() {

        return (<div className="tableField iconSelection">
            <IconChooser selectedIcon={this.props.tableInfo && this.props.tableInfo.tableIcon ? this.props.tableInfo.tableIcon.value : null}
                         isOpen={this.props.iconChooserOpen}
                         onOpen={this.props.openIconChooser}
                         onClose={this.props.closeIconChooser}
                         font={AVAILABLE_ICON_FONTS.TABLE_STURDY}
                         icons={tableIconNames}
                         iconsByTag={tableIconsByTag}
                         onSelect={this.selectIcon} />

            <div className="tableFieldTitle suggestedIcons">
                <div><I18nMessage message="tableCreation.suggestedIconsHeading"/></div>
                {this.getSuggestedIcons()}
            </div>
        </div>);
    }

    /**
     * validate all tableInfo props
     */
    componentDidMount() {

        _.mapKeys(this.props.tableInfo, (val, key) => {

            // update prop to set the validation state, but don't mark fields as being edited
            this.updateTableProperty(key, val.value, false);
        });

        // choose a default icon
        if (!_.has(this.props, 'tableInfo.tableIcon.value') && this.props.tableInfo.tableIcon.value) {
            this.updateTableProperty('tableIcon', tableIconNames[0], false);
        }
    }

    /**
     * set edited property to that which has focus
     * @param name
     */
    onFocusInput(name) {
        this.props.setEditingProperty(name);
    }


    /**
     * render the table settings UI
     * @returns {XML}
     */
    render() {

        return (
            <div className="tableInfo">
                <div className="sections">
                    <DialogFieldInput title={Locale.getMessage("tableCreation.tableNameHeading")}
                                      className="tableCreationPanel"
                                      name="name"
                                      placeholder={Locale.getMessage("tableCreation.tableNamePlaceholder")}
                                      value={this.props.tableInfo && this.props.tableInfo.name ? this.props.tableInfo.name.value : ""}
                                      onChange={this.updateTableProperty}
                                      onFocus={this.onFocusInput}
                                      onBlur={this.onBlurInput}
                                      required
                                      autofocus
                                      hasFocus={this.props.focusOn === "name"}
                                      edited={this.props.tableInfo && this.props.tableInfo.name ? this.props.tableInfo.name.edited : false}
                                      validationError={this.props.validate && this.props.tableInfo && this.props.tableInfo.name ? this.props.tableInfo.name.validationError : null}/>

                    <DialogFieldInput title={Locale.getMessage("tableCreation.recordNameHeading")}
                                      className="tableCreationPanel"
                                      name="tableNoun"
                                      placeholder={Locale.getMessage("tableCreation.recordNamePlaceholder")}
                                      value={this.props.tableInfo && this.props.tableInfo.tableNoun ? this.props.tableInfo.tableNoun.value : ""}
                                      onChange={this.updateTableProperty}
                                      onFocus={this.onFocusInput}
                                      onBlur={this.onBlurInput}
                                      required
                                      hasFocus={this.props.focusOn === "tableNoun"}
                                      edited={this.props.tableInfo && this.props.tableInfo.tableNoun ? this.props.tableInfo.tableNoun.edited : false}
                                      validationError={this.props.validate ? this.props.tableInfo.tableNoun.validationError : null}/>

                    {this.renderIconSection()}

                    <DialogFieldInput title={Locale.getMessage("tableCreation.descriptionHeading")}
                                      className="tableCreationPanel"
                                      name="description"
                                      placeholder={Locale.getMessage("tableCreation.descriptionPlaceholder")}
                                      value={this.props.tableInfo && this.props.tableInfo.description ? this.props.tableInfo.description.value : ""}
                                      onChange={this.updateTableProperty}
                                      component="textarea"
                                      rows="7"/>
                </div>
            </div>);
    }
}

TableCreationPanel.propTypes = {
    appTables: PropTypes.array.isRequired,
    tableInfo: PropTypes.object.isRequired,
    openIconChooser: PropTypes.func,
    closeIconChooser: PropTypes.func,
    setEditingProperty: PropTypes.func.isRequired

};

export default TableCreationPanel;
