import React from 'react';
import {PropTypes, Component} from 'react';
import DialogFieldInput from '../../../../reuse/client/src/components/multiStepDialog/dialogFieldInput';
import {DIALOG_FIELD_INPUT_COMPONENT_TYPE} from '../../../../reuse/client/src/components/multiStepDialog/dialogFieldInput';
import Locale from '../../locales/locales';
import IconChooser from '../../../../reuse/client/src/components/iconChooser/iconChooser';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';
import IconUtils from '../../../../reuse/client/src/components/icon/iconUtils';
import {MAX_TABLE_NAME_LENGTH, MAX_TABLE_RECORD_NAME_LENGTH} from '../../constants/componentConstants';
import _ from 'lodash';
import {tableIconNames, tableIconsByTag} from '../../../../reuse/client/src/components/icon/tableIcons';
import '../../../../reuse/client/src/components/multiStepDialog/dialogCreationPanel.scss';

class TableCreationPanel extends Component {
    /**
     * check existing table names for proposed name
     * @param name
     * @returns {boolean}
     */
    tableNameExists = (name) => {

        return this.props.appTables.some((tableName) => tableName.toLowerCase().trim() === name.toLowerCase().trim());
    };

    /**
     * get validation error property/value
     * @returns {*}
     */
    getValidationError = (property, value) => {
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
    };

    /**
     * update a table property
     * @param property 'name' etc
     * @param value new value for property
     * @param isUserEdit did user initiate the edit?
     */
    updateTableProperty = (property, value, isUserEdit = true) => {

        const pendingValidationError = this.getValidationError(property, value);

        let validationError = this.props.tableInfo[property] ? this.props.tableInfo[property].validationError : null;

        this.props.setTableProperty(property, value, pendingValidationError, validationError, isUserEdit);
    };

    /**
     * handle loss of focus
     */
    onBlurInput = (property, value) => {

        // do validation on loss of focus unless it hasn't been edited

        if (this.props.tableInfo[property].edited) {

            // set the validation error and the live validation error for the field (same)

            const validationError = this.getValidationError(property, value);

            this.props.setTableProperty(property, value, validationError, validationError, false);
        }

        // unset edited property
        this.props.setEditingProperty(null);
    };

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
    onFocusInput = (name) => {
        this.props.setEditingProperty(name);
    };

    /**
     * set table icon
     * @param  icon
     */
    setTableIcon = (icon) => {
        this.props.setTableProperty('tableIcon', icon);
    };

    /**
     * render the table settings UI
     * @returns {XML}
     */
    render() {

        return (
            <div className="tableInfo dialogCreationPanelInfo">
                <div className="sections">
                    <DialogFieldInput title={Locale.getMessage("tableCreation.tableNameHeading")}
                                      className="tableCreationPanel"
                                      name="name"
                                      placeholder={Locale.getPluralizedMessage("tableCreation.tableNamePlaceholder", {numberOfChars: MAX_TABLE_NAME_LENGTH})}
                                      value={this.props.tableInfo && this.props.tableInfo.name ? this.props.tableInfo.name.value : ""}
                                      onChange={this.updateTableProperty}
                                      onFocus={this.onFocusInput}
                                      onBlur={this.onBlurInput}
                                      required
                                      autofocus
                                      hasFocus={this.props.focusOn === "name"}
                                      edited={this.props.tableInfo && this.props.tableInfo.name ? this.props.tableInfo.name.edited : false}
                                      validationError={this.props.validate && this.props.tableInfo && this.props.tableInfo.name ? this.props.tableInfo.name.validationError : null}
                                      maxLength={MAX_TABLE_NAME_LENGTH}/>

                    <DialogFieldInput title={Locale.getMessage("tableCreation.recordNameHeading")}
                                      className="tableCreationPanel"
                                      name="tableNoun"
                                      placeholder={Locale.getPluralizedMessage("tableCreation.recordNamePlaceholder", {numberOfChars: MAX_TABLE_NAME_LENGTH})}
                                      value={this.props.tableInfo && this.props.tableInfo.tableNoun ? this.props.tableInfo.tableNoun.value : ""}
                                      onChange={this.updateTableProperty}
                                      onFocus={this.onFocusInput}
                                      onBlur={this.onBlurInput}
                                      required
                                      hasFocus={this.props.focusOn === "tableNoun"}
                                      edited={this.props.tableInfo && this.props.tableInfo.tableNoun ? this.props.tableInfo.tableNoun.edited : false}
                                      validationError={this.props.validate ? this.props.tableInfo.tableNoun.validationError : null}
                                      maxLength={MAX_TABLE_RECORD_NAME_LENGTH}/>

                    <IconChooser selectedIcon={this.props.tableInfo && this.props.tableInfo.tableIcon ? this.props.tableInfo.tableIcon.value : null}
                                 className="tableCreationIconChooser"
                                 name={this.props.tableInfo && this.props.tableInfo.name ? this.props.tableInfo.name.value : ""}
                                 isOpen={this.props.iconChooserOpen}
                                 onOpen={this.props.openIconChooser}
                                 onClose={this.props.closeIconChooser}
                                 setIconChoice={this.setTableIcon}
                                 placeHolder="tableCreation.searchPlaceholder"
                                 font={AVAILABLE_ICON_FONTS.TABLE_STURDY}
                                 listOfIconsByNames={tableIconNames}
                                 listOfIconsByTagNames={tableIconsByTag} />

                    <DialogFieldInput title={Locale.getMessage("tableCreation.descriptionHeading")}
                                      className="tableCreationPanel"
                                      name="description"
                                      placeholder={Locale.getMessage("tableCreation.descriptionPlaceholder")}
                                      value={this.props.tableInfo && this.props.tableInfo.description ? this.props.tableInfo.description.value : ""}
                                      onChange={this.updateTableProperty}
                                      component={DIALOG_FIELD_INPUT_COMPONENT_TYPE.textarea}
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
    setEditingProperty: PropTypes.func.isRequired,
    setTableProperty: PropTypes.func.isRequired
};

export default TableCreationPanel;
