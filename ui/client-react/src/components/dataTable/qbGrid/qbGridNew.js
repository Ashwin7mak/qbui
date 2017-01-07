import React, {PropTypes} from 'react';
import * as Table from 'reactabular-table';
import Loader  from 'react-loader';
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";
import RowWrapper from './rowWrapper';
import CellWrapper from './cellWrapper';
import Locale from '../../../locales/locales';
import IconActions from '../../actions/iconActions';


import './qbGrid.scss';
import {PositionedRowEditActions} from './rowEditActions';

const ICON_ACTIONS_COLUMN_ID = 'ICON_ACTIONS';
const SELECT_ROW_CHECKBOX = 'selectRowCheckbox';

const QbGrid = React.createClass({
    propTypes: {
        numberOfColumns: PropTypes.number.isRequired,
        columns: PropTypes.array.isRequired,
        rows: PropTypes.array.isRequired,
        editingRowId: PropTypes.number,
        appUsers: PropTypes.array.isRequired,
        onCellChange: PropTypes.func.isRequired,
        onCellBlur: PropTypes.func.isRequired,
        selectedRows: PropTypes.array,
        onClickToggleSelectedRow: PropTypes.func,
        onClickEditIcon: PropTypes.func,
        onClickDeleteIcon: PropTypes.func,
        onClickToggleSelectAllRows: PropTypes.func,
        isEditingRowValid: PropTypes.bool,
        isEditingRowSaving: PropTypes.bool,
        editingRowErrors: PropTypes.object,
        onStartEditingRow: PropTypes.func,
        onCancelEditingRow: PropTypes.func,
        onClickAddNewRow: PropTypes.func,
        onClickSaveRow: PropTypes.func,
        // columns: PropTypes.arrayOf((propValue, key, componentName, location, propFullName) => {
        //     if (!(propValue instanceof Row)) {
        //         return new Error(
        //             'Invalid prop `' + propFullName + '` supplied to' +
        //             ' `' + componentName + '`. Validation failed.'
        //         );
        //     }
        // }).isRequired
    },

    getActionsCell() {
        return (cellDataRow, rowProps) => {
            // Turn the row actions into edit actions when in inline edit mode
            if (rowProps.rowData.isEditing) {
                return <PositionedRowEditActions
                    idKey={rowProps.rowData.id ? rowProps.rowData.id.toString() : 'noRowId'}
                    recordId={this.props.editingRowId}
                    isValid={this.props.isEditingRowValid}
                    isSaving={this.props.isEditingRowSaving}
                    rowEditErrors={this.props.editingRowErrors}
                    onClose={this.props.onCancelEditingRow}
                    onClickCancel={this.props.onCancelEditingRow}
                    onClickAdd={this.props.onClickAddNewRow}
                    onClickSave={this.props.onClickSaveRow}
                />;
            }

            // Display an empty div instead of row actions when another row is being edited
            // TODO:: Replace this with CSS. Add a 'inlineEditing' class to the table when there is a props.editingRow and then set display:none for .actionsCol in the qbGrid.scss file
            if (this.props.editingRowId) {
                return <div className="emptyRowActions"></div>;
            }

            let id = this.getRecordIdForRow(rowProps.rowData);
            let selected = rowProps.rowData.selected;

            return (
                <span className="actionsCol">
                    <input
                        className={SELECT_ROW_CHECKBOX}
                        type="checkbox"
                        checked={selected}
                        onChange={this.onClickToggleSelectedRow(id)}
                    />
                    {this.getViewRowActionComponent(id)}
                </span>
            );
        };
    },

    editCell(colDef) {
        return (newValue) => {
            this.props.onCellChange(newValue, colDef);
        };
    },

    blurCell(colDef) {
        return (newValue) => {
            this.props.onCellChange(newValue, colDef);
        };
    },

    addCellDecorators(cell) {
        // If there is no cell (e.g., in the case of a subheader row that doesn't have any cells) then don't try
        // to add special props.
        if (!cell) {
            return;
        }

        let changeListeners = {
            editCell: this.editCell,
            onCellBlur: this.blurCell,
            appUsers: this.props.appUsers,
            onClick: this.onStartEditingRow(cell.recordId),
        };

        return Object.assign({}, cell, changeListeners);
    },

    getColumns() {
        return this.props.columns.map(column => {
            return column.addFormatter(this.addCellDecorators).gridHeader();
        });
    },

    getRecordIdForRow(rowProps) {
        let keys = Object.keys(rowProps);
        if (keys.length === 0) {
            return null;
        }

        let firstField = rowProps[keys[0]];

        if (!_.isObject(firstField)) {
            return null;
        }

        return firstField.recordId;
    },

    onStartEditingRow(recordId) {
        return (ev) => {
            if (this.props.onStartEditingRow) {
                this.props.onStartEditingRow(recordId);
            }
        };
    },

    addRowDecorators(row) {
        let classes = ['table-row'];
        if (row.isEditing) {
            classes.push('editing');
        }

        return {
            className: classes.join(' '),
            editing: row.isEditing,
            // props that differentiate a subheader
            subHeader: row.subHeader,
            subHeaderLevel: row.subHeaderLevel,
            subHeaderId: row.id,
            subHeaderLabel: row.subHeaderLabel,
            // Add one to account for the extra column at the start of the grid for the row actions.
            // TODO:: Only add one if the prop for displaying those actions is set
            numberOfColumns: this.props.numberOfColumns + 1,

        };
    },

    /**
     * get the 1st column header (select-all toggle)
     * @returns {React}
     */
    getCheckboxHeader() {

        const allSelected = this.props.selectedRows.length === this.props.rows.length;

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

    onClickEditRowIcon(recordId) {
        return () => {
            if (this.props.onClickEditIcon) {
                return this.props.onClickEditIcon(recordId);
            }
        };
    },

    onClickDeleteRowIcon(recordId) {
        return () => {
            if (this.props.onClickDeleteIcon) {
                return this.props.onClickDeleteIcon(recordId);
            }
        };
    },

    getViewRowActionComponent(recordId) {
        const record = Locale.getMessage('records.singular');
        const actions = [
            {msg: Locale.getMessage('selection.edit')   + " " + record, rawMsg: true, className:'edit', icon:'edit', onClick: this.onClickEditRowIcon(recordId)},
            {msg: Locale.getMessage('selection.print')  + " " + record, rawMsg: true, className:'print', icon:'print', tooltipMsg: 'unimplemented.print', disabled:true},
            {msg: Locale.getMessage('selection.email')  + " " + record, rawMsg: true, className:'email', icon:'mail', tooltipMsg: 'unimplemented.email', disabled:true},
            {msg: Locale.getMessage('selection.copy')   + " " + record, rawMsg: true, className:'duplicate', icon:'duplicate', tooltipMsg: 'unimplemented.copy', disabled:true},
            {msg: Locale.getMessage('selection.delete') + " " + record, rawMsg: true, className:'delete', icon:'delete', onClick: this.onClickDeleteRowIcon(recordId)}
        ];

        return <IconActions dropdownTooltip={true} className="recordActions" pullRight={false} menuIcons actions={actions} maxButtonsBeforeMenu={1} />;
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
                },
                cell: {
                    formatters: [this.getActionsCell()]
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
                    components={{
                        body: {
                            row: RowWrapper,
                            cell: CellWrapper,
                        }
                    }}
                >
                    <Table.Header />

                    <Table.Body onRow={this.addRowDecorators} rows={this.props.rows} rowKey="id" />
                </Table.Provider>
            </Loader>
        );

    }
});

export default QbGrid;
