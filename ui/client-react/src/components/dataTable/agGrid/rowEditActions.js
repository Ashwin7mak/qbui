import React from 'react';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import QBIcon from '../../qbIcon/qbIcon';
import {NotificationManager} from 'react-notifications';

const RowEditActions = React.createClass({

    onClickSave() {
        this.props.api.deselectAll();

        const id = this.props.data["Record ID#"];

        setTimeout(()=> {
            NotificationManager.success('Record saved', 'Success', 1500);
        }, 1000);
    },
    onClickOpen() {
        this.props.onOpen(this.props.data);
    },
    onClickDelete() {
        const id = this.props.data["Record ID#"];
        this.props.api.deselectAll();

        this.props.flux.actions.deleteReportRecord(id);
        setTimeout(()=> {
            NotificationManager.info('Record deleted', 'Deleted', 1500);
        }, 1000);
    },
    onClickCancel() {
        this.props.api.deselectAll();
        this.props.flux.actions.selectedRows([]);
    },
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
                <OverlayTrigger  placement="bottom" overlay={<Tooltip id="saveRecord">Save changes</Tooltip>}>
                    <Button onClick={this.onClickSave}><QBIcon icon="check" className="saveRecord"/></Button>
                </OverlayTrigger>

                <OverlayTrigger  placement="bottom" overlay={<Tooltip id="cancelSelection">Cancel changes</Tooltip>}>
                    <Button onClick={this.onClickCancel}><QBIcon icon="close" className="cancelSelection"/></Button>
                </OverlayTrigger>

                <OverlayTrigger placement="bottom" overlay={<Tooltip id="addRecord" >Add new record</Tooltip>}>
                    <Button onClick={this.onClickAdd}><QBIcon icon="add" className="addRecord"/></Button>
                </OverlayTrigger>
            </span>);
    }
});


export default RowEditActions;
