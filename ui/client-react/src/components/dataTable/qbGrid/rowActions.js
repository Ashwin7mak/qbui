import React, {PropTypes} from 'react';
import {PositionedRowEditActions} from './rowEditActions';
import QbIconActions from './qbIconActions';

export const SELECT_ROW_CHECKBOX = 'selectRowCheckbox';

/**
 * The actions that appear in the first column of the QbGrid.
 * @type {__React.ClassicComponentClass<P>}
 */
const RowActions = React.createClass({
    propTypes: {
        rowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        isEditing: PropTypes.bool,
        isSelected: PropTypes.bool,
        editingRowId: PropTypes.number,
        isEditingRowValid: PropTypes.bool.isRequired,
        isEditingRowSaving: PropTypes.bool.isRequired,
        isInlineEditOpen: PropTypes.bool.isRequired,
        editingRowErrors: PropTypes.array.isRequired,
        onCancelEditingRow: PropTypes.func.isRequired,
        onClickAddNewRow: PropTypes.func.isRequired,
        onClickToggleSelectedRow: PropTypes.func.isRequired,
        onClickEditRowIcon: PropTypes.func,
        onClickDeleteRowIcon: PropTypes.func,
        onClickSaveRow: PropTypes.func.isRequired,
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
        if (this.props.isInlineEditOpen) {
            return <div className="emptyRowActions"></div>;
        }

        return (
            <div className="actionsCol">
                <input
                    className={SELECT_ROW_CHECKBOX}
                    type="checkbox"
                    checked={this.props.isSelected}
                    onChange={this.props.onClickToggleSelectedRow(this.props.rowId)}
                />
                <QbIconActions onClickEditRowIcon={this.onClickEditRowIcon} onClickDeleteRowIcon={this.onClickDeleteRowIcon} />
            </div>
        );
    }
});

export default RowActions;
