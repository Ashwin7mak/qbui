import React from 'react';
import TableCreationPanel from './tableCreationPanel';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import * as TableCreationActions from '../../actions/tableCreationActions';
import Locale from '../../locales/locales';
import WindowLocationUtils from '../../utils/windowLocationUtils';
import UrlUtils from '../../utils/urlUtils';
import _ from 'lodash';

import './tableCreationDialog.scss';

export class TableCreationDialog extends React.Component {

    constructor(props) {
        super(props);

        this.onPrevious = this.onPrevious.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onFinished = this.onFinished.bind(this);
        this.onCancel = this.onCancel.bind(this);
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
            name: this.props.tableCreation.tableInfo.name.value,
            description: this.props.tableCreation.tableInfo.description.value,
            tableIcon: this.props.tableCreation.tableInfo.tableIcon.value,
            tableNoun: this.props.tableCreation.tableInfo.tableNoun.value
        };

        this.props.createTable(this.props.app.id, tableInfo).then(
            (response) => {
                this.props.hideTableCreationDialog();

                NotificationManager.success(Locale.getMessage("tableCreation.tableCreated"), Locale.getMessage('success'));

                setTimeout(() => {
                    const tblId = response.data;
                    WindowLocationUtils.update(UrlUtils.getAfterTableCreatedLink(this.props.app.id, tblId));
                }, 2000);
            },
            (error) => {
                NotificationManager.error(Locale.getMessage('tableCreation.tableCreationFailed'), Locale.getMessage('failed'));
            });
    }

    isValid() {

        return this.props.tableCreation.edited && !_.findKey(this.props.tableCreation.tableInfo, (field) => field.validationError);
    }

    getExistingTableNames() {

        return this.props.app.tables.map((table) => table.name);
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

                <TableCreationPanel tableInfo={this.props.tableCreation.tableInfo}
                                    tableMenuOpened={this.props.tableMenuOpened}
                                    tableMenuClosed={this.props.tableMenuClosed}
                                    setTableProperty={this.props.setTableProperty}
                                    appTables={this.getExistingTableNames()} />

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


