import React from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import TableFieldInput from './tableFieldInput';

import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';

import './tableCreationPanel.scss';

class TableCreationPanel extends React.Component {

    constructor(props) {
        super(props);

        this.onToggleDropdown = this.onToggleDropdown.bind(this);
        this.selectIcon = this.selectIcon.bind(this);
        this.updateTableProperty = this.updateTableProperty.bind(this);
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
                {iconNames.map((iconName, i) => (<MenuItem key={i} onSelect={() => this.selectIcon(iconName)}>{this.getTableIcon(iconName)}</MenuItem>))}
            </DropdownButton>);
    }

    getSuggestedIcons() {
        const iconNames = this.getIconNames();
        return (
            <div className="iconList">
                {iconNames.map((iconName, i) => <button key={i} onClick={() => this.selectIcon(iconName)}>{this.getTableIcon(iconName)}</button>)}
            </div>);

    }

    tableNameExists(name) {

        return this.props.appTables.indexOf(name) !== -1;

    }

    updateTableProperty(property, value) {

        let validationError = null;
        const trimmed = value.trim();

        switch (property) {
        case 'name': {
            if (trimmed === '') {
                validationError = 'Table name must not be empty';
            } else if (this.tableNameExists(trimmed)) {
                validationError = 'Table name must be unique for this app';
            }

            break;
        }
        case 'tableNoun': {
            if (trimmed === '') {
                validationError = 'Record name must not be empty';
            }
            break;
        }
        }
        this.props.setTableProperty(property, value, validationError);
    }

    renderIconSection() {

        return (<div className="tableField iconSelection">
            <div className="iconChooser">
                <div className="tableFieldTitle">Icon</div>
                {this.getIconDropdown()}
            </div>
            <div className="suggestedIcons">
                <div className="tableFieldTitle">Suggested Icons</div>
                {this.getSuggestedIcons()}
            </div>
        </div>);
    }

    render() {
        return (
            <div className="tableInfo">

                <div className="description">Create a new table when you want to collect a new type of information.
                </div>
                <div className="title">Name your table</div>

                <div className="sections">
                    <TableFieldInput title="Table Name"
                                     name="name"
                                     value={this.props.tableInfo.name.value}
                                     onChange={this.updateTableProperty}
                                     required autofocus
                                     validationError={this.props.tableInfo.name.validationError}/>

                    <TableFieldInput title="A record in the table is called a"
                                     name="tableNoun"
                                     value={this.props.tableInfo.tableNoun.value}
                                     onChange={this.updateTableProperty}
                                     required
                                     validationError={this.props.tableInfo.tableNoun.validationError}/>

                    {this.renderIconSection()}

                    <TableFieldInput title="Description"
                                     name="description"
                                     value={this.props.tableInfo.description.value}
                                     onChange={this.updateTableProperty}
                                     component="textarea"
                                     rows="6"/>
                </div>
            </div>);
    }
}

export default TableCreationPanel;
