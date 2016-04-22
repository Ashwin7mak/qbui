import React from 'react';
import {Button} from 'react-bootstrap';
import QBIcon from '../../qbIcon/qbIcon';
import {NotificationManager} from 'react-notifications';
const RowEditActions = React.createClass({

    contextTypes: {
        history: React.PropTypes.object
    },
    onClickSave() {
        this.props.api.deselectAll();

        setTimeout(()=> {
            NotificationManager.success('Record saved', 'Success', 1500);
        }, 1000);
    },
    onClickOpen() {

    },
    onClickDelete() {
        this.props.api.deselectAll();
        setTimeout(()=> {
            NotificationManager.success('Record deleted', 'Success', 1500);
        }, 1000);
    },
    onClickClose() {
        this.props.api.deselectAll();
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
                <Button onClick={this.onClickOpen}><QBIcon icon="eye" className="openRecord"/></Button>
                <Button onClick={this.onClickSave}><QBIcon icon="check" className="saveRecord"/></Button>
                <Button onClick={this.onClickClose}><QBIcon icon="close" className="cancelSelection"/></Button>
                <Button onClick={this.onClickDelete}><QBIcon icon="delete" className="deleteRecord"/></Button>
                <Button onClick={this.onClickAdd}><QBIcon icon="add" className="addRecord"/></Button>
            </span>);
    }
});


export default RowEditActions;
