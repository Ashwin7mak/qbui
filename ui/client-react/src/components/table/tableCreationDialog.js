import React from 'react';
import {PropTypes} from 'react';
import TableCreationPanel from './tableCreationPanel';
import TableCreationSummaryPanel from './tableCreationSummaryPanel';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {I18nMessage} from "../../utils/i18nMessage";
import * as TableCreationActions from '../../actions/tableCreationActions';
import Locale from '../../locales/locales';
import UrlUtils from '../../utils/urlUtils';
import _ from 'lodash';
import AppHistory from '../../globals/appHistory';

import './tableCreationDialog.scss';

export class TableCreationDialog extends React.Component {

    constructor(props) {
        super(props);

        // bind to fix context for event handlers
        this.onPrevious = this.onPrevious.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onFinished = this.onFinished.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    /**
     * navigate to next page
     */
    onNext() {
        this.props.nextTableCreationPage();
    }

    /**
     * navigate to previous page
     */
    onPrevious() {
        this.props.previousTableCreationPage();
    }


    /**
     * cancel
     */
    onCancel() {
        this.props.hideTableCreationDialog();
    }

    /**
     * last page has finished
     */
    onFinished() {

        const tableInfo = {
            name: this.props.tableInfo.name.value,
            description: this.props.tableInfo.description.value,
            tableIcon: this.props.tableInfo.tableIcon.value,
            tableNoun: this.props.tableInfo.tableNoun.value
        };

        // create the table
        this.props.createTable(this.props.app.id, tableInfo).then(
            (response) => {
                this.props.hideTableCreationDialog();

                // indicate that a table created notification will be needed
                this.props.notifyTableCreated(true);

                const tblId = response.data;

                this.props.onTableCreated(tblId);

                // navigate to form builder (no page reload)

                AppHistory.history.push(UrlUtils.getAfterTableCreatedLink(this.props.app.id, tblId));
            },
            (error) => {
                // leave the dialog open but issue a growl indicating an error
                NotificationManager.error(Locale.getMessage('tableCreation.tableCreationFailed'), Locale.getMessage('failed'));
            });
    }

    /**
     * check for any validation errors in tableInfo
     * @returns {boolean}
     */
    isValid() {

        // form is invalid if any tableInfo properties have a validationError value

        return !_.findKey(this.props.tableInfo, (field) => field.validationError);
    }

    /**
     * get table names for app
     */
    getExistingTableNames() {

        return this.props.app.tables.map((table) => table.name);
    }

    /**
     * render the multi-step modal dialog for creating a table
     * @returns {XML}
     */
    render() {

        const classes = ['tableCreationDialog'];

        // if a dropdown is open, add a class so we can temporarily display overflows
        // (normally we want to hide overflows since the page transitions required overflow hidden)
        if (this.props.tableCreation.menuOpen) {
            classes.push('tableMenuOpen');
        }

        return (<MultiStepDialog show={this.props.tableCreation.dialogOpen}
                                 isLoading={this.props.tableCreation.savingTable}
                                 classes={classes.join(' ')}
                                 pageIndex={this.props.tableCreation.pageIndex}
                                 onCancel={this.onCancel}
                                 onPrevious={this.onPrevious}
                                 onNext={this.onNext}
                                 onFinished={this.onFinished}
                                 finishedButtonLabel={Locale.getMessage("tableCreation.finishedButtonLabel")}
                                 canProceed={this.isValid()}
                                 titles={[Locale.getMessage("tableCreation.newTablePageTitle"), Locale.getMessage("tableCreation.addFieldsTitle")]}>
                <div className="tableCreationPanel">
                    <div className="description"><I18nMessage message="tableCreation.newTableDescription"/></div>
                    <div className="title"><I18nMessage message="tableCreation.newTableTitle"/></div>
                    <TableCreationPanel tableInfo={this.props.tableInfo}
                                        tableMenuOpened={this.props.tableMenuOpened}
                                        tableMenuClosed={this.props.tableMenuClosed}
                                        setTableProperty={this.props.setTableProperty}
                                        setEditingProperty={this.props.setEditingProperty}
                                        focusOn={this.props.tableCreation.editing}
                                        validate={this.props.tableCreation.edited}
                                        appTables={this.getExistingTableNames()} />
                </div>
                <TableCreationSummaryPanel />

            </MultiStepDialog>);
    }
}

TableCreationDialog.propTypes = {
    app: PropTypes.object.isRequired,
    tableCreation: PropTypes.object.isRequired,
    tableInfo: PropTypes.object.isRequired,
    setEditingProperty: PropTypes.func.isRequired,
    nextTableCreationPage: PropTypes.func.isRequired,
    previousTableCreationPage: PropTypes.func.isRequired,
    hideTableCreationDialog: PropTypes.func.isRequired,
    createTable: PropTypes.func.isRequired,
    onTableCreated: PropTypes.func.isRequired,
    notifyTableCreated: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        tableCreation: state.tableCreation,
        tableInfo: state.tableCreation.tableInfo // pass the nested info as a prop to be nice
    };
};

export default connect(
    mapStateToProps,
    TableCreationActions
)(TableCreationDialog);


