import React from 'react';
import * as SchemaConsts from "../../../constants/schema";
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import QBIcon from '../../qbIcon/qbIcon';
import {NotificationManager} from 'react-notifications';
import closeOnEscape from '../../hoc/catchEscapeKey';
import {I18nMessage} from '../../../utils/i18nMessage';
import FieldUtils from '../../../utils/fieldUtils';
import QBToolTip from '../../qbToolTip/qbToolTip';
import Loader  from 'react-loader';
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";

import _ from 'lodash';

/**
 * editing tools for the currently edited row
 */
const RowEditActions = React.createClass({
    displayName: 'RowEditActions',

    propTypes: {
        api: React.PropTypes.object,
        flux: React.PropTypes.object,
        rowEditErrors: React.PropTypes.object
    },

    onClickSave() {
        //get the current record id
        const id = this.props.data[FieldUtils.getUniqueIdentifierFieldName(this.props.data)];
        this.props.params.context.onRecordSaveClicked(id);
        this.props.api.deselectAll();
    },

    /**
     * delete icon is not included but may come back shortly
     */
    onClickDelete() {
        const id = this.props.data[FieldUtils.getUniqueIdentifierFieldName(this.props.data)];
        this.props.api.deselectAll();

        this.props.flux.actions.deleteRecord(id);
        setTimeout(()=> {
            NotificationManager.info('Record deleted', 'Deleted', 1500);
        }, 1000);
    },
    onClickCancel() {
        //get the original unchanged values in data to rerender
        const id = this.props.data[FieldUtils.getUniqueIdentifierFieldName(this.props.data)];

        const {context} = this.props.params;
        // Escape keydoan handler can fire this onClickCancel, we should cancel only if this is the
        // row currently being edited
        if (context.isInlineEditOpen && context.currentEditRid === id.value) {
            if (this.props.params.node) {
                //ag-grid
                this.props.params.api.refreshCells([this.props.params.node], Object.keys(this.props.params.node.data));
            }

            this.props.api.deselectAll();
            this.props.flux.actions.selectedRows([]);
            this.props.params.context.onEditRecordCancel(id);
        }
    },

    onClickAdd() {
        //get the current record id
        const id = this.props.data[FieldUtils.getUniqueIdentifierFieldName(this.props.data)];
        this.props.params.context.onRecordNewBlank(id);
        this.props.api.deselectAll();
    },

    renderSaveRecordButton(validRow, saving) {
        let errorMessage = "editErrors";

        let saveButton;
        if (validRow) {
            saveButton = (
                <QBToolTip tipId="saveRecord" location="bottom" i18nMessageKey="pageActions.saveRecord">
                    <Button onClick={this.onClickSave}>
                        <Loader loaded={!saving} options={SpinnerConfigurations.RECORD_COUNT}>
                            <QBIcon icon="check" className="saveRecord"/>
                        </Loader>
                    </Button>
                </QBToolTip>
            );
        } else {
            saveButton = (
                <QBToolTip location="bottom" tipId="invalidRecord" delayHide={300} i18nMessageKey={errorMessage} numErrors={this.props.params.context.rowEditErrors.errors.length}>
                    <Button>
                        <Loader loaded={!saving} options={SpinnerConfigurations.RECORD_COUNT}>
                            <QBIcon icon="alert" onClick={this.onClickSave} className="invalidRecord"/>
                        </Loader>
                    </Button>
                </QBToolTip>
            );
        }

        return saveButton;
    },

    render() {
        let validRow = true;
        if (this.props &&
            _.has(this.props, 'params') &&
            _.has(this.props.params, 'data') &&
            _.has(this.props.params, 'context.rowEditErrors.ok') &&
            !_.isUndefined(this.props.params.context.rowEditErrors.ok)) {
            validRow = this.props.params.context.rowEditErrors.ok;
        }


        // Get the saving state from the flux store here so that the entire AG Grid does not need to reload
        let saving = false;
        if (this.props.flux && this.props.flux.store) {
            let recordPendingEdits = this.props.flux.store('RecordPendingEditsStore').getState();
            if (recordPendingEdits) {
                saving = recordPendingEdits.saving;
            }
        }

        let addRecordClass = 'addRecord';
        if (!validRow || saving) {
            addRecordClass += ' disabled';
        }

        // wrap this component, also gets wrapped by the catchEscapeKey HOC to allow cancelling
        // inline edit by hitting Escape
        const RowEditWrapper = React.createClass({
            render() {
                return <div
                    {...this.props}>
                </div>;
            }
        });
        const ClosableRowEditActions = closeOnEscape(RowEditWrapper);

        return (
            <ClosableRowEditActions
                className="editTools" onClose={this.onClickCancel}>
                <QBToolTip tipId="cancelSelection" location="bottom" i18nMessageKey="pageActions.cancelSelection">
                    <Button onClick={this.onClickCancel}><QBIcon icon="close" className="cancelSelection"/></Button>
                </QBToolTip>

                {this.renderSaveRecordButton(validRow, saving)}

                <QBToolTip tipId="addRecord" location="bottom" i18nMessageKey="pageActions.saveAndAddRecord">
                    <Button onClick={validRow ? this.onClickAdd : null}><QBIcon icon="add" className={addRecordClass}/></Button>
                </QBToolTip>
            </ClosableRowEditActions>
        );
    }
});

export default RowEditActions;
