import React from 'react';
import * as SchemaConsts from "../../../constants/schema";
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import QBIcon from '../../qbIcon/qbIcon';
import {NotificationManager} from 'react-notifications';
import {I18nMessage} from '../../../utils/i18nMessage';
import QBToolTip from '../../qbToolTip/qbToolTip';

/**
 * editing tools for the currently edited row
 */
const RowEditActions = React.createClass({
    displayName: 'RowEditActions',

    propTypes: {
        api: React.PropTypes.object,
        flux: React.PropTypes.object,
    },


    onClickSave() {
        //get the current record id
        const id = this.props.data[this.props.params.context.uniqueIdentifier];
        this.props.params.context.onRecordSaveClicked(id);
        // commented code below deferred client side validation before save
        // till reactabular implemented
        /*
        // validate each cell
        Object.keys(this.props.params.context.cells[id.value]).forEach((cellId) => {
             //let currentValue = this.props.params.context.cells[id.value][cellId].refs.cellInput.getDOMNode().value;
            this.props.params.context.cells[id.value][cellId].onExitField();
        })
        ;*/
        this.props.api.deselectAll();
    },

    /**
     * delete icon is not included but may come back shortly
     */
    onClickDelete() {
        const id = this.props.data[this.props.params.context.uniqueIdentifier];
        this.props.api.deselectAll();

        this.props.flux.actions.deleteReportRecord(id);
        setTimeout(()=> {
            NotificationManager.info('Record deleted', 'Deleted', 1500);
        }, 1000);
    },
    onClickCancel() {
        //get the original unchanged values in data to rerender
        const id = this.props.data[this.props.params.context.uniqueIdentifier];

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
        const id = this.props.data[this.props.params.context.uniqueIdentifier];
        this.props.params.context.onRecordNewBlank(id);
        this.props.api.deselectAll();
    },

    render: function() {
        let errorMessage = "editErrors";
        // defer this disabling of save button til server validation story
        //let validRow = !this.props.params.context.rowEditErrors || this.props.params.context.rowEditErrors.ok;
        let validRow = true;

        return (
            <span className="editTools">

                 <OverlayTrigger  placement="bottom" overlay={<Tooltip id="cancelSelection">Cancel changes</Tooltip>}>
                     <Button onClick={this.onClickCancel}><QBIcon icon="close" className="cancelSelection"/></Button>
                 </OverlayTrigger>

                {validRow ?
                     <OverlayTrigger  placement="bottom" overlay={<Tooltip id="saveRecord">Save changes</Tooltip>}>
                        <Button onClick={this.onClickSave}><QBIcon icon="check" className="saveRecord"/></Button>
                    </OverlayTrigger> :

                    <QBToolTip  rootClose={true} location="bottom" tipId="invalidRecord" delayHide={300} i18nMessageKey={errorMessage} numErrors={this.props.params.context.rowEditErrors.errors.length}>
                        <Button><QBIcon icon="alert" className="invalidRecord"/></Button>
                    </QBToolTip>
                }

                <OverlayTrigger placement="bottom" overlay={<Tooltip id="addRecord" >Add new record</Tooltip>}>
                    <Button onClick={this.onClickAdd}><QBIcon icon="add" className="addRecord"/></Button>
                </OverlayTrigger>

            </span>);
    }
});

export default RowEditActions;
