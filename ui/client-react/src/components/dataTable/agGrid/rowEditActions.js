import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import QBIcon from '../../qbIcon/qbIcon';
import closeOnEscape from '../../hoc/catchEscapeKey';
import FieldUtils from '../../../utils/fieldUtils';
import QBToolTip from '../../qbToolTip/qbToolTip';
import Loader  from 'react-loader';
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";

import _ from 'lodash';

// wrap this component with catchEscapeKey HOC to allow cancelling inline edit by hitting Escape
const RowEditWrapper = React.createClass({
    propTypes: {
        onClose: React.PropTypes.func,
        onClickAdd: React.PropTypes.func,
        addRecordClasses: React.PropTypes.string,
    },

    render() {
        return (
            <div
                className="editTools">
                <QBToolTip tipId="cancelSelection" location="bottom" i18nMessageKey="pageActions.cancelSelection">
                    <Button className="rowEditActionsCancel" onClick={this.props.onClose}><QBIcon icon="close" className="cancelSelection"/></Button>
                </QBToolTip>

                {this.props.children}

                <QBToolTip tipId="addRecord" location="bottom" i18nMessageKey="pageActions.saveAndAddRecord">
                    <Button className="rowEditActionsSaveAndAdd" onClick={this.props.onClickAdd}><QBIcon icon="add" className={this.props.addRecordClasses}/></Button>
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

    /**
     * If a user hovers over the save button before clicking it, and there are validation errors, and the user continues to
     * hover over the new invalid icon, then two tooltips will appear.
     * We need to remove the stale saveTooltip manually, because the button changes and no longer throws a mouseOut event for the
     * old tooltip to to go away until the user clicks somewhere else on the screen.
     */
    removeStaleSaveTooltip() {
        let staleTooltips = document.querySelectorAll(".qbtooltip.saveRecord");
        if (staleTooltips && _.isArrayLike(staleTooltips)) {
            for (var i = 0; i < staleTooltips.length; i++) {
                staleTooltips[i].remove();
            }
        }
    },

    renderSaveRecordButton(validRow, saving) {
        this.removeStaleSaveTooltip();

        let errorMessage = "editErrors";

        let saveButton;
        if (validRow) {
            saveButton = (
                <QBToolTip  key={'savtt-' + this.props.idKey} tipId="saveRecord" location="bottom" i18nMessageKey="pageActions.saveRecord">
                    <Button key={'savb-' + this.props.idKey} className="rowEditActionsSave" onClick={this.onClickSave}>
                        <Loader loaded={!saving} options={SpinnerConfigurations.INLINE_SAVING}>
                            <QBIcon icon="check" className="saveRecord"/>
                        </Loader>
                    </Button>
                </QBToolTip>
            );
        } else {
            saveButton = (
                <QBToolTip location="bottom" tipId="invalidRecord" delayHide={200} i18nMessageKey={errorMessage} numErrors={this.props.params.context.rowEditErrors.errors.length}>
                    <Button onClick={this.onClickSave}>
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
                key={"crea-" + this.props.idKey}
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
