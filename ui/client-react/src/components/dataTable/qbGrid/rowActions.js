import React, {PropTypes} from 'react';
import Locale from '../../../locales/locales';
import IconActions from '../../actions/iconActions';
import {PositionedRowEditActions} from './rowEditActions';

export const SELECT_ROW_CHECKBOX = 'selectRowCheckbox';

/**
 * The actions that appear in the first column of the QbGrid.
 * @type {__React.ClassicComponentClass<P>}
 */
const RowActions = React.createClass({
    propTypes: {
        onClickEditRowIcon: PropTypes.func,
        onClickDeleteRowIcon: PropTypes.func,
        rowId: PropTypes.number,
        isEditing: PropTypes.bool,
        editingRowId: PropTypes.number,
        isEditingRowValid: PropTypes.bool.isRequired,
        isEditingRowSaving: PropTypes.bool.isRequired,
        isInlineEditOpen: PropTypes.bool.isRequired,
        isSelected: PropTypes.bool,
        editingRowErrors: PropTypes.array.isRequired,
        onCancelEditingRow: PropTypes.func.isRequired,
        onClickAddNewRow: PropTypes.func.isRequired,
        onClickSaveRow: PropTypes.func.isRequired,
        onClickToggleSelectedRow: PropTypes.func.isRequired,
    },

    onClickEditRowIcon() {
        if (this.props.onClickEditRowIcon) {
            return this.props.onClickEditRowIcon(this.props.rowId);
        }
    },

    onClickDeleteRowIcon() {
        if (this.props.onClickDeleteRowIcon) {
            this.props.onClickDeleteRowIcon(this.props.rowId);
        }
    },

    getViewRowActionComponent() {
        const record = Locale.getMessage('records.singular');
        const actions = [
            {msg: Locale.getMessage('selection.edit')   + " " + record, rawMsg: true, className:'edit', icon:'edit', onClick: this.onClickEditRowIcon},
            {msg: Locale.getMessage('selection.print')  + " " + record, rawMsg: true, className:'print', icon:'print', tooltipMsg: 'unimplemented.print', disabled:true},
            {msg: Locale.getMessage('selection.email')  + " " + record, rawMsg: true, className:'email', icon:'mail', tooltipMsg: 'unimplemented.email', disabled:true},
            {msg: Locale.getMessage('selection.copy')   + " " + record, rawMsg: true, className:'duplicate', icon:'duplicate', tooltipMsg: 'unimplemented.copy', disabled:true},
            {msg: Locale.getMessage('selection.delete') + " " + record, rawMsg: true, className:'delete', icon:'delete', onClick: this.onClickDeleteRowIcon}
        ];

        return <IconActions dropdownTooltip={true} className="recordActions" pullRight={false} menuIcons actions={actions} maxButtonsBeforeMenu={1} />;
    },

    render() {
        // Turn the row actions into edit actions when in inline edit mode
        if (this.props.isEditing) {
            return <PositionedRowEditActions
                idKey={this.props.rowId ? this.props.rowId.toString() : 'noRowId'}
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
        // or the current row is new and does not yet have an id
        if (this.props.isInlineEditOpen || !this.props.rowId) {
            return <div className="emptyRowActions"></div>;
        }

        return (
            <span className="actionsCol">
                <input
                    className={SELECT_ROW_CHECKBOX}
                    type="checkbox"
                    checked={this.props.isSelected}
                    onChange={this.props.onClickToggleSelectedRow(this.props.rowId)}
                />
                {this.getViewRowActionComponent()}
            </span>
        );
    }
});

export default RowActions;
