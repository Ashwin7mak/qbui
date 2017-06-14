import React, {PropTypes, Component} from 'react';
import RowActionsReuse from '../../../../../reuse/client/src/components/rowActions/rowActions';
import QbIconActions from './qbIconActions';

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
    onClickTestRowIcon = () => {
        if(this.props.onClickTestRowIcon) {
            this.props.onClickTestRowIcon(this.props.rowId, this.props.currentAppId);
        }
    }

    render() {
        if(this.props.onClickTestRowIcon) {
            return <RowActionsReuse iconActionsNode={<QbIconActions onClickEditRowIcon={this.onClickEditRowIcon}
                                                                    onClickDeleteRowIcon={this.onClickDeleteRowIcon}
                                                                    onClickTestRowIcon={this.onClickTestRowIcon}
            />}
                                    {...this.props}
            />;
        } else {
            return <RowActionsReuse iconActionsNode={<QbIconActions onClickEditRowIcon={this.onClickEditRowIcon}
                                                                    onClickDeleteRowIcon={this.onClickDeleteRowIcon}
            />}
                                    {...this.props}
            />;

        }
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
    * Icon through which an automation row can be tested  */
    onClickTestRowIcon: PropTypes.func,
    /*
    * Icon through which the row can be saved on click */
    onClickSaveRow: PropTypes.func.isRequired,
    /*
    * Uses an IconActions component to render the icon menu by default, but you can override the renderer by passing in your own React class (e.g., QbIconActions). */
    iconActionsNode: PropTypes.element
};

export default RowActions;
