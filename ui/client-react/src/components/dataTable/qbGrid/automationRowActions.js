import React, {PropTypes, Component} from 'react';
import RowActionsReuse from '../../../../../reuse/client/src/components/rowActions/rowActions';
import QbAutomationIconActions from './qbAutomationIconActions';

const AutomationRowActions = React.createClass({
    propTypes: {
        /*
         * Gets the row id - can either be a string or a number */
        rowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /*
         * Toggles between being selected and not being selected - selected means the current row can be edited */
        onClickToggleSelectedRow: PropTypes.func,
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
         * Uses an IconActions component to render the icon menu by default, but you can override the renderer by passing in your own React class (e.g., QbIconActions). */
        iconActionsNode: PropTypes.element
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

    onClickTestRowIcon() {
        if (this.props.onClickTestRowIcon) {
            this.props.onClickTestRowIcon(this.props.rowId);
        }
    },

    onClickToggleSelectedRow() {

    },

    onClickAddNewRow() {

    },

    onCancelEditingRow() {

    },

    onClickSaveRow() {

    },

    render() {
        return <RowActionsReuse iconActionsNode={<QbAutomationIconActions onClickEditRowIcon={this.onClickEditRowIcon}
                                                                onClickDeleteRowIcon={this.onClickDeleteRowIcon}
                                                                onClickTestRowIcon={this.onClickTestRowIcon}
        />}
                                onClickToggleSelectedRow={this.onClickToggleSelectedRow}
                                onClickAddNewRow={this.onClickAddNewRow}
                                onCancelEditingRow={this.onCancelEditingRow}
                                onClickSaveRow={this.onClickSaveRow}
                                {...this.props}
        />;

    }
});
export default AutomationRowActions;

