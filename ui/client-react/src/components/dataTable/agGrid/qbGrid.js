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

        return (data) => {

            const id = data.value; // the record ID
            const params = {
                context: {
                    flux: this.getFlux(),
                    onEditRecordCancel: () => {
                        this.setState({editRow: -1});
                    }
                },
                api: this.api,
                id
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
                column: {
                    colDef
                },
                value: data
            };

            const editing = rowIndex === this.state.editRow;

            switch (colDef.datatypeAttributes.type) {
            case serverTypeConsts.NUMERIC:      return <NumericCellRenderer  params={params} editing={editing} />;
            case serverTypeConsts.DATE:         return <DateCellRenderer     params={params} editing={editing} />;
            case serverTypeConsts.DATE_TIME:    return <DateTimeCellRenderer params={params} editing={editing} />;
            case serverTypeConsts.TIME_OF_DAY:  return <TimeCellRenderer     params={params} editing={editing} />;
            case serverTypeConsts.CHECKBOX:     return <CheckBoxCellRenderer params={params} editing={editing} />;
            case serverTypeConsts.USER:         return <UserCellRenderer     params={params} editing={editing} />;
            case serverTypeConsts.CURRENCY:     return <CurrencyCellRenderer params={params} editing={editing} />;
            case serverTypeConsts.RATING:       return <RatingCellRenderer   params={params} editing={editing} />;
            case serverTypeConsts.PERCENT:      return <PercentCellRenderer  params={params} editing={editing} />;
            case serverTypeConsts.DURATION:     return <DurationCellRenderer params={params} editing={editing} />;
            case serverTypeConsts.PHONE_NUMBER: return <PhoneCellRenderer    params={params} editing={editing} />;

            default: return <TextCellRenderer params={params} editing={editing} />;
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
            onDoubleClick: () => {
                this.setState({editRow: rowIndex});
            }
        };
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


