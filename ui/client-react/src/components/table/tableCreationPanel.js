import React from 'react';
import {PropTypes} from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import TableFieldInput from './tableFieldInput';
import {I18nMessage} from "../../utils/i18nMessage";
import Locale from '../../locales/locales';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';

import './tableCreationPanel.scss';

class TableCreationPanel extends React.Component {

    constructor(props) {
        super(props);

        // bind to fix context for event handlers
        this.onToggleDropdown = this.onToggleDropdown.bind(this);
        this.selectIcon = this.selectIcon.bind(this);
        this.updateTableProperty = this.updateTableProperty.bind(this);
        this.onFocusInput = this.onFocusInput.bind(this);
        this.onBlurInput = this.onBlurInput.bind(this);
    }

    /**
     * get a set of table icon names (this is temporary until the icon chooser is built)
     * @returns
     */
    getIconNames()  {
        return [
            "estimates",
            "projects",
            "customers",
            "invoices",
            "person",
            "mailbox",
            "projects",
            "reports",
            "schedule"
        ];
    }

    /**
     * get a table icon with a given name
     * @param name
     * @returns {XML}
     */
    getTableIcon(name) {
        return <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={name}/>;
    }

    /**
     * track open dialogs since parent might need the info to prevent clipping etc.
     * @param isOpen
     */
    onToggleDropdown(isOpen) {

        if (isOpen && this.props.tableMenuOpened) {
            this.props.tableMenuOpened();
        } else if (this.props.tableMenuOpened) {
            this.props.tableMenuClosed();
        }
    }

    /**
     * icon selected
     * @param icon
     */
    selectIcon(icon) {

        this.updateTableProperty('tableIcon', icon);
    }

    /**
     * get a dropdown containing a set of sample icons (temporary until icon chooser is built)
     * @returns {XML}
     */
    getIconDropdown() {

        // set title to currently selected icon
        const dropdownTitle = this.getTableIcon(this.props.tableInfo.tableIcon.value);

        const iconNames = this.getIconNames();

        return (
            <DropdownButton title={dropdownTitle}
                            id="createTableIconDropdown"
                            onToggle={this.onToggleDropdown}>
                {iconNames.map((iconName, i) => (
                    <MenuItem key={i}
                              onSelect={() => this.selectIcon(iconName)}>
                                    {this.getTableIcon(iconName)}
                    </MenuItem>))}
            </DropdownButton>);
    }

    /**
     * display suggested icons in a list (temporary until icon chooser is built)
     * @returns {XML}
     */
    getSuggestedIcons() {
        const iconNames = this.getIconNames();
        return (
            <div className="iconList">
                {iconNames.map((iconName, i) => (
                    <button key={i} onClick={() => this.selectIcon(iconName)}>
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
     * updata a table property
     * @param property 'name' etc
     * @param value new value for property
     * @param isUserEdit did user initiate the edit?
     */
    updateTableProperty(property, value, isUserEdit = true) {

        let validationError = null;
        const trimmed = value.trim();

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
        this.props.setTableProperty(property, value, validationError, isUserEdit);
    }

    /**
     * render an icon selection section (temporary until icon chooser is built)
     * @returns {XML}
     */
    renderIconSection() {

        return (<div className="tableField iconSelection">
            <div className="iconChooser">
                <div className="tableFieldTitle"><I18nMessage message="tableCreation.iconHeading"/></div>
                {this.getIconDropdown()}
            </div>
            <div className="suggestedIcons">
                <div className="tableFieldTitle"><I18nMessage message="tableCreation.suggestedIconsHeading"/></div>
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
    }

    /**
     * set edited property to that which has focus
     * @param name
     */
    onFocusInput(name) {
        this.props.setEditingProperty(name);
    }

    /**
     * unset edited property when focus is lost
     */
    onBlurInput() {
        this.props.setEditingProperty(null);
    }

    /**
     * render the table settings UI
     * @returns {XML}
     */
    render() {
        return (
            <div className="tableInfo">
                <div className="sections">
                    <TableFieldInput title={Locale.getMessage("tableCreation.tableNameHeading")}
                                     name="name"
                                     placeholder={Locale.getMessage("tableCreation.tableNamePlaceholder")}
                                     value={this.props.tableInfo.name.value}
                                     onChange={this.updateTableProperty}
                                     onFocus={this.onFocusInput}
                                     onBlur={this.onBlurInput}
                                     required
                                     autofocus
                                     hasFocus={this.props.focusOn === "name"}
                                     edited={this.props.tableInfo ? this.props.tableInfo.name.edited : false}
                                     validationError={this.props.validate ? this.props.tableInfo.name.validationError : null}/>

                    <TableFieldInput title={Locale.getMessage("tableCreation.recordNameHeading")}
                                     name="tableNoun"
                                     placeholder={Locale.getMessage("tableCreation.recordNamePlaceholder")}
                                     value={this.props.tableInfo.tableNoun.value}
                                     onChange={this.updateTableProperty}
                                     onFocus={this.onFocusInput}
                                     onBlur={this.onBlurInput}
                                     required
                                     hasFocus={this.props.focusOn === "tableNoun"}
                                     edited={this.props.tableInfo.tableNoun.edited}
                                     validationError={this.props.validate ? this.props.tableInfo.tableNoun.validationError : null}/>

                    {this.renderIconSection()}

                    <TableFieldInput title={Locale.getMessage("tableCreation.descriptionHeading")}
                                     name="description"
                                     placeholder={Locale.getMessage("tableCreation.descriptionPlaceholder")}
                                     value={this.props.tableInfo.description.value}
                                     onChange={this.updateTableProperty}
                                     component="textarea"
                                     rows="6"/>
                </div>
            </div>);
    }
}

TableCreationPanel.propTypes = {
    appTables: PropTypes.array.isRequired,
    tableInfo: PropTypes.object.isRequired,
    tableMenuOpened: PropTypes.func,
    tableMenuClosed: PropTypes.func,
    setEditingProperty: PropTypes.func.isRequired

};

export default TableCreationPanel;
