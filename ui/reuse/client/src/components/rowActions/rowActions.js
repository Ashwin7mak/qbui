import React, {PropTypes, Component} from 'react';
import IconActions from 'REUSE/components/iconActions/iconActions';
import Locale from 'REUSE/locales/locale';

// TEMPORARY IMPORTS FROM CLIENT-REACT
import {PositionedRowEditActions} from 'APP/components/dataTable/qbGrid/rowEditActions';
// TEMPORARY IMPORTS FROM CLIENT-REACT

import './rowActions.scss';

export const SELECT_ROW_CHECKBOX = 'selectRowCheckbox';

class RowActions extends Component {

    onClickEditRowIcon = () => {
        if (this.props.onClickEditRowIcon) {
            return this.props.onClickEditRowIcon(this.props.rowId);
        }
    }

    onClickDeleteRowIcon = () => {
        if (this.props.onClickDeleteRowIcon) {
            this.props.onClickDeleteRowIcon(this.props.rowId);
        }
    }

    render() {
        const record = Locale.getMessage('records.singular');
        const actions = [
            {plainMessage: Locale.getMessage('selection.edit')   + " " + record, rawMsg: true, className:'edit', icon:'edit', onClick: this.props.onClickEditRowIcon},
            {plainMessage: Locale.getMessage('selection.print')  + " " + record, rawMsg: true, className:'print', icon:'print', tooltipMsg: 'unimplemented.print', disabled:true},
            {plainMessage: Locale.getMessage('selection.email')  + " " + record, rawMsg: true, className:'email', icon:'mail', tooltipMsg: 'unimplemented.email', disabled:true},
            {plainMessage: Locale.getMessage('selection.copy')   + " " + record, rawMsg: true, className:'duplicate', icon:'duplicate', tooltipMsg: 'unimplemented.copy', disabled:true},
            {plainMessage: Locale.getMessage('selection.delete') + " " + record, rawMsg: true, className:'delete', icon:'delete', onClick: this.props.onClickDeleteRowIcon}
        ];
        // Turn the row actions into edit actions when in inline edit mode
        if (this.props.isEditing) {
            return <PositionedRowEditActions idKey={this.props.rowId ? this.props.rowId.toString() : 'noRowId'}
                                             rowId={this.props.editingRowId}
                                             isValid={this.props.isEditingRowValid}
                                             isSaving={this.props.isEditingRowSaving}
                                             rowEditErrors={this.props.editingRowErrors}
                                             onClose={this.props.onCancelEditingRow}
                                             onClickCancel={this.props.onCancelEditingRow}
                                             onClickAdd={this.props.onClickAddNewRow}
                                             onClickSave={this.props.onClickSaveRow}
                                             gridComponent={true}
                    />;
        }

        // Display an empty div instead of row actions when inline edit is open
        if (this.props.isInlineEditOpen) {
            return <div className="emptyRowActions"></div>;
        }

        return (
            <div className="actionsCol">
                {!this.props.disableMultiSelect ? <input
                    className={SELECT_ROW_CHECKBOX}
                    type="checkbox"
                    checked={this.props.isSelected}
                    onChange={this.props.onClickToggleSelectedRow(this.props.rowId)}
                /> : null }
                {this.props.iconActionsNode || <IconActions onClickEditRowIcon={this.onClickEditRowIcon}
                                                            onClickDeleteRowIcon={this.onClickDeleteRowIcon}
                                                            dropdownTooltip={true}
                                                            className="recordActions"
                                                            pullRight={false}
                                                            menuIcons
                                                            actions={actions}
                                                            maxButtonsBeforeMenu={1}
                />}

            </div>
        );
    }
}

RowActions.propTypes = {
    /*
    * Gets the row id - can either be a string or a number */
    rowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /*
    * when true, the row can be edited, initially set to false */
    isEditing: PropTypes.bool,
    /*
    * Selects the corresponding row to be edited, can be enabled using checkbox */
    isSelected: PropTypes.bool,
    /*
    * Holds the corresponding rowId of the row that is currently being edited */
    editingRowId: PropTypes.number,
    /*
    * Shows or hides a loading spinner on the RowEditActions component*/
    isEditingRowValid: PropTypes.bool.isRequired,
    /*
    * Saves the values inside the current editing row */
    isEditingRowSaving: PropTypes.bool.isRequired,
    /*
    * Checks whether the inline edit is open or not */
    isInlineEditOpen: PropTypes.bool.isRequired,
    /*
    * Checks for errors in the editing row */
    editingRowErrors: PropTypes.array.isRequired,
    /*
    * Cancels editing of the row */
    onCancelEditingRow: PropTypes.func.isRequired,
    /*
    * Adds a new row onClick */
    onClickAddNewRow: PropTypes.func.isRequired,
    /*
    * Toggles between being selected and not being selected - selected means the current row can be edited */
    onClickToggleSelectedRow: PropTypes.func.isRequired,
    /*
    * Icon through which the row can be edited on click */
    onClickEditRowIcon: PropTypes.func,
    /*
    * Icon through which the row can be deleted on click */
    onClickDeleteRowIcon: PropTypes.func,
    /*
    * Icon through which the row can be saved on click */
    onClickSaveRow: PropTypes.func.isRequired,
    /*
    * Uses an IconActions component to render the icon menu by default, but you can override the renderer by passing in your own React class (e.g., QbIconActions). */
    iconActionsNode: PropTypes.element,

    disableMultiSelect: PropTypes.bool
};

RowActions.defaultProps = {
    /*
    * Set the initial rowId to be 1 */
    rowId: 1,
    /*
    * Set to false so it doesn't make the row editable without being toggled to true */
    isEditing: false,
    /*
    * No editing row available until selected - so set to null */
    editingRowId: null,
    /*
    * Makes sure that the editing row is valid */
    isEditingRowValid: true,
    /*
    * Makes sure that the editing Row can be saved */
    isEditingRowSaving: true,
    /*
    * Checks whether inline edit is open - initially set to false and has to be toggled to enable it */
    isInlineEditOpen: false,
    /*
    * No errors present until editing starts - so set to an empty array */
    editingRowErrors: [],
    /*
    * Node set to null initially - so renders IconActions - if any value is passed, renders QbIconActions */
    iconActionsNode: null,

    disableMultiSelect: false
};

export default RowActions;
