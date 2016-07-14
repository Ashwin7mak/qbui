import React from 'react';
import * as SchemaConsts from "../../../constants/schema";
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import QBIcon from '../../qbIcon/qbIcon';
import {NotificationManager} from 'react-notifications';

/**
 * editing tools for the currently edited row
 */
const RowEditActions = React.createClass({

    propTypes: {
        api: React.PropTypes.object,
        flux: React.PropTypes.object,
    },


    onClickSave() {
        //get the current record id
        const id = this.props.data[this.props.params.context.keyField];
        //validate values
        let validationResult = this.props.params.context.validateRecord(this.props.params.data);
        if (validationResult.ok) {
            //signal record save action, will update an existing records with changed values
            // or add a new record
            if (id === SchemaConsts.UNSAVED_RECORD_ID) {
                this.props.params.context.onRecordAdd(this.props.params.data);
            } else {
                this.props.params.context.onRecordChange(id);
            }
            this.props.api.deselectAll();
        } else {
            //TBD show errors
        }

    },

    /**
     * delete icon is not included but may come back shortly
     */
    onClickDelete() {
        const id = this.props.data[this.props.params.context.keyField];
        this.props.api.deselectAll();

        this.props.flux.actions.deleteReportRecord(id);
        setTimeout(()=> {
            NotificationManager.info('Record deleted', 'Deleted', 1500);
        }, 1000);
    },
    onClickCancel() {
        //get the original unchanged values in data to rerender
        this.props.params.api.refreshCells([this.props.params.node], Object.keys(this.props.params.node.data));
        this.props.api.deselectAll();
        this.props.flux.actions.selectedRows([]);
        this.props.params.context.onEditRecordCancel();
    },

    onClickAdd() {
        //get the current record id
        const id = this.props.data[this.props.params.context.keyField];
        this.props.params.context.onRecordNewBlank(id);
        this.props.api.deselectAll();
    },

    render: function() {
        return (
            <span className="editTools">

                 <OverlayTrigger  placement="bottom" overlay={<Tooltip id="cancelSelection">Cancel changes</Tooltip>}>
                     <Button onClick={this.onClickCancel}><QBIcon icon="close" className="cancelSelection"/></Button>
                 </OverlayTrigger>

                <OverlayTrigger  placement="bottom" overlay={<Tooltip id="saveRecord">Save changes</Tooltip>}>
                    <Button onClick={this.onClickSave}><QBIcon icon="check" className="saveRecord"/></Button>
                </OverlayTrigger>

                <OverlayTrigger placement="bottom" overlay={<Tooltip id="addRecord" >Add new record</Tooltip>}>
                    <Button onClick={this.onClickAdd}><QBIcon icon="add" className="addRecord"/></Button>
                </OverlayTrigger>

            </span>);
    }
});

export default RowEditActions;
