import React from 'react';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {connect} from 'react-redux';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import QbTableIcon from '../qbTableIcon/qbTableIcon';
import {NotificationManager} from 'react-notifications';
import * as TableCreationActions from '../../actions/tableCreationActions';
import * as CompConsts from '../../constants/componentConstants';
import Locale from '../../locales/locales';
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

        this.props.createTable('appid', {}).then(
            (response) => {
                NotificationManager.success(Locale.getMessage("tableCreation.tableCreated"), Locale.getMessage('success'),
                    CompConsts.NOTIFICATION_MESSAGE_DISMISS_TIME);
                this.props.hideTableCreationDialog();
            },
            (error) => {
                NotificationManager.error(Locale.getMessage('tableCreation.tableCreationFailed'), Locale.getMessage('failed'),
                    CompConsts.NOTIFICATION_MESSAGE_FAIL_DISMISS_TIME);
            });
    }

    getIcons() {
        const iconSuffixes = [
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

        return iconSuffixes.map((suffix) => (<QbTableIcon icon={"icon-TableIcons_sturdy_" + suffix} />));
    }

    onToggleDropdown(isOpen) {

        if (isOpen) {
            this.props.tableMenuOpened();
        } else {
            this.props.tableMenuClosed();
        }
    }

    getIconDropdown() {

        const icons = this.getIcons();
        return (
            <DropdownButton title={icons[0]} id="createTableIconDropdown" onToggle={this.onToggleDropdown}>
                {icons.map((icon, i) => (<MenuItem key={i}>{icon}</MenuItem>))}
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
                        <div className="tableFieldInput"><input type="text" onChange={(e) => this.updateTableProperty('name', e.target.value)} value={this.props.tableCreation.tableInfo.name}/></div>
                    </div>

                    <div className="tableField">
                        <div className="tableFieldTitle">* A record in the table is called a</div>
                        <div className="tableFieldInput"><input type="text" /></div>
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
                        <div className="tableFieldInput"><textarea type="text" rows="6"/></div>
                    </div>

                </div>
            </div>);
    }

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
    }

    isValid() {
        if (this.props.tableCreation.tableInfo.name.trim() === '') {
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


