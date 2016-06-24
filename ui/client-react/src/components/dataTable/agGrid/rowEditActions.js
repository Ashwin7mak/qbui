import React from 'react';
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

    updatePropsData() {
        // get the changes from flux into the agrid data vals
        // and refresh as an optimisic update
        // on save fail will need to reinstate pending changes..
        let chg = this.props.params.context.getPendingChanges();
        let prp = this.props;
        Object.keys(chg).forEach(function(key) {
            let ch = chg[key];
            Object.keys(prp.data).forEach(function(dat) {
                if (prp.data[dat].id === ch.oldVal.id) {
                    prp.data[dat].display = ch.newVal.display;
                    prp.data[dat].value = ch.newVal.value;
                }
            });
        });
    },

    onClickSave() {
        this.updatePropsData();
        this.props.api.deselectAll();
        const id = this.props.data[this.props.params.context.keyField];
        this.props.params.context.onRecordChange(id);
        //refresh the view
        this.props.params.api.refreshCells([this.props.params.node], Object.keys(this.props.params.node.data));
    },

    /**
     * delete icon is not included but may come back shortly
     */
    onClickDelete() {
        const id = this.props.data["Record ID#"];
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

    /**
     * EMPOWER - add a new empty record to the store
     */
    onClickAdd() {
        this.props.api.deselectAll();
        this.props.flux.actions.addReportRecord();

        setTimeout(()=> {
            NotificationManager.success('Record created', 'Success', 1500);
        }, 1000);
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
