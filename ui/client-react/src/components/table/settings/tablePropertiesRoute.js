import React from 'react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import Locale from '../../../locales/locales';
import Stage from '../../stage/stage';
import IconActions from '../../../../../reuse/client/src/components/iconActions/iconActions';
import {I18nMessage} from '../../../utils/i18nMessage';
import Icon from '../../../../../reuse/client/src/components/icon/icon.js';
import TableCreationPanel from '../tableCreationPanel';
import {updateTable, loadTableProperties, setTableProperty, openIconChooser, closeIconChooser, setEditingProperty, resetEditedTableProperties} from '../../../actions/tablePropertiesActions';

import './tableProperties.scss';


export const TablePropertiesRoute = React.createClass({

    getExistingTableNames() {
        if (this.props.app && this.props.app.tables) {
            return this.props.app.tables.map((table) => table.name);
        }
        return [];
    },
    getPageActions(maxButtonsBeforeMenu) {
        const actions = [
            {i18nMessageKey: 'pageActions.deleteTable', icon:'delete', className:'deleteTable'}
        ];
        return (<IconActions className="pageActions" actions={actions} maxButtonsBeforeMenu={maxButtonsBeforeMenu}/>);
    },
    getStageHeadline() {
        return <div className="tableSettingsStage stageHeadLine">{this.props.table ? <Icon isTableIcon={true} icon={this.props.table.icon} /> : null}<I18nMessage message={"settings.tableSettings"}/></div>;
    },
    componentDidMount() {
        if (this.props.app && this.props.table) {
            this.props.loadTableProperties(this.props.table);
        }
    },
    componentWillReceiveProps(nextProps) {
        if ((nextProps.table && this.props.table && this.props.table.id !== nextProps.table.id) || (!this.props.table && nextProps.table)) {
            nextProps.loadTableProperties(nextProps.table);
        }
    },
    updateTableProperties() {
        this.props.updateTable(this.props.app.id, this.props.table.id, this.props.tableProperties.tableInfo).then(
            (response) => {
                NotificationManager.success(Locale.getMessage('tableEdit.tableUpdated'), Locale.getMessage('success'));
                let updatedTableInfo = this.props.tableProperties.tableInfo;
                let tableInfoObj = {};
                Object.keys(updatedTableInfo).forEach(function(key, index) {
                    tableInfoObj[key] = updatedTableInfo[key].value;
                });

                this.props.flux.actions.updateTableProps(this.props.table.id, tableInfoObj);
            },
            (error) => {
                NotificationManager.error(Locale.getMessage('tableEdit.tableUpdateFailed'), Locale.getMessage('failed'));
            });
    },

    resetTableProperties() {
        this.props.resetEditedTableProperties();
    },

    render() {
        let showButtons = this.props.tableProperties.isDirty ? true : false;
        let buttonsClasses =  "tableInfoButtons " + (showButtons ? "open" : "closed");
        return (<div>
            <Stage stageHeadline={this.getStageHeadline()} pageActions={this.getPageActions(5)}></Stage>

            <div className="tableInfoPanel">
                <TableCreationPanel tableInfo={this.props.tableProperties.tableInfo}
                                    iconChooserOpen={this.props.tableProperties.iconChooserOpen}
                                    openIconChooser={this.props.openIconChooser}
                                    setTableProperty={this.props.setTableProperty}
                                    closeIconChooser={this.props.closeIconChooser}
                                    setEditingProperty={this.props.setEditingProperty}
                                    focusOn={this.props.tableProperties.editing}
                                    validate={this.props.tableProperties.edited}
                                    appTables={this.getExistingTableNames()}
                                     />
                <div className={buttonsClasses}>
                    <a className="secondaryButton" onClick={this.resetTableProperties}><I18nMessage message={"nav.reset"}/></a>
                    <Button className="primaryButton" bsStyle="primary" onClick={this.updateTableProperties}><I18nMessage message={"nav.apply"}/></Button>
                </div>
            </div>
        </div>);
    }

});

const mapStateToProps = (state) => {
    return {
        tableProperties: state.tableProperties
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateTable: (appId, tableId, tableInfo) => {
            return dispatch(updateTable(appId, tableId, tableInfo));
        },
        loadTableProperties: (tableInfo) => {
            dispatch(loadTableProperties(tableInfo));
        },
        setTableProperty: (property, value, validationError, isUserEdit) => {
            dispatch(setTableProperty(property, value, validationError, isUserEdit));
        },
        openIconChooser: () => {
            dispatch(openIconChooser());
        },
        closeIconChooser: () => {
            dispatch(closeIconChooser());
        },
        setEditingProperty: (editing) => {
            dispatch(setEditingProperty(editing));
        },
        resetEditedTableProperties: () => {
            dispatch(resetEditedTableProperties());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TablePropertiesRoute);
