import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import QBIcon from '../../qbIcon/qbIcon';
import QBToolTip from '../../qbToolTip/qbToolTip';
import Loader  from 'react-loader';
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";
import closeOnEscape from '../../hoc/catchEscapeKey';
import positionRowEditActions from './rowEditActionsPositionHoc';

// wrap this component with catchEscapeKey HOC to allow cancelling inline edit by hitting Escape
const RowEditActions = React.createClass({
    displayName: 'RowEditActions',

    propTypes: {
        idKey: PropTypes.string,
        onClickAdd: PropTypes.func,
        onClickSave: PropTypes.func,
        onClickCancel: PropTypes.func,
        rowEditErrors: PropTypes.object,
        recordId: PropTypes.number,
        isSaving: PropTypes.bool,
        isValid: PropTypes.bool
    },

    onClickSave() {
        if (this.props.onClickSave) {
            this.props.onClickSave(this.props.recordId);
        }
    },

    onClickCancel() {
        if (this.props.onClickCancel) {
            this.props.onClickCancel(this.props.recordId);
        }
    },

    onClickAdd() {
        // Don't allow a user to move on and add another row if the record is currently invalid
        if (this.props.onClickAdd && this.props.isValid) {
            this.props.onClickAdd(this.props.recordId);
        }
    },

    /**
     * If a user hovers over the save button before clicking it, and there are validation errors, and the user continues to
     * hover over the new invalid icon, then two tooltips will appear.
     * We need to remove the stale saveTooltip manually, because the button changes and no longer throws a mouseOut event for the
     * old tooltip to to go away until the user clicks somewhere else on the screen.
     */
    removeStaleSaveTooltip() {
        let staleTooltips = document.querySelectorAll(".qbtooltip");
        if (staleTooltips && _.isArrayLike(staleTooltips)) {
            for (var i = 0; i < staleTooltips.length; i++) {
                staleTooltips[i].remove();
            }
        }
    },

    renderSaveRecordButton() {
        this.removeStaleSaveTooltip();

        let {idKey, isSaving, rowEditErrors} = this.props;

        let errorMessage = "editErrors";

        let numberOfErrors = 0;
        if (rowEditErrors && Array.isArray(rowEditErrors)) {
            numberOfErrors = rowEditErrors.length;
        }

        let saveButton;
        if (this.props.isValid) {
            saveButton = (
                <QBToolTip  key={'savtt-' + idKey} tipId="saveRecord" location="bottom" i18nMessageKey="pageActions.saveRecord">
                    <Button key={'savb-' + idKey} className="rowEditActionsSave" onClick={this.onClickSave}>
                        <Loader loaded={!isSaving} options={SpinnerConfigurations.INLINE_SAVING}>
                            <QBIcon icon="check" className="saveRecord"/>
                        </Loader>
                    </Button>
                </QBToolTip>
            );
        } else {
            saveButton = (
                <QBToolTip location="bottom" tipId="invalidRecord" delayHide={200} i18nMessageKey={errorMessage} numErrors={numberOfErrors}>
                    <Button onClick={this.onClickSave}>
                        <Loader loaded={!isSaving} options={SpinnerConfigurations.INLINE_SAVING}>
                            <QBIcon icon="alert" className="invalidRecord"/>
                        </Loader>
                    </Button>
                </QBToolTip>
            );
        }

        return saveButton;
    },

    render() {
        let {isValid, saving, idKey} = this.props;

        let addRecordClasses = ['addRecord'];
        if (!isValid || saving) {
            addRecordClasses.push('disabled');
        }

        return (
            <div className="editTools" key={"crea-" + idKey}>
                <QBToolTip tipId="cancelSelection" location="bottom" i18nMessageKey="pageActions.cancelSelection">
                    <Button className="rowEditActionsCancel" onClick={this.onClickCancel}><QBIcon icon="close" className="cancelSelection"/></Button>
                </QBToolTip>

                {this.renderSaveRecordButton()}

                <QBToolTip tipId="addRecord" location="bottom" i18nMessageKey="pageActions.saveAndAddRecord">
                    <Button className="rowEditActionsSaveAndAdd" onClick={this.onClickAdd}><QBIcon icon="add" className={addRecordClasses.join(' ')}/></Button>
                </QBToolTip>
            </div>
        );
    }
});

const ClosableRowEditActions = closeOnEscape(RowEditActions);

export default ClosableRowEditActions;
export const PositionedRowEditActions = positionRowEditActions(ClosableRowEditActions);
