import React from 'react';
import ReactDOM from 'react-dom';
import {Table} from 'reactabular';
import Fluxxor from 'fluxxor';
import Locale from '../../../locales/locales';
import {Button, Dropdown, MenuItem} from 'react-bootstrap';
import QBicon from '../../qbIcon/qbIcon';
import {I18nMessage} from '../../../utils/i18nMessage';
import ReportUtils from '../../../utils/reportUtils';
import * as query from '../../../constants/query';

import {CellRenderer, DateCellRenderer, DateTimeCellRenderer, TimeCellRenderer, DurationCellRenderer,
    PhoneCellRenderer, NumericCellRenderer, TextCellRenderer, UserCellRenderer, CheckBoxCellRenderer,
    CurrencyCellRenderer, SelectionColumnCheckBoxCellRenderer, PercentCellRenderer, RatingCellRenderer} from '../agGrid/cellRenderers';

const serverTypeConsts = require('../../../../../common/src/constants');

import './qbGrid.scss';

const FluxMixin = Fluxxor.FluxMixin(React);


const QBGrid = React.createClass({
    mixins: [FluxMixin],
    displayName: 'QBGrid',

    propTypes: {
        columns: React.PropTypes.array,
        records: React.PropTypes.array,
        scrollParentClass: React.PropTypes.string, // class of parent who may be scrolling this grid
        selectedRows: React.PropTypes.array,
        uniqueIdentifier: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            selectedRows: [],
            columns: [],
            records: []
        };
    },

    getInitialState() {
        return {
            editRow: -1 // which row index is being edited, -1 if none
        };
    },

    /**
     * render using a Reactabular table
     */
    render() {

        let data = this.props.records ? this.props.records : [];
        data.forEach((record, index) => {
            record.id = record[this.props.uniqueIdentifier].value;
        });

        return (this.props.columns &&

            <Table ref="qbGridTable"
                   className="qbGrid"
                   columns={this.getColumns()}
                   data={data}
                   rowKey="id"
                   row={this.getRow}/>
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
            headerClass: "gridHeaderCell",
            header: this.getCheckboxHeader(),
            cell: this.getActionsCell()
        });

        // add the qb columns
        this.props.columns.forEach(col => {

            const rtCol = {
                property: col.field,
                headerClass: "gridHeaderCell",
                header: this.getFieldColumnHeader(col), // just a string for now
                cell: this.getColumnDataCell(col)
            };
            rtCols.push(rtCol);
        });
        return rtCols;
    },

    /**
     * get the 1st column header (select-all toggle)
     * @returns {XML}
     */
    getCheckboxHeader() {

        const allSelected = this.props.selectedRows.length === this.props.records.length;

        return (
            <input type="checkbox" className="selectAllCheckbox"
                   checked={allSelected}
                   onChange={ ev => {
                       if (ev.target.checked) {
                           this.selectAllRows();
                       } else {
                           this.getFlux().actions.selectedRows([]);
                       }
                   }
                   }
            />);
    },

    /**
     * select all grid rows
     */
    selectAllRows() {
        let selected = []; // array of record ids to select
        this.props.records.forEach(rec => {
            selected.push(rec[this.props.keyField].value);
        });
        this.getFlux().actions.selectedRows(selected);
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
                           onChange={() => this.toggleSelectedRow(id)}/>
                        <SelectionColumnCheckBoxCellRenderer params={params}/>
                </span>
            );
        };
    },

    /**
     * create a column header menu
     * @param columnIndex
     * @param pullRight position from right side to avoid clipping
     * @returns JSX columh header dropdown
     */
    getFieldColumnHeader(colDef) {

        let isSortedAsc = true;

        const isFieldSorted = _.find(this.props.sortFids, fid => {
            if (Math.abs(fid) === colDef.id) {
                isSortedAsc = fid > 0;
                return true;
            }
        });

        const sortAscText = this.getSortAscText(colDef, "sort");
        const sortDescText = this.getSortDescText(colDef, "sort");
        const groupAscText = this.getSortAscText(colDef, "group");
        const groupDescText = this.getSortDescText(colDef, "group");

        return (
            <div className="headerCell">
                <span className="headerName">{colDef.headerName}</span>
                <Dropdown bsStyle="default" noCaret id="dropdown-no-caret">
                    <Button tabIndex="0" bsRole="toggle" className={"dropdownToggle iconActionButton"}>
                        <QBicon icon="caret-filled-down"/>
                    </Button>

                    <Dropdown.Menu>
                        <MenuItem onSelect={() => this.sortReport(colDef, true, isFieldSorted && isSortedAsc)}>
                            {isFieldSorted && isSortedAsc && <QBicon icon="check"/>} {sortAscText}
                        </MenuItem>
                        <MenuItem onSelect={() => this.sortReport(colDef, false, isFieldSorted && !isSortedAsc)}>
                            {isFieldSorted && !isSortedAsc && <QBicon icon="check"/>} {sortDescText}
                        </MenuItem>
                        <MenuItem divider/>
                        <MenuItem onSelect={() => this.groupReport(colDef, true)}> {groupAscText}</MenuItem>
                        <MenuItem onSelect={() => this.groupReport(colDef, false)}> {groupDescText}</MenuItem>
                        <MenuItem divider/>
                        <MenuItem><I18nMessage message="report.menu.addColumnBefore"/></MenuItem>
                        <MenuItem><I18nMessage message="report.menu.addColumnAfter"/></MenuItem>
                        <MenuItem><I18nMessage message="report.menu.hideColumn"/></MenuItem>
                        <MenuItem divider/>
                        <MenuItem><I18nMessage message="report.menu.newTable"/></MenuItem>
                        <MenuItem divider/>
                        <MenuItem><I18nMessage message="report.menu.columnProps"/></MenuItem>
                        <MenuItem><I18nMessage message="report.menu.fieldProps"/></MenuItem>
                    </Dropdown.Menu>
                </Dropdown>
            </div>);

    },
    /**
     * On selection of sort option from menu fire off the action to sort the data
     * @param column
     * @param asc
     */
    sortReport(column, asc, alreadySorted) {

        if (alreadySorted) {
            return;
        }
        let flux = this.getFlux();

        let queryParams = {};
        // for on-the-fly sort selection, this selection will result in removal of old sort order
        // BUT since out grouped fields are also sorted we still need to keep those in the sort list.
        let sortFid = asc ? column.id.toString() : "-" + column.id.toString();

        let sortList = ReportUtils.getSortListString(this.props.groupEls);
        queryParams[query.SORT_LIST_PARAM] = ReportUtils.appendSortFidToList(sortList, sortFid);

        flux.actions.getFilteredRecords(this.props.appId,
            this.props.tblId,
            this.props.rptId, {format:true}, this.props.filter, queryParams);
    },
    /**
     * Build the menu items for sort/group
     * @param column
     * @param prependText
     * @returns {*}
     */
    getSortAscText(column, prependText) {
        let message = " ";
        switch (column.datatypeAttributes.type) {
        case "CHECKBOX": message =  "uncheckedToChecked"; break;
        case "TEXT":
        case "URL":
        case "USER":
        case "EMAIL_ADDRESS": message =  "aToZ"; break;
        case "DATE":
        case "DATE_TIME": message =  "oldToNew"; break;
        case "NUMERIC":
        case "RATING":
        default: message = "lowToHigh"; break;
        }
        return Locale.getMessage("report.menu." + prependText + "." + message);
    },
    getSortDescText(column, prependText) {
        let message = " ";
        switch (column.datatypeAttributes.type) {
        case "CHECKBOX": message =  "checkedToUnchecked"; break;
        case "TEXT":
        case "URL":
        case "USER":
        case "EMAIL_ADDRESS": message =  "zToA"; break;
        case "DATE":
        case "DATE_TIME": message =  "newToOld"; break;
        case "NUMERIC":
        case "RATING":
        default: message =  "highToLow"; break;
        }
        return Locale.getMessage("report.menu." + prependText + "." + message);
    },
    /**
     * get a context object to pass to the cells (could use react context if not for ag-grid)
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
            onRecordSaveClicked: id => {
                this.setState({editRow: -1});
                this.props.onRecordChange(id);
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
            if (this.state.editRow !== this.props.records.length - 1) {
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

            // todo: clean up dup column props when ag-grid no longer exists

            const params = {
                context: this.getContext(),
                api: this.api,
                column: {
                    colId: colDef.field,
                    colDef
                },
                colDef,
                value: data,
                data: rowData[rowIndex]
            };

            const editing = rowIndex === this.state.editRow;

            switch (colDef.datatypeAttributes.type) {
            case serverTypeConsts.NUMERIC:      return <NumericCellRenderer  qbGrid={true} params={params} editing={editing}/>;
            case serverTypeConsts.DATE:         return <DateCellRenderer     qbGrid={true} params={params} editing={editing}/>;
            case serverTypeConsts.DATE_TIME:    return <DateTimeCellRenderer qbGrid={true} params={params} editing={editing}/>;
            case serverTypeConsts.TIME_OF_DAY:  return <TimeCellRenderer     qbGrid={true} params={params} editing={editing}/>;
            case serverTypeConsts.CHECKBOX:     return <CheckBoxCellRenderer qbGrid={true} params={params} editing={editing}/>;
            case serverTypeConsts.USER:         return <UserCellRenderer     qbGrid={true} params={params} editing={editing}/>;
            case serverTypeConsts.CURRENCY:     return <CurrencyCellRenderer qbGrid={true} params={params} editing={editing}/>;
            case serverTypeConsts.RATING:       return <RatingCellRenderer   qbGrid={true} params={params} editing={editing}/>;
            case serverTypeConsts.PERCENT:      return <PercentCellRenderer  qbGrid={true} params={params} editing={editing}/>;
            case serverTypeConsts.DURATION:     return <DurationCellRenderer qbGrid={true} params={params} editing={editing}/>;
            case serverTypeConsts.PHONE_NUMBER: return <PhoneCellRenderer    qbGrid={true} params={params} editing={editing}/>;
            default:                            return <TextCellRenderer     qbGrid={true} params={params} editing={editing}/>;
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
            onClick: event => {
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
            // handle row click callback if we're not editing
            this.clickTimeout = null;
            if (this.props.onRowClick && (this.state.editRow === -1) && this.allowRowClick(target)) {
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

        document.querySelectorAll("table.qbGrid>tbody>tr>td:first-child").forEach(td => {
            td.style.left = offset + "px";
        });
    },

    /**
     * init api property first
     */
    componentWillMount() {
        // ag-grid dependency, could be in context
        this.api = {
            deselectAll: () => { },
            onEditRecordCancel: () => {},
            deleteRecord: this.deleteRecord
        };
    },

    /**
     * delete the record
     * @param data
     */
    deleteRecord(data) {
        //flux.actions.deleteReportRecord(...) which should do the delete causing the grid to re-render
    },

    /**
     * handle scroll events and init API
     */
    componentDidMount() {
        let scrollParent = document.querySelector(".reportContent");

        if (scrollParent) {
            scrollParent.addEventListener("scroll", this.handleScroll);
        }
    },

    /**
     * clean up scroll event handler
     */
    componentWillUnmount() {
        let scrollParent = document.querySelector(".reportContent");

        if (scrollParent) {
            scrollParent.removeEventListener("scroll", this.handleScroll);
        }
    }
});

export default QBGrid;


