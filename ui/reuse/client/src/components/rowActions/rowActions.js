import React, {PropTypes, Component} from 'react';
import {PositionedRowEditActions} from '../../../../../client-react/src/components/dataTable/qbGrid/rowEditActions';
import IconActions from '../iconActions/iconActions';
import Locale from '../../locales/locale';

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
            {msg: Locale.getMessage('selection.edit')   + " " + record, rawMsg: true, className:'edit', icon:'edit', onClick: this.props.onClickEditRowIcon},
            {msg: Locale.getMessage('selection.print')  + " " + record, rawMsg: true, className:'print', icon:'print', tooltipMsg: 'unimplemented.print', disabled:true},
            {msg: Locale.getMessage('selection.email')  + " " + record, rawMsg: true, className:'email', icon:'mail', tooltipMsg: 'unimplemented.email', disabled:true},
            {msg: Locale.getMessage('selection.copy')   + " " + record, rawMsg: true, className:'duplicate', icon:'duplicate', tooltipMsg: 'unimplemented.copy', disabled:true},
            {msg: Locale.getMessage('selection.delete') + " " + record, rawMsg: true, className:'delete', icon:'delete', onClick: this.props.onClickDeleteRowIcon}
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
                <input
                    className={SELECT_ROW_CHECKBOX}
                    type="checkbox"
                    checked={this.props.isSelected}
                    onChange={this.props.onClickToggleSelectedRow(this.props.rowId)}
                />
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
    iconActionsNode: PropTypes.element
};

RowActions.defaultProps = {
    rowId: 1,
    isEditing: false,
    editingRowId: null,
    isEditingRowValid: true,
    isEditingRowSaving: true,
    isInlineEditOpen: false,
    editingRowErrors: [],
    iconActionsNode: null
};

export default RowActions;
