import React from 'react';
import ReactDOM from 'react-dom';
import {Table} from 'reactabular';
import Fluxxor from 'fluxxor';

import {CellRenderer, DateCellRenderer, DateTimeCellRenderer, TimeCellRenderer, DurationCellRenderer,
        PhoneCellRenderer, NumericCellRenderer, TextCellRenderer, UserCellRenderer, CheckBoxCellRenderer,
        CurrencyCellRenderer, SelectionColumnCheckBoxCellRenderer, PercentCellRenderer, RatingCellRenderer} from './cellRenderers';

const serverTypeConsts = require('../../../../../common/src/constants');

import './qbGrid.scss';

const FluxMixin = Fluxxor.FluxMixin(React);

const QBGrid = React.createClass({
    mixins: [FluxMixin],

    getInitialState() {
        return {
            editRow: -1 // which row index is being edited, -1 if none
        };
    },

    /**
     * render using a Reactabular table
     */
    render() {

        let data = this.props.records ?  this.props.records : [];

        return (this.props.columns &&

            <Table ref="qbGridTable"
                   className="qbGrid agGrid"
                   columns={this.getColumns()}
                   data={this.props.records}
                   rowKey="id"
                   row={this.getRow} />
        );
    },

    /**
     * get the column definition
     * @returns column defs for Reactabular
     */
    getColumns() {
        const rtCols = [];

        // add the selection/actions column

        rtCols.push({
            property: this.props.uniqueIdentifier,
            cell: this.getActionsCell()
        });

        // add the qb columns
        this.props.columns.forEach((col) => {

            const rtCol = {
                property: col.field,
                headerClass: "gridHeaderCell",
                header: col.headerName, // just a string for now
                cell: this.getColumnDataCell(col)
            };
            rtCols.push(rtCol);
        });
        return rtCols;
    },

    /**
     * renderer for selection/actions cells (higher order function)
     * @returns function that renders an actions column cell
     */
    getActionsCell() {

        // for compatibility with ag-grid, pass a params prop to the cell renderer
        // to provide a grid-level context object for callbacks etc.

        return (data, rowData, rowIndex) => {

            const id = data.value; // the record ID
            const params = {
                context: this.getContext(),
                api: this.api,
                data: rowData[rowIndex]
            };

            return (
                <span className="actionsCol">
                    <input type="checkbox"
                           checked={this.isRowSelected(id)}
                           onChange={() => this.toggleSelectedRow(id)} />
                        <SelectionColumnCheckBoxCellRenderer params={params} />
                </span>
            );
        };
    },

    /**
     * get a context object to pass to the cells
     * @returns {{keyField: (*|null|boolean), flux: *, onEditRecordCancel: onEditRecordCancel, cellTabCallback: cellTabCallback}}
     */
    getContext() {
        return {
            keyField: this.props.keyField,
            flux: this.getFlux(),
            onEditRecordCancel: () => {
                this.setState({editRow: -1});
            },
            cellTabCallback: this.onCellTab,
            onRecordChange: (id) => {
                this.setState({editRow: -1});
                this.props.onRecordChange(id)
            },
            onFieldChange: this.props.onFieldChange,
            onEditRecordStart: this.props.onEditRecordStart,
            getPendingChanges: this.props.getPendingChanges
        };
    },
    /**
     * user has tabbed out of a cell, move the edit row if necessary
     * @param colDef
     */
    onCellTab(colDef) {

        const lastColumn = this.props.columns[this.props.columns.length - 1];
        if (colDef.field === lastColumn.field) {
            // tabbed out of last column
            if (this.state.editRow !== this.props.records.length-1) {
                this.setState({editRow: this.state.editRow + 1});
            } else {
                this.setState({editRow: -1});
            }
        }
    },

    /**
     * is the row with a record ID selected
     * @param id
     * @returns {boolean}
     */
    isRowSelected(id) {

        return this.props.selectedRows.indexOf(id) !== -1;
    },

    /**
     * select row with data by
     * @param data
     */

    toggleSelectedRow(id) {

        const flux = this.getFlux();

        let selectedRows = this.props.selectedRows;

        if (selectedRows.indexOf(id) === -1) {
            // not already selected, add to selectedRows
            selectedRows.push(id);
        } else {
            // already selected, remove from selectedRows
            selectedRows = _.without(selectedRows, id);
        }
        flux.actions.selectedRows(selectedRows);
    },

    /**
     * get cell renderer for column (higher order function)
     *
     * @param colDef qb column definition
     * @returns function that renders a data column cell
     */
    getColumnDataCell(colDef) {

        return (data, rowData, rowIndex) => {

            const params = {
                context: this.getContext(),
                api: this.api,
                column: {
                    colDef
                },
                value: data
            };

            const editing = rowIndex === this.state.editRow;

            switch (colDef.datatypeAttributes.type) {
            case serverTypeConsts.NUMERIC:      return <NumericCellRenderer  qbGrid={true} params={params} editing={editing} />;
            case serverTypeConsts.DATE:         return <DateCellRenderer     qbGrid={true} params={params} editing={editing} />;
            case serverTypeConsts.DATE_TIME:    return <DateTimeCellRenderer qbGrid={true} params={params} editing={editing} />;
            case serverTypeConsts.TIME_OF_DAY:  return <TimeCellRenderer     qbGrid={true} params={params} editing={editing} />;
            case serverTypeConsts.CHECKBOX:     return <CheckBoxCellRenderer qbGrid={true} params={params} editing={editing} />;
            case serverTypeConsts.USER:         return <UserCellRenderer     qbGrid={true} params={params} editing={editing} />;
            case serverTypeConsts.CURRENCY:     return <CurrencyCellRenderer qbGrid={true} params={params} editing={editing} />;
            case serverTypeConsts.RATING:       return <RatingCellRenderer   qbGrid={true} params={params} editing={editing} />;
            case serverTypeConsts.PERCENT:      return <PercentCellRenderer  qbGrid={true} params={params} editing={editing} />;
            case serverTypeConsts.DURATION:     return <DurationCellRenderer qbGrid={true} params={params} editing={editing} />;
            case serverTypeConsts.PHONE_NUMBER: return <PhoneCellRenderer    qbGrid={true} params={params} editing={editing} />;
            default:                            return <TextCellRenderer     qbGrid={true} params={params} editing={editing} />;
            }
        };
    },

    /**
     * decorate the Reactabular row TR element
     * @param data row data
     * @param rowIndex
     * @returns {{className: string, onDoubleClick: onDoubleClick}}
     */
    getRow(data, rowIndex) {
        return {
            className: rowIndex === this.state.editRow ? "editing" : "",
            onClick: (event) => {
                this.onRowClicked(data, rowIndex, event);
            }
        };
    },

    /**
     * Capture the row-click event. Send to record view on row-click
     * @param params
     */
    onRowClicked(data, rowIndex, event) {

        const target = event.target;

        // edit row on doubleclick
        if (event.detail === 2) {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
            this.props.onEditRecordStart(data[this.props.keyField].value);
            this.setState({editRow: rowIndex});
            return;
        }
        if (this.clickTimeout) {
            // already waiting for 2nd click
            return;
        }

        this.clickTimeout = setTimeout(() => {
            // navigate to record if timeout wasn't canceled by 2nd click
            this.clickTimeout = null;
            if (this.props.onRowClick && (this.props.selectedRows.length === 0) && this.allowRowClick(target)) {
                this.props.onRowClick(data);
            }
        }, 500);

    },
    /**
     * should row click handling be allowed (i.e. not editing)
     * @param elem
     * @returns {boolean}
     */
    allowRowClick(node) {
        while (node) {
            if (node.classList.contains("editing") || node.classList.contains("actionsCol")) {
                return false;
            }
            if (node.classList.contains("qbGrid")) {
                return true;
            }
            node = node.parentNode; // traverse up the DOM
        }
        return false;
    },
    /**
     * emulate current QuickBase fixed column behavior
     * @param ev
     */
    handleScroll(ev) {

        const offset = ev.target.scrollLeft;

        document.querySelectorAll("table.qbGrid>tbody>tr>td:first-child").forEach((td) => {
            td.style.left = offset + "px";
        });
    },

    /**
     * handle scroll events and init API
     */
    componentDidMount() {
        document.querySelector(".reportContent").addEventListener("scroll", this.handleScroll);

        this.api = {
            deselectAll: () => {},
            onEditRecordCancel: () => {}
        };
    },

    /**
     * clean up scroll event handler
     */
    componentWillUnmount() {
        document.querySelector(".reportContent").removeEventListener("scroll", this.handleScroll);
    }
});

export default QBGrid;


