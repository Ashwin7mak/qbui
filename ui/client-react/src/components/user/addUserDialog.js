import React from 'react';
import {PropTypes} from 'react';
//import TableCreationPanel from './tableCreationPanel';
//import TableCreationSummaryPanel from './tableCreationSummaryPanel';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {I18nMessage} from "../../utils/i18nMessage";
import * as addUserActions from '../../actions/addUserActions';
import AddUserPanel from './addUserPanel';
import Locale from '../../locales/locales';
import UrlUtils from '../../utils/urlUtils';
import _ from 'lodash';
import AppHistory from '../../globals/appHistory';
import './addUserDialog.scss';

export class AddUserDialog extends React.Component {

    constructor(props) {
        super(props);

        // bind to fix context for event handlers

        this.onFinished = this.onFinished.bind(this);
        this.onCancel = this.onCancel.bind(this);
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

        // form can be saved if the state if the fields is valid, regardless of what previous validation error is being shown

        // return this.props.tableCreation.edited && !_.findKey(this.props.tableInfo, (field) => field.pendingValidationError);
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

        const classes = ['addUserDialog'];
        //
        // // if icon chooser is open, add class to allow it to overflow the bottom buttons (while open)
        // if (this.props.tableCreation.iconChooserOpen) {
        //     classes.push('allowOverflow');
        // }

        return (<MultiStepDialog show={this.props.addUser.dialogOpen}
                                 isLoading={this.props.addUser.savingUser}
                                 classes={classes.join(' ')}
                                 onCancel={this.onCancel}
                                 onFinished={this.onFinished}
                                 canProceed={this.isValid()}
                                 finishedButtonLabel="Add"
        >
            <div className="addUserPanel">
                <div className="title">test</div>
                <div className="description"><I18nMessage message="tableCreation.newTableDescription"/></div>
                <AddUserPanel allUsers={this.props.allUsers} searchUsers={this.props.searchUsers} />
            </div>
        </MultiStepDialog>);
    }
}

AddUserDialog.propTypes = {
    // app: PropTypes.object.isRequired,
    // tableCreation: PropTypes.object.isRequired,
    // tableInfo: PropTypes.object.isRequired,
    // setEditingProperty: PropTypes.func.isRequired,
    // hideTableCreationDialog: PropTypes.func.isRequired,
    // createTable: PropTypes.func.isRequired,
    // onTableCreated: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        addUser: state.addUser,
        // tableInfo: state.tableCreation.tableInfo // pass the nested info as a prop to be nice
    };
};

export default connect(
    mapStateToProps,
    addUserActions
)(AddUserDialog);
