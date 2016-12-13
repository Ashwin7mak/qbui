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
import * as CompConsts from "../../../constants/componentConstants";

import _ from 'lodash';

// wrap this component with catchEscapeKey HOC to allow cancelling inline edit by hitting Escape
const RowEditWrapper = React.createClass({
    propTypes: {
        onClose: React.PropTypes.func,
        onClickAdd: React.PropTypes.func,
        addRecordClasses: React.PropTypes.string,
    },

    render() {
        /**
         * Note: On all the buttons in this component, we use onMouseDown instead of onClick. This is to prevent validations
         * events that occur onBlur from conflicting with clicks on these buttons. onMouseDown fires before onBlur.
         * When using onClick, the user might enter an invalid value in a field, then try to click save, but the click is not registered
         * because the onBlur takes priority.
         */
        return (
            <div
                className="editTools">
                <QBToolTip tipId="cancelSelection" location="bottom" i18nMessageKey="pageActions.cancelSelection">
                    <Button className="rowEditActionsCancel" onMouseDown={this.props.onClose}><QBIcon icon="close" className="cancelSelection"/></Button>
                </QBToolTip>

                {this.props.children}

                <QBToolTip tipId="addRecord" location="bottom" i18nMessageKey="pageActions.saveAndAddRecord">
                    <Button className="rowEditActionsSaveAndAdd" onMouseDown={this.props.onClickAdd}><QBIcon icon="add" className={this.props.addRecordClasses}/></Button>
                </QBToolTip>
            </div>
        );
    }
});
const ClosableRowEditActions = closeOnEscape(RowEditWrapper);

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
        const id = this.props.data[FieldUtils.getPrimaryKeyFieldName(this.props.data)];
        this.props.params.context.onRecordSaveClicked(id);
        this.props.api.deselectAll();
    },

    onClickCancel() {
        //get the original unchanged values in data to rerender
        const id = this.props.data[FieldUtils.getPrimaryKeyFieldName(this.props.data)];

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
        const id = this.props.data[FieldUtils.getPrimaryKeyFieldName(this.props.data)];

        this.props.params.context.onRecordNewBlank(id);
        this.props.api.deselectAll();
    },

    renderSaveRecordButton(validRow, saving) {
        let errorMessage = "editErrors";

        let saveButton;
        if (validRow) {
            saveButton = (
                <QBToolTip tipId="saveRecord" location="bottom" i18nMessageKey="pageActions.saveRecord">
                    <Button className="rowEditActionsSave" onMouseDown={this.onClickSave}>
                        <Loader loaded={!saving} options={SpinnerConfigurations.INLINE_SAVING}>
                            <QBIcon icon="check" className="saveRecord"/>
                        </Loader>
                    </Button>
                </QBToolTip>
            );
        } else {
            saveButton = (
                <QBToolTip location="bottom" tipId="invalidRecord" delayHide={300} i18nMessageKey={errorMessage} numErrors={this.props.params.context.rowEditErrors.errors.length}>
                    <Button onMouseDown={this.onClickSave}>
                        <Loader loaded={!saving} options={SpinnerConfigurations.INLINE_SAVING}>
                            <QBIcon icon="alert" className="invalidRecord"/>
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


        // Get the saving state from the context
        let saving = _.has(this.props, 'params.context.saving') ?
            this.props.params.context.saving : false;

        let addRecordClasses = ['addRecord'];
        if (!validRow || saving) {
            addRecordClasses.push('disabled');
        }

        return (
            <ClosableRowEditActions
                onClose={this.onClickCancel}
                onClickAdd={validRow ? this.onClickAdd : null}
                addRecordClasses={addRecordClasses.join(' ')}
                {...this.props} >
                {this.renderSaveRecordButton(validRow, saving)}
            </ClosableRowEditActions>
        );
    }
});

export default RowEditActions;
