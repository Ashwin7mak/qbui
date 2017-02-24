import React, {PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import QBIcon from '../../qbIcon/qbIcon';
import QBToolTip from '../../qbToolTip/qbToolTip';
import Loader  from 'react-loader';
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";
import closeOnEscape from '../../hoc/catchEscapeKey';
import positionedRowEditActions from './positionedRowEditActionsHoc';

// wrap this component with catchEscapeKey HOC to allow cancelling inline edit by hitting Escape
export const RowEditActions = React.createClass({
    displayName: 'RowEditActions',

    propTypes: {
        idKey: PropTypes.string,
        onClickAdd: PropTypes.func,
        onClickSave: PropTypes.func,
        onClickCancel: PropTypes.func,
        rowEditErrors: PropTypes.array,
        rowId: PropTypes.number,
        isSaving: PropTypes.bool,
        isValid: PropTypes.bool
    },

    onClickSave() {
        if (this.props.onClickSave) {
            this.props.onClickSave(this.props.rowId);
        }
    },

    onClickCancel() {
        if (this.props.onClickCancel) {
            this.props.onClickCancel(this.props.rowId);
        }
    },

    onClickAdd() {
        // Don't allow a user to move on and add another row if the record is currently invalid
        if (this.props.onClickAdd && this.props.isValid) {
            this.props.onClickAdd(this.props.rowId);
        }
    },

    renderSaveRecordButton() {
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

    renderSaveAndAddButton() {
        let {isValid, saving, rowId} = this.props;

        let addRecordClasses = ['addRecord'];

        // Heads up: We currently disable the Save and add Button hence the 'true' as the first parameter.
        // This check should be removed once creating multiple records in the grid is working.
        // https://quickbase.atlassian.net/browse/MB-2115
        // remove the eslint override when this is addressed
        /* eslint no-constant-condition:0 */
        if (true || !isValid || saving) {
            addRecordClasses.push('disabled');

            let tooltipMessage = 'pageActions.saveAndAddRecordDisabled'; // This can be removed once save and add is working again
            // let tooltipMessage = 'pageActions.saveAndAddRecord'; // Currently disabled

            return (
                <QBToolTip tipId="addRecord" location="bottom" i18nMessageKey={tooltipMessage}>
                    <Button className="rowEditActionsSaveAndAdd"><QBIcon icon="add" className={addRecordClasses.join(' ')}/></Button>
                </QBToolTip>
            );
        } else {
            return (
                <QBToolTip tipId="addRecord" location="bottom" i18nMessageKey="pageActions.saveAndAddRecord">
                    <Button className="rowEditActionsSaveAndAdd" onClick={this.onClickAdd}><QBIcon icon="add" className={addRecordClasses.join(' ')}/></Button>
                </QBToolTip>
            );
        }
    },

    render() {
        let {idKey} = this.props;

        return (
            <div className="editTools" key={"crea-" + idKey}>
                <QBToolTip tipId="cancelSelection" location="bottom" i18nMessageKey="pageActions.cancelSelection">
                    <Button className="rowEditActionsCancel" onClick={this.onClickCancel}><QBIcon icon="close" className="cancelSelection"/></Button>
                </QBToolTip>

                {this.renderSaveRecordButton()}

                {this.renderSaveAndAddButton()}
            </div>
        );
    }
});

const ClosableRowEditActions = closeOnEscape(RowEditActions);

export default ClosableRowEditActions;
export const PositionedRowEditActions = positionedRowEditActions(ClosableRowEditActions);
