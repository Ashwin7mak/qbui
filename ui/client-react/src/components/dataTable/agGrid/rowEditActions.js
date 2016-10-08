import React from 'react';
import * as SchemaConsts from "../../../constants/schema";
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import QBIcon from '../../qbIcon/qbIcon';
import {NotificationManager} from 'react-notifications';
import {I18nMessage} from '../../../utils/i18nMessage';
import FieldUtils from '../../../utils/fieldUtils';
import QBToolTip from '../../qbToolTip/qbToolTip';

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

        if (this.props.params.node) {
            //ag-grid
            this.props.params.api.refreshCells([this.props.params.node], Object.keys(this.props.params.node.data));
        }

        this.props.api.deselectAll();
        this.props.flux.actions.selectedRows([]);
        this.props.params.context.onEditRecordCancel(id);
    },

    onClickAdd() {
        //get the current record id
        const id = this.props.data[FieldUtils.getUniqueIdentifierFieldName(this.props.data)];
        this.props.params.context.onRecordNewBlank(id);
        this.props.api.deselectAll();
    },

    render() {
        let errorMessage = "editErrors";
        let validRow = true;
        if (this.props &&
            _.has(this.props, 'params') &&
            _.has(this.props.params, 'data') &&
            _.has(this.props.params, 'context.rowEditErrors.ok') &&
            !_.isUndefined(this.props.params.context.rowEditErrors.ok)) {
            validRow = this.props.params.context.rowEditErrors.ok;
        }
        let addRecordClass = 'addRecord';
        if (!validRow)
            addRecordClass += ' disabled';

        return (
            <span className="editTools">
                <QBToolTip tipId="cancelSelection" location="bottom" i18nMessageKey="pageActions.cancelSelection">
                    <Button onClick={this.onClickCancel}><QBIcon icon="close" className="cancelSelection"/></Button>
                </QBToolTip>

                {validRow ?
                    <QBToolTip tipId="saveRecord" location="bottom" i18nMessageKey="pageActions.saveRecord">
                        <Button onClick={this.onClickSave}><QBIcon icon="check" className="saveRecord"/></Button>
                    </QBToolTip> :

                    <QBToolTip  rootClose={true} location="bottom" tipId="invalidRecord" delayHide={300} i18nMessageKey={errorMessage} numErrors={this.props.params.context.rowEditErrors.errors.length}>
                        <Button><QBIcon icon="alert" className="invalidRecord"/></Button>
                    </QBToolTip>
                }
                <QBToolTip tipId="addRecord" location="bottom" i18nMessageKey="pageActions.saveAndAddRecord">
                  <Button onClick={validRow ? this.onClickAdd : null}><QBIcon icon="add" className={addRecordClass}/></Button>
                </QBToolTip>

            </span>);
    }
});

export default RowEditActions;
