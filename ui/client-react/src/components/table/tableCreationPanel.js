import React from 'react';
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

        this.onToggleDropdown = this.onToggleDropdown.bind(this);
        this.selectIcon = this.selectIcon.bind(this);
        this.updateTableProperty = this.updateTableProperty.bind(this);
        this.onFocusInput = this.onFocusInput.bind(this);
        this.onBlurInput = this.onBlurInput.bind(this);
    }

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

    getTableIcon(name) {
        return <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={name}/>;
    }

    onToggleDropdown(isOpen) {

        if (isOpen) {
            this.props.tableMenuOpened();
        } else {
            this.props.tableMenuClosed();
        }
    }

    selectIcon(icon) {

        this.updateTableProperty('tableIcon', icon);
    }

    getIconDropdown() {

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

    tableNameExists(name) {

        return this.props.appTables.indexOf(name) !== -1;

    }

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

    componentDidMount() {

        _.mapKeys(this.props.tableInfo, (val, key) => {
            this.updateTableProperty(key, val.value, false);
        });
    }

    onFocusInput(name) {
        this.props.setEditingProperty(name);
    }

    onBlurInput() {
        this.props.setEditingProperty(null);
    }

    render() {
        return (
            <div className="tableInfo">

                <div className="description"><I18nMessage message="tableCreation.newTableDescription"/></div>
                <div className="title"><I18nMessage message="tableCreation.newTableTitle"/></div>

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
                                     edited={this.props.tableInfo.name.edited}
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

export default TableCreationPanel;
