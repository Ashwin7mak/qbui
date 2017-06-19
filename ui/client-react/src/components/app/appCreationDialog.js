import React from 'react';
import {PropTypes} from 'react';
import AppCreationTable from './appCreationPanel';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import {I18nMessage} from "../../utils/i18nMessage";
import * as TableCreationActions from '../../actions/tableCreationActions';
import {updateFormRedirectRoute} from '../../actions/formActions';
import Locale from '../../locales/locales';
import UrlUtils from '../../utils/urlUtils';
import _ from 'lodash';
import AppHistory from '../../globals/appHistory';

import '../table/tableCreationDialog.scss';

export class AppCreationDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * cancel
     */
    onCancel = () => {
        this.props.hideTableCreationDialog();
    }

    /**
     * last page has finished
     */
    onFinished = () => {

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

                this.props.updateFormRedirectRoute(null);
                AppHistory.history.push(UrlUtils.getAfterTableCreatedLink(this.props.app.id, tblId));
            },
            (error) => {
                // leave the dialog open but issue a growl indicating an error
                NotificationManager.error(Locale.getMessage('tableCreation.tableCreationFailed'), Locale.getMessage('failed'));
            });

    };

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
    getExistingTableNames = () => {
        let appTablesNames = [];
        if (_.has(this.props.app, 'tables')) {
            appTablesNames = this.props.app.tables.map((table) => table.name);
        }
        return appTablesNames;
    };

    /**
     * render the multi-step modal dialog for creating a table
     * @returns {XML}
     */
    render() {

        const classes = ['tableCreationDialog'];

        //TODO: fix iconChooserOpen action
        // if icon chooser is open, add class to allow it to overflow the bottom buttons (while open)
        // if (this.props.tableCreation.iconChooserOpen) {
        //     classes.push('allowOverflow');
        // }

        return (<MultiStepDialog show={this.props.appDialogOpen}
                                 classes={classes.join(' ')}
                                 onCancel={this.onCancel}
                                 onFinished={this.onFinished}
                                 finishedButtonLabel={Locale.getMessage("appCreation.finishedButtonLabel")}
                                 canProceed={this.isValid()}
                                 titles={[Locale.getMessage("appCreation.newAppPageTitle")]}>
            <div className="tableCreationPanel">
                <div className="title"><I18nMessage message="appCreation.newAppTitle"/></div>
                <AppCreationTable tableInfo={this.props.tableInfo}
                                    openIconChooser={this.props.openIconChooser}
                                    closeIconChooser={this.props.closeIconChooser}
                                    setTableProperty={this.props.setTableProperty}
                                    setEditingProperty={this.props.setEditingProperty}
                                    appTables={this.getExistingTableNames()} />
            </div>
        </MultiStepDialog>);
    }
}

AppCreationDialog.propTypes = {
    app: PropTypes.object.isRequired,
    tableCreation: PropTypes.object.isRequired,
    tableInfo: PropTypes.object.isRequired,
    setEditingProperty: PropTypes.func.isRequired,
    hideTableCreationDialog: PropTypes.func.isRequired,
    createTable: PropTypes.func.isRequired,
    onTableCreated: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    console.log('appCreationDialog: ', state);
    return {
        appDialogOpen: _.get(state.appBuilder, 'dialogOpen'),
        // tableInfo: state.tableCreation.tableInfo // pass the nested info as a prop to be nice
    };
};

export default connect(
    mapStateToProps,
    {...TableCreationActions, updateFormRedirectRoute}
)(AppCreationDialog);
