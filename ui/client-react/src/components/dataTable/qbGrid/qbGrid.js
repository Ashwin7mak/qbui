import React, {PropTypes} from 'react';
import * as Table from 'reactabular-table';
import Loader  from 'react-loader';
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";
import QbHeaderCell from './qbHeaderCell';
import QbRow from './qbRow';
import QbCell from './qbCell';
import {UNSAVED_RECORD_ID} from '../../../constants/schema';
import RowActions, {SELECT_ROW_CHECKBOX} from './rowActions';
import ReactDOM from 'react-dom';

import './qbGrid.scss';

const ICON_ACTIONS_COLUMN_ID = 'ICON_ACTIONS';

const QbGrid = React.createClass({
    propTypes: {
        /**
         * The total number of columns displayed on the grid. Passed in as a prop to prevent recalculating this value
         * multiple times across components */
        numberOfColumns: PropTypes.number.isRequired,

        /**
         * The columns displayed on the grid. Use the ColumnTransformer class to help format data in a way that
         * the QbGrid can display columns correctly
         */
        columns: PropTypes.array.isRequired,

        /**
         * The data for the rows displayed on the grid. Use the RowTransformer class to help format data in a way
         * that the QbGrid can display rows correctly
         */
        rows: PropTypes.array.isRequired,

        /**
         * The id of the editing row. QbGrid assumes each row has a unique id property. */
        editingRowId: PropTypes.number,


        // TODO:: Refactor out isInlineEditOpen once agGrid is removed. See more detail in reportGrid.js
        /**
         * A boolean value indicating if inline editing is currently open*/
        isInlineEditOpen: PropTypes.bool,

        /**
         * The currently selected rows (e.g., by clicking the checkboxes in the first column) */
        selectedRows: PropTypes.array,

        /**
         * The action that occurs when a row is selected (e.g., by clicking the checkboxes in the first column) */
        onClickToggleSelectedRow: PropTypes.func,

        /**
         * The action that occurs when the edit icon is clicked (in the first column) */
        onClickEditIcon: PropTypes.func,

        /**
         * The action that occurs when the delete icon is clicked (in the first column) */
        onClickDeleteIcon: PropTypes.func,

        /**
         * The action that selects/deselects all of the rows */
        onClickToggleSelectAllRows: PropTypes.func,

        /**
         * A value that indicates whether the current row being edited is in a valid state. */
        isEditingRowValid: PropTypes.bool,

        /**
         * A value indicating if the current row being edited is currently in a saving state */
        isEditingRowSaving: PropTypes.bool,

        /**
         * An array of errors that affect the row currently being edited. This value is used to display a number
         * of errors to fix to the user. I.e., "Please fix 3 errors" */
        editingRowErrors: PropTypes.array,

        /**
         * The action to cancel editing a row */
        onCancelEditingRow: PropTypes.func,

        /**
         * The action that will create a new row in the grid */
        onClickAddNewRow: PropTypes.func,

        /**
         * The action that occurs when the user clicks save */
        onClickSaveRow: PropTypes.func,

        /**
         * To make QbGrid flexible, it makes no assumptions about what is rendered inside of a cell.
         * A cellRenderer (a React component) must be passed in.
         * The cellRenderer component will have access to all the props in the row object.
         */
        cellRenderer: PropTypes.func.isRequired,

        /**
         * If there are properties common to all rows, they can be passed in as an addition prop. This is useful for event
         * handlers that are the same across all rows. Instead of mapping them to each row object, you can add them once here and
         * they will be available as props to the cellRenderer. */
        commonCellProps: PropTypes.object,

        /**
         * A function used to compare changes to a cell. This function is used to improve the performance of the grid. A cell will
         * only re-render if there are differences. */
        compareCellChanges: PropTypes.func,

        /**
         * A menu that can be displayed next to the text in the header row. */
        menuComponent: PropTypes.func,

        /**
         * Additional props that can be passed to the menu in addition to the column properties from the grid data */
        menuProps: PropTypes.object,
    },

    onClickAddNewRow() {
        if (this.props.onClickAddNewRow) {
            this.props.onClickAddNewRow(this.props.editingRowId);
        }
    },

    getActionsCell(cellDataRow, rowProps) {
        return <RowActions
            rowId={rowProps.rowData.id}
            onClickDeleteRowIcon={this.props.onClickDeleteIcon}
            onClickEditRowIcon={this.props.onClickEditIcon}
            isEditing={rowProps.rowData.isEditing}
            editingRowId={this.props.editingRowId}
            isEditingRowValid={this.props.isEditingRowValid}
            isEditingRowSaving={this.props.isEditingRowSaving}
            isInlineEditOpen={this.props.isInlineEditOpen}
            isSelected={rowProps.rowData.isSelected}
            editingRowErrors={this.props.editingRowErrors}
            onCancelEditingRow={this.props.onCancelEditingRow}
            onClickAddNewRow={this.onClickAddNewRow}
            onClickSaveRow={this.props.onClickSaveRow}
            onClickToggleSelectedRow={this.onClickToggleSelectedRow}
        />;
    },

    /**
     * The row actions in the first column should be sticky as the user scrolls left and right on the grid
     * This function adds the isStickyCell:true prop to qbCell
     * @returns {{isStickyCell: boolean}}
     */
    getActionCellProps() {
        return {
            isStickyCell: true
        };
    },

    renderCell(cellData) {
        return React.createElement(this.props.cellRenderer, Object.assign({}, cellData, this.props.commonCellProps));
    },

    getColumns() {
        return this.props.columns.map(column => {
            return column.addFormatter(this.renderCell).addHeaderMenu(this.props.menuComponent, this.props.menuProps).getGridHeader();
        });
    },

    addRowDecorators(row) {
        let classes = ['table-row'];
        if (row.isEditing) {
            classes.push('editing');
        }
        if (row.classes) {
            classes = [...classes, ...row.classes];
        }

        let rowProps = Object.assign({
            subHeaderId: row.id,
            className: classes.join(' '),
            editingRowId: this.props.editingRowId,
            isInlineEditOpen: this.props.isInlineEditOpen,
            isValid: this.props.isEditingRowValid,
            isSaving: this.props.isEditingRowSaving,
            // Add one to account for the extra column at the start of the grid for the row actions.
            // TODO:: Only add one if the prop for displaying those actions is set
            numberOfColumns: this.props.numberOfColumns + 1,
            compareCellChanges: this.props.compareCellChanges,
        }, row);

        return rowProps;
    },

    /**
     * get the 1st column header (select-all toggle)
     * @returns {React}
     */
    getCheckboxHeader() {
        let {selectedRows, rows} = this.props;
        const allSelected = (selectedRows && rows && selectedRows.length === rows.length);

        return (
            <input
                type="checkbox"
                className={`${SELECT_ROW_CHECKBOX} selectAllCheckbox`}
                checked={allSelected}
                onChange={this.props.onClickToggleSelectAllRows}
            />
        );
    },

    onClickToggleSelectedRow(id) {
        return () => {
            if (this.props.onClickToggleSelectedRow) {
                this.props.onClickToggleSelectedRow(id);
            }
        };
    },

    getUniqueRowKey({rowData, rowIndex}) {
        if (rowData.id === UNSAVED_RECORD_ID) {
            return `newRow-${rowIndex}`;
        }
        return `row-${rowData.id}`;
    },

    /**
     * stick the header and sticky first column when the grid scrolls
     */
    handleScroll() {
        let scrolled = document.getElementsByClassName('qbGrid')[0];
        let currentLeftScroll = scrolled.scrollLeft;
        let currentTopScroll = scrolled.scrollTop;

        // move the headers down to their original positions
        let stickyHeaders = scrolled.getElementsByClassName('qbHeaderCell');
        for (let i = 0; i < stickyHeaders.length; i++) {
            stickyHeaders[i].style.top = currentTopScroll + 'px';
        }

        // move the stick cells (1st col) right to their original positions
        let stickyCells = scrolled.getElementsByClassName('stickyCell');

        stickyCells[0].style.borderRight = '1px solid #c0d0e4'; // header cell
        stickyCells[0].style.left = currentLeftScroll + 'px';
        stickyCells[0].style.right = 0;
        stickyCells[0].style.bottom = 0;
        for (let i = 1; i < stickyCells.length; i++) {
            stickyCells[i].style.borderRight = '1px solid #dcdcdc';
            stickyCells[i].style.left = currentLeftScroll + 'px';
        }
    },

    render() {
        let columns = [
            ...[{
                property: ICON_ACTIONS_COLUMN_ID,
                headerClass: "gridHeaderCell",
                header: {
                    props: {
                        scope: 'col'
                    },
                    label: this.getCheckboxHeader(),
                    transforms: [this.getActionCellProps],
                },
                cell: {
                    formatters: [this.getActionsCell],
                    transforms: [this.getActionCellProps],
                }
            }],
            ...this.getColumns()
        ];
        return (

            <Loader loaded={!this.props.loading} options={SpinnerConfigurations.LARGE_BREAKPOINT_REPORT}>
                <Table.Provider
                    ref="qbGridTable"
                    className="qbGrid"
                    columns={columns}
                    onScroll={this.handleScroll}
                    components={{
                        header: {
                            cell: QbHeaderCell
                        },
                        body: {
                            row: QbRow,
                            cell: QbCell
                        }
                    }}>
                    <Table.Header />

                    <Table.Body onRow={this.addRowDecorators} rows={this.props.rows} rowKey={this.getUniqueRowKey} />

                </Table.Provider>
            </Loader>
        );
    }
});

export default QbGrid;
