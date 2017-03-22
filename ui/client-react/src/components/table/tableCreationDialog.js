import React from 'react';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {connect} from 'react-redux';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';
import {NotificationManager} from 'react-notifications';
import * as TableCreationActions from '../../actions/tableCreationActions';
import Locale from '../../locales/locales';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import UrlUtils from '../../utils/urlUtils';

import './tableCreationDialog.scss';

export class TableCreationDialog extends React.Component {

    constructor(props) {
        super(props);

        this.onPrevious = this.onPrevious.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onFinished = this.onFinished.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onToggleDropdown = this.onToggleDropdown.bind(this);
        this.updateTableProperty = this.updateTableProperty.bind(this);
        this.selectIcon = this.selectIcon.bind(this);
    }

    onCancel() {
        this.props.hideTableCreationDialog();
    }
    onNext() {
        this.props.nextTableCreationPage();
    }
    onPrevious() {
        this.props.previousTableCreationPage();
    }
    onFinished() {

        const tableInfo = {
            name: this.props.tableCreation.tableInfo.name,
            description: this.props.tableCreation.tableInfo.description,
            tableIcon: this.props.tableCreation.tableInfo.tableIcon,
            tableNoun: this.props.tableCreation.tableInfo.tableNoun
        };

        this.props.createTable(this.props.appId , tableInfo).then(
            (response) => {
                this.props.hideTableCreationDialog();

                NotificationManager.success(Locale.getMessage("tableCreation.tableCreated"), Locale.getMessage('success'));

                setTimeout(() => {
                    const tblId = response.data;
                    WindowLocationUtils.update(UrlUtils.getAfterTableCreatedLink(this.props.appId, tblId));
                }, 2000);
            },
            (error) => {
                NotificationManager.error(Locale.getMessage('tableCreation.tableCreationFailed'), Locale.getMessage('failed'));
            });
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
        return <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={name}/>
    }

    getIcons() {

        return this.getIconNames().map((name) => this.getTableIcon(name));
    }

    onToggleDropdown(isOpen) {

        if (isOpen) {
            this.props.tableMenuOpened();
        } else {
            this.props.tableMenuClosed();
        }
    }

    selectIcon(icon) {

        this.updateTableProperty('tableIcon', icon)
    }

    getIconDropdown() {

        const dropdownTitle = this.getTableIcon(this.props.tableCreation.tableInfo.tableIcon);

        const iconNames = this.getIconNames();
        const icons = this.getIcons();

        return (
            <DropdownButton title={dropdownTitle}
                            id="createTableIconDropdown"
                            onToggle={this.onToggleDropdown}>
                {iconNames.map((iconName, i) => (<MenuItem key={i} onSelect={() => this.selectIcon(iconName)}>{icons[i]}</MenuItem>))}
            </DropdownButton>);
    }

    getSuggestedIcons() {

        const icons = this.getIcons();
        return (
            <div className="iconList">
                {icons.map((icon, i) => <button key={i}>{icon}</button>)}
            </div>);

    }

    updateTableProperty(property, value) {
        this.props.setTableProperty(property, value);
    }

    tableInfoPage() {

        return (
            <div className="tableInfo">

                <div className="description">Create a new table when you want to collect a new type of information.</div>
                <div className="title">Name your table</div>

                <div className="sections">
                    <div className="tableField">
                        <div className="tableFieldTitle">* Table Name</div>
                        <div className="tableFieldInput">
                            <input type="text"
                                   onChange={(e) => this.updateTableProperty('name', e.target.value)}
                                   value={this.props.tableCreation.tableInfo.name}/>
                        </div>
                    </div>

                    <div className="tableField">
                        <div className="tableFieldTitle">* A record in the table is called a</div>
                        <div className="tableFieldInput">
                            <input type="text"
                                   onChange={(e) => this.updateTableProperty('tableNoun', e.target.value)}
                                   value={this.props.tableCreation.tableInfo.tableNoun}/>
                        </div>
                    </div>

                    <div className="tableField iconSelection">
                        <div className="iconChooser">
                            <div className="tableFieldTitle">Icon</div>
                            {this.getIconDropdown()}
                        </div>
                        <div className="suggestedIcons">
                            <div className="tableFieldTitle">Suggested Icons</div>
                            {this.getSuggestedIcons()}
                        </div>
                    </div>

                    <div className="tableField">
                        <div className="tableFieldTitle">Description</div>
                        <div className="tableFieldInput">
                            <textarea type="text"
                                      rows="6"
                                      onChange={(e) => this.updateTableProperty('description', e.target.value)}
                                      value={this.props.tableCreation.tableInfo.description}/>
                        </div>
                    </div>

                </div>
            </div>);
    }

    /**
    chooseFieldsMethodPage() {

        return (
            <div className="tableInfo">
                <div className="description">Each bit of information you want to collect is a field.</div>
                <div className="title">Choose how to add fields to your table</div>

                <div className="addFieldsMethods">
                    <div className="addFieldsMethod">Drag fields onto a form</div>
                    <div className="addFieldsMethod">Drag column into a report</div>
                    <div className="addFieldsMethod">Create a list of fields</div>
                </div>

            </div>);
    }*/

    isValid() {
        if (this.props.tableCreation.tableInfo.name.trim() === '') {
            return false;
        }
        if (this.props.tableCreation.tableInfo.tableNoun.trim() === '') {
            return false;
        }

        return true;

    }

    render() {

        const classes = ['tableCreationDialog'];
        if (this.props.tableCreation.menuOpen) {
            classes.push('tableMenuOpen');
        }
        return (<MultiStepDialog show={this.props.tableCreation.dialogOpen}
                                 loading={this.props.tableCreation.savingTable}
                                 classes={classes.join(' ')}
                                 title="New Table"
                                 pageIndex={this.props.tableCreation.dialogPage}
                                 onCancel={this.onCancel}
                                 onPrevious={this.onPrevious}
                                 onNext={this.onNext}
                                 onFinished={this.onFinished}
                                 canProceed={this.isValid()}>
                {this.tableInfoPage()}
                {/*this.chooseFieldsMethodPage()*/}
            </MultiStepDialog>);
    }
}

const mapStateToProps = (state) => {
    return {
        tableCreation: state.tableCreation
    };
};

export default connect(
    mapStateToProps,
    TableCreationActions
)(TableCreationDialog);


