import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import {AgGridEnterprise} from 'ag-grid-enterprise';
import {reactCellRendererFactory} from 'ag-grid-react';
import {I18nMessage} from '../../../utils/i18nMessage';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import ReportActions from '../../actions/reportActions';
import RecordActions from '../../actions/recordActions';
import Locale from '../../../locales/locales';
import _ from 'lodash';
import Loader  from 'react-loader';
import Fluxxor from 'fluxxor';
import * as query from '../../../constants/query';
import ReportUtils from '../../../utils/reportUtils';
import * as GroupTypes from '../../../constants/groupTypes';

let FluxMixin = Fluxxor.FluxMixin(React);

import '../../../../../node_modules/ag-grid/dist/styles/ag-grid.css';
import './agGrid.scss';


/**
 * Renderer component for record-actions column.
 */
let ActionsColumn = React.createClass({
    render() {
        return (<div><RecordActions {...this.props}/></div>);
    }
});

function buildIconElement(icon) {
    return "<span class='qbIcon iconssturdy-" + icon + "'></span>";
}
let gridIcons = {
    groupExpanded: buildIconElement("caret-filled-down"),
    groupContracted: buildIconElement("icon_caretfilledright"),
    menu: buildIconElement("caret-filled-down"),
    check: buildIconElement("check")
};
let consts = {
    GROUP_HEADER_HEIGHT: 41,
    ROW_HEIGHT: 32,
    DEFAULT_CHECKBOX_COL_WIDTH: 30,
    GROUP_ICON_PADDING: 10,
    DEFAULT_CELL_PADDING: 8,
    FONT_SIZE: 20
};

let AGGrid = React.createClass({
    mixins: [FluxMixin],

    propTypes: {
        uniqueIdentifier: React.PropTypes.string,
        selectionActions: React.PropTypes.element,
        reportHeader: React.PropTypes.element,
        columns: React.PropTypes.array,
        loading: React.PropTypes.bool,
        records: React.PropTypes.array,
        appId: React.PropTypes.string,
        tblId: React.PropTypes.string,
        onRowClick: React.PropTypes.func
    },
    contextTypes: {
        touch: React.PropTypes.bool,
        history: React.PropTypes.object,
        flux: React.PropTypes.object
    },

    // agGrid has a "context" param that is of type object and gets passed down to all cell renderer functions.
    // Since the external components are not in the tree hierarchy as the grid itself, and hence dont share the same react context,
    // use this "context" object to pass down such pieces to the components.
    gridOptions: {
        context: {}
    },

    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
        this.onMenuClose();
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
        queryParams[query.GLIST_PARAM] = ReportUtils.appendSortFidToList(sortList, sortFid);

        flux.actions.getFilteredRecords(this.props.appId,
            this.props.tblId,
            this.props.rptId, {format:true}, this.props.filter, queryParams);
    },
    /**
     * On selection of group option from menu fire off the action to group the data
     * @param column
     * @param asc
     */
    groupReport(column, asc) {
        let flux = this.getFlux();

        let queryParams = {};
        //for on-the-fly grouping, forget the previous group and go with the selection but add the previous sort fids.
        //TODO: how to pass back grouping info?
        let sortFid = column.id.toString();
        let groupString = ReportUtils.getGroupString(sortFid, asc, GroupTypes.GROUP_TYPE.text.equals);
        let sortList = ReportUtils.getSortListString(this.props.sortFids);
        queryParams[query.SORT_LIST_PARAM] = ReportUtils.prependSortFidToList(sortList, groupString);
        queryParams[query.GLIST_PARAM] = ReportUtils.prependSortFidToList(sortList, groupString);

        flux.actions.getFilteredRecords(this.props.appId,
            this.props.tblId,
            this.props.rptId, {format:true}, this.props.filter, queryParams);
    },
    /**
     * AG-grid doesnt fire any events or add any classes to the column for which menu has been opened
     * This makes the menu look like its detached from the header. The following is a hack to handle this.
     * When a menu opens store the selectedColumn and then on DonNodeRemoved event if menu has been closed then
     * remove the class from selectedColumn
     */
    selectedColumnId: [],
    selectColumnHeader(column) {
        let columnHeader = document.querySelectorAll('div.ag-header-cell[colId="' + column.field + '"]');
        if (columnHeader.length) {
            columnHeader[0].classList.add("selected");
            this.selectedColumnId.push(column.field);
        }
    },
    onMenuClose() {

        document.addEventListener("DOMNodeRemoved", (ev) => {
            if (ev.target && ev.target.className && ev.target.className.indexOf("ag-menu") !== -1) {
                if (this.selectedColumnId.length) {
                    let toRemove = this.selectedColumnId[0];
                    let occurences = _.filter(this.selectedColumnId, (column) => {
                        return column === toRemove;
                    });
                    this.selectedColumnId = this.selectedColumnId.splice(1, this.selectedColumnId.length);
                    let columnHeader = document.querySelectorAll('div.ag-header-cell[colId="' + toRemove + '"]');
                    if (occurences.length <= 1) {
                        columnHeader[0].classList.remove("selected");
                    }
                }
            }
        });
    },
    /**
     * Build the column menu. This gets called every time menu is opened
     * @param params
     * @returns {*[]}
     */
    getMainMenuItems(params) {
        this.selectColumnHeader(params.column.colDef);
        let isSortedAsc = true;
        let isFieldSorted = _.find(this.props.sortFids, (fid) => {
            if (Math.abs(fid) === params.column.colDef.id) {
                isSortedAsc = fid > 0;
                return true;
            }
        });
        let menuItems = [
            {"name": this.getSortAscText(params.column.colDef, "sort"), "icon": isFieldSorted && isSortedAsc ? gridIcons.check : "", action: () => this.sortReport(params.column.colDef, true, isFieldSorted && isSortedAsc)},
            {"name": this.getSortDescText(params.column.colDef, "sort"), "icon": isFieldSorted && !isSortedAsc ? gridIcons.check : "", action: () => this.sortReport(params.column.colDef, false, isFieldSorted && !isSortedAsc)}];
        menuItems.push("separator");
        menuItems.push({"name": this.getSortAscText(params.column.colDef, "group"), action: () => this.groupReport(params.column.colDef, true)},
            {"name": this.getSortDescText(params.column.colDef, "group"), action: () => this.groupReport(params.column.colDef)});
        menuItems.push("separator");
        menuItems.push({"name": Locale.getMessage("report.menu.addColumnBefore")},
            {"name": Locale.getMessage("report.menu.addColumnAfter")},
            {"name": Locale.getMessage("report.menu.hideColumn")}
        );
        menuItems.push("separator");
        menuItems.push({"name": Locale.getMessage("report.menu.newTable")});
        menuItems.push("separator");
        menuItems.push({"name": Locale.getMessage("report.menu.columnProps")},
            {"name": Locale.getMessage("report.menu.fieldProps")});
        return menuItems;
    },

    /**
     * Callback that the grid uses to figure out whether to show grouped data or not.
     * And if so then how to use the rowItems to figure out grouped info.
     * @param rowItem
     * @returns {*}
     */
    getNodeChildDetails(rowItem) {
        if (rowItem.group) {
            return {
                group: true,
                expanded: true,
                children: rowItem.children,
                field: 'group',
                key: rowItem.group
            };
        } else {
            return null;
        }
    },
    getRowHeight(rowItem) {
        if (rowItem.node.field === "group") {
            return consts.GROUP_HEADER_HEIGHT;
        } else {
            return consts.ROW_HEIGHT;
        }
    },
    /**
     * Renderer for the group header row.
     * @param params
     * @returns {Element}
     */
    getGroupRowRenderer(params) {
        let groupCellText = document.createElement("span");
        groupCellText.className = "group-header";
        groupCellText.textContent = params.data.group;
        return groupCellText;
    },
    componentDidMount() {
        this.gridOptions.context.flux = this.getFlux();
        this.gridOptions.getNodeChildDetails = this.getNodeChildDetails;

        this.refs.griddleWrapper.addEventListener("scroll", this.props.onScroll);
    },
    componentWillUnmount() {
        this.refs.griddleWrapper.removeEventListener("scroll", this.props.onScroll);
    },

    // Performance improvement - only update the component when certain state/props change
    // Since this is a heavy component we dont want this updating all times.
    shouldComponentUpdate(nextProps, nextState) {
//console.log('have',this.props);
//console.log('get',nextProps);

        if (!_.isEqual(nextState, this.state)) {
            return true;
        }
        if (!_.isEqual(nextProps.loading, this.props.loading)) {
            return true;
        }
        if (!_.isEqual(nextProps.records, this.props.records)) {
            return true;
        }
        return false; // for now
    },
    /**
     * Helper method to auto-resize all columns to the content's width. This is not called anywhere right now - more design is needed on sizing.
     */
    autoSizeAllColumns() {
        var allColumnIds = [];
        if (this.columnApi) {
            if (this.props.columns) {
                this.props.columns.forEach(function(columnDef) {
                    allColumnIds.push(columnDef.field);
                });
                this.columnApi.autoSizeColumns(allColumnIds);
            }
        }
    },
    /**
     * Grid API - selectAll "selects" all rows.
     */
    selectAll() {
        const flux = this.getFlux();
        this.api.selectAll();
        flux.actions.selectedRows(this.getSelectedRows());
    },
    /**
     * Grid API - deselectAll "deselects" all rows.
     */
    deselectAll() {
        const flux = this.getFlux();
        this.api.deselectAll();
        flux.actions.selectedRows([]);
    },
    /**
     * Capture the row-click event. Send to record view on row-click
     * @param params
     */
    onRowClicked(params) {

        //For click on group, expand/collapse the group.
        if (params.node.field === "group") {
            params.node.expanded = !params.node.expanded;
            this.api.onGroupExpandedOrCollapsed();
            return;
        }
        //For click on record action icons do nothing
        if (params.event.target &&
            params.event.target.className.indexOf("qbIcon") !== -1 ||
            params.event.target.className.indexOf("iconLink") !== -1 ||
            params.event.target.tagName === "INPUT") {
            return;
        }

        if (params.event.detail === 2) {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
            params.node.setSelected(true, true);
            flux.actions.selectedRows(this.getSelectedRows());
            return;
        }
        if (this.clickTimeout) {
            return;
        }

        this.clickTimeout = setTimeout(() => {
            this.clickTimeout = null;
            this.props.onRowClick(params.data);
        }, 500);
    },
    /**
     * Capture the row-selection/deselection change events.
     * For some reason this doesnt seem to fire on deselectAll but doesnt matter for us.
     */
    onSelectionChanged() {
        let flux = this.getFlux();

        flux.actions.selectedRows(this.getSelectedRows());
    },

    /**
     * Helper method to flip the master checkbox if all rows are checked
     */
    allRowsSelected() {
        let selectedRows = this.getSelectedRows().length;

        return this.props.recordCount === selectedRows;
    },
    /**
     * Capture the event if all-select checkbox is clicked.
     * We want to make sure if all-checkbox is clicked then the event doesnt propagate to all rows in turn.
     * Use selectAllClicked state variable to keep track of this.
     */
    allCheckBoxSelected() {
        if (!this.props.records) {
            return;
        }
        if (event.currentTarget.checked) {
            this.selectAll();
        } else {
            this.deselectAll();
        }

    },

    /**
     * There seems to be bug in getSelectedRows callback of grid where
     * it also returns group header rows. This one weans those out to select
     * only valid rows.
     * @returns {Array}
     */
    getSelectedRows() {
        let rows = [];
        if (this.api) {
            this.api.getSelectedRows().forEach((row) => {
                if (row[this.props.uniqueIdentifier]) {
                    rows.push(row[this.props.uniqueIdentifier]);
                }
            });
        }
        return rows;
    },

    /**
     * Callback - what to do when the master group expand/collapse is clicked
     * @param element
     */
    onGroupsExpand(element) {
        if (!element.getAttribute("state")) {
            element = element.parentElement;
        }
        if (element.getAttribute("state") === "close") {
            element.setAttribute("state", "open");
            element.innerHTML = gridIcons.groupExpanded;
            this.api.expandAll();
        } else {
            element.setAttribute("state", "close");
            element.innerHTML = gridIcons.groupContracted;
            this.api.collapseAll();
        }
    },

    getCheckBoxColumnGroupedHeaderWidth() {
        // this is a weird calculation but this is because we want the checkbox to always show based on number of grouping levels
        // for now this is being calulated as num_groups*(font size + padding) + num_checkboxes*(size of checkbox + padding)
        // 3px error is because icons need to be fixed, so that'll be removed.
        const checkbox_size = 12;
        return consts.DEFAULT_CELL_PADDING +
            this.props.groupLevel * (consts.FONT_SIZE + consts.GROUP_ICON_PADDING) +
            checkbox_size + consts.DEFAULT_CELL_PADDING - 3;
    },
    /**
     * Builder for "checkbox" column for the grid
     * Also contains grouping expand/collpase icon if grouping is turned on
     */
    getCheckBoxColumn() {
        //Add checkbox column
        let checkBoxCol = {};
        checkBoxCol.field = "checkbox";
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "selectAllCheckbox";
        checkbox.checked = this.allRowsSelected();
        checkbox.onclick = (event) => {
            this.allCheckBoxSelected(event);
        };
        var headerCell = document.createElement("div");
        headerCell.className = "checkboxHolder";

        if (this.props.showGrouping) {
            var collapser = document.createElement("span");
            collapser.className = "collapser";
            collapser.setAttribute("state", "open");
            collapser.innerHTML = gridIcons.groupExpanded;
            collapser.onclick = (event) => {
                this.onGroupsExpand(event.target);
            };
            headerCell.appendChild(collapser);
        }

        headerCell.appendChild(checkbox);
        //ag-grid doesnt seem to allow react components sent into headerCellRender.
        checkBoxCol.headerCellRenderer = function() {
            return headerCell;
        };
        checkBoxCol.checkboxSelection = true;
        checkBoxCol.headerClass = "gridHeaderCell";
        checkBoxCol.cellClass = "gridCell";
        checkBoxCol.suppressMenu = true;
        checkBoxCol.suppressResize = true;
        if (this.props.showGrouping) {
            checkBoxCol.width = this.getCheckBoxColumnGroupedHeaderWidth();
        } else {
            checkBoxCol.width = consts.DEFAULT_CHECKBOX_COL_WIDTH;
        }

        return checkBoxCol;
    },
    /**
     * Builder for record actions column for the grid.
     */
    getActionsColumn() {
        return {
            headerName: "", //for ag-grid
            field: "actions",      //for ag-grid
            columnName: "actions", //for griddle
            cellRenderer: reactCellRendererFactory(ActionsColumn),
            cellClass: "gridCell actions",
            headerClass: "gridHeaderCell",
            width: 1,
            suppressMenu: true,
            suppressResize: true
        };
    },

    /**
     * Add a couple of columns to the column definition sent through props -
     * add checkbox column to the beginning of the array and
     * add actions column to the end of the array.
     */
    getColumns() {

        if (!this.props.columns) {
            return;
        }

        let columns = this.props.columns.slice(0);

        //This should be based on perms -- something like if(this.props.allowMultiSelection)
        columns.unshift(this.getCheckBoxColumn(this.props.showGrouping));

        // Add Actions column. Put this as the last column in the grid and then make the column 1px wide so it doesnt really "show".
        // CSS takes care of positioning the content of this column over the previous columns so it looks like an overlay.

        // todo: optimize/refactor actions hover for performance
        if (columns.length > 0) {
            columns.push(this.getActionsColumn());
        }

        return columns;

    },

    getRecordsToRender() {
        let paddedRecords = this.props.records.slice(0);
        paddedRecords.push({});
        paddedRecords.push({});
        return paddedRecords;
    },

    componentDidUpdate(prevProps, prevState) {

        //console.log('did update', this.state);

    },

    render() {
        let columnDefs = this.getColumns();

        let griddleWrapperClasses = this.getSelectedRows().length ? "griddleWrapper selectedRows" : "griddleWrapper";
        return (
            <div className="reportTable">

                <div className={griddleWrapperClasses} ref="griddleWrapper">
                    <Loader loaded={!this.props.loading}>
                        {this.props.records && this.props.records.length > 0 ?
                            <div className="agGrid">
                                <AgGridReact
                                    gridOptions={this.gridOptions}
                                    // listening for events
                                    onGridReady={this.onGridReady}
                                    onRowClicked={this.onRowClicked}
                                    onSelectionChanged={this.onSelectionChanged}
                                    //onRowSelected={this.onRowSelected}

                                    // binding to array properties
                                    columnDefs={columnDefs}
                                    rowData={this.getRecordsToRender()}

                                    //default behavior properties
                                    rowSelection="multiple"
                                    enableColResize="true"
                                    groupHeaders="true"
                                    getRowHeight={this.getRowHeight}

                                    suppressRowClickSelection="true"
                                    suppressCellSelection="true"

                                    //column menus
                                    getMainMenuItems={this.getMainMenuItems}
                                    suppressMenuFilterPanel="true"
                                    suppressMenuColumnPanel="true"
                                    suppressContextMenu="true"


                                    //grouping behavior
                                    groupSelectsChildren="true"
                                    groupRowInnerRenderer={this.getGroupRowRenderer}
                                    groupUseEntireRow={this.props.showGrouping}

                                    icons={gridIcons}
                                />
                            </div> :
                            <div><I18nMessage message={'grid.no_data'}/></div>
                        }
                    </Loader>
                    { //keep empty placeholder when loading to reduce reflow of space, scrollbar changes
                        this.props.loading ? <div className="loadedContent"></div> : null
                    }
                </div>
            </div>
        );
    }
});

export default AGGrid;
