import React from 'react';
import ReactDOM from 'react-dom';
import {AgGridReact} from 'ag-grid-react';
import {Button, Dropdown, MenuItem} from 'react-bootstrap';
import QBicon from '../../qbIcon/qbIcon';
import IconActions from '../../actions/iconActions';
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
import * as SchemaConsts from '../../../constants/schema';

import {CellRenderer, DateCellRenderer, DateTimeCellRenderer, TimeCellRenderer,
        NumericCellRenderer, DurationCellRenderer, TextCellRenderer, UserCellRenderer, CheckBoxCellRenderer,
        CurrencyCellRenderer, SelectionColumnCheckBoxCellRenderer, PercentCellRenderer, RatingCellRenderer}  from './cellRenderers';

import * as GroupTypes from '../../../constants/groupTypes';

import '../../../../../node_modules/ag-grid/dist/styles/ag-grid.css';
import './agGrid.scss';
import '../gridWrapper.scss';
import Logger from "../../../utils/logger";


let logger = new Logger();

const serverTypeConsts = require('../../../../../common/src/constants');

let FluxMixin = Fluxxor.FluxMixin(React);
function buildIconElement(icon) {
    return "<span class='qbIcon iconssturdy-" + icon + "'></span>";
}
let gridIcons = {
    groupExpanded: buildIconElement("caret-filled-down"),
    groupContracted: buildIconElement("icon_caretfilledright"),
    menu: buildIconElement("caret-filled-down"),
    check: buildIconElement("check"),
    error: buildIconElement("alert")
};
let consts = {
    GROUP_HEADER_HEIGHT: 24,
    ROW_HEIGHT: 32,
    DEFAULT_CHECKBOX_COL_WIDTH: 80,
    GROUP_ICON_PADDING: 4,
    DEFAULT_CELL_PADDING: 8,
    FONT_SIZE: 20,
    HIDDEN_LAST_ROW_HEIGHT:270 // tall enough to accommodate date pickers etc.
};

let AGGrid = React.createClass({
    mixins: [FluxMixin],
    rowHeight: 25,

    propTypes: {
        uniqueIdentifier: React.PropTypes.string,
        selectionActions: React.PropTypes.element,
        reportHeader: React.PropTypes.element,
        reportFooter: React.PropTypes.element,
        columns: React.PropTypes.array,
        loading: React.PropTypes.bool,
        isInlineEditOpen: React.PropTypes.bool,
        records: React.PropTypes.array,
        appId: React.PropTypes.string,
        tblId: React.PropTypes.string,
        validateRecord: React.PropTypes.func,
        validateFieldValue: React.PropTypes.func,
        onRowClick: React.PropTypes.func,
        onFieldChange: React.PropTypes.func,
        onRecordChange: React.PropTypes.func,
        onRecordSaveClicked: React.PropTypes.func,
        onRecordAdd: React.PropTypes.func,
        onRecordNewBlank: React.PropTypes.func,
        onEditRecordStart: React.PropTypes.func,
        onEditRecordCancel: React.PropTypes.func,
        OnRecordDelete: React.PropTypes.func
    },
    contextTypes: {
        touch: React.PropTypes.bool,
        flux: React.PropTypes.object
    },

    // agGrid has a "context" param that is of type object and gets passed down to all cell renderer functions.
    // Since the external components are not in the tree hierarchy as the grid itself, and hence dont share the same react context,
    // use this "context" object to pass down such pieces to the components.
    gridOptions: {
        context: {}
    },

    getInitialState() {
        return {
            editingRowNode: null, // which ag-grid row node object is being edited
            rowEditErrors: null // the current edit row errors found
        };
    },

    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
        this.onMenuClose();
        this.installHeaderMenus();
        this.api.setHeaderHeight(this.rowHeight);
    },

    /**
     * create a column header menu
     * @param columnIndex
     * @param pullRight position from right side to avoid clipping
     * @returns JSX column header dropdown
     */
    createHeaderMenu(columnIndex, pullRight) {

        const colDef = this.props.columns[columnIndex];

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

        return (<Dropdown bsStyle="default" noCaret id="dropdown-no-caret" pullRight={pullRight}>
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
        </Dropdown>);
    },

    /**
     * mount the react header menus into the dom placeholders (ag-header-cell-menu-button class)
     */
    installHeaderMenus() {
        const headers = this.refs.gridWrapper.getElementsByClassName("ag-header-cell-menu-button");

        // convert nodelist to array then iterate to render each menu
        Array.from(headers).map((header, index) => {
            const pullRight = index === headers.length - 1;
            ReactDOM.render(this.createHeaderMenu(index, pullRight), header);
        });
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
     * On selection of sort option from menu fire off the action to sort the data
     * @param column
     * @param asc
     * @param alreadySorted
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
     * On selection of group option from menu fire off the action to group the data
     * @param column
     * @param asc
     */
    groupReport(column, asc) {
        let flux = this.getFlux();

        //for on-the-fly grouping, forget the previous group and go with the selection but add the previous sort fids.
        let sortFid = column.id.toString();
        let groupString = ReportUtils.getGroupString(sortFid, asc, GroupTypes.GROUP_TYPE.text.equals);
        let sortList = ReportUtils.getSortListString(this.props.sortFids);
        let sortListParam = ReportUtils.prependSortFidToList(sortList, groupString);

        /** AG-grid has a bug where on re-render it doesn't call groupRenderer
         And hence doesn't render group headers.
         To get around that, on grouping rebuild the whole report
         If the report was grouped on the previous render then groupRender was already called so no need to re-load everything.
         So optimize for that case..
        */
        if (this.props.groupEls.length) {
            let queryParams = {};
            queryParams[query.SORT_LIST_PARAM] = sortListParam;
            flux.actions.getFilteredRecords(this.props.appId, this.props.tblId, this.props.rptId, {format:true}, this.props.filter, queryParams);
        } else {
            flux.actions.loadReport(this.props.appId,
                this.props.tblId,
                this.props.rptId, true, null, null, sortListParam);
        }
    },
    /**
     * AG-grid doesn't fire any events or add any classes to the column for which menu has been opened
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
                    let occurrences = _.filter(this.selectedColumnId, (column) => {
                        return column === toRemove;
                    });
                    this.selectedColumnId = this.selectedColumnId.splice(1, this.selectedColumnId.length);
                    let columnHeader = document.querySelectorAll('div.ag-header-cell[colId="' + toRemove + '"]');
                    if (occurrences.length <= 1) {
                        columnHeader[0].classList.remove("selected");
                    }
                }
            }
        });
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
        if (rowItem.data.isHiddenLastRow) {
            // in in selection mode set the height of the hidden last row to make space for date-pickers etc.
            return consts.HIDDEN_LAST_ROW_HEIGHT;
        } else if (rowItem.node.field === "group") {
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

    /**
     * add editing class to the ag-row of the edited row node
     * @param params ag row data
     */
    getRowClass(params) {
        return (params.node === this.state.editingRowNode) ? "editing" : "";
    },

    /**
     * user has tabbed out of a cell, move the edit row if necessary
     * @param colDef
     */
    onCellTab(colDef) {

        const lastColumn = this.props.columns[this.props.columns.length - 1];
        if (colDef.field === lastColumn.field) {
            // tabbed out of last column
            const currentIndex = this.state.editingRowNode.childIndex;
            const allRows = this.api.getModel().allRows;

            if (currentIndex < allRows.length - 1) {
                this.editRow(allRows[currentIndex + 1]); // edit next row
            } else if (allRows.length > 1) {
                this.editRow(allRows[0]); // on last row, edit 1st row
            }
        }
    },
    componentDidMount() {
        this.gridOptions.context.flux = this.getFlux();
        this.gridOptions.context.defaultActionCallback = this.props.onRowClick;
        this.gridOptions.context.cellTabCallback = this.onCellTab;
        this.gridOptions.context.onRecordChange = this.props.onRecordChange;
        this.gridOptions.context.onRecordAdd = this.props.onRecordAdd;
        this.gridOptions.context.onEditRecordStart = this.props.onEditRecordStart;
        this.gridOptions.context.onRecordSaveClicked = this.handleRecordSaveClicked; // does local method, then calls prop method
        this.gridOptions.context.onRecordNewBlank = this.handleRecordNewBlank; // does local method, then calls prop method
        this.gridOptions.context.onFieldChange = this.handleFieldChange;// does local method, then calls prop method
        this.gridOptions.context.onEditRecordCancel = this.handleEditRecordCancel; // does local method, then calls prop method
        this.gridOptions.context.getPendingChanges = this.props.getPendingChanges;
        this.gridOptions.context.validateRecord = this.handleValidateRecord;
        this.gridOptions.context.validateFieldValue = this.handleValidateFieldValue;
        this.gridOptions.context.onRecordDelete = this.props.onRecordDelete;

        this.gridOptions.context.keyField = this.props.keyField;
        this.gridOptions.context.uniqueIdentifier = this.props.uniqueIdentifier;
        this.gridOptions.context.rowEditErrors = this.state.rowEditErrors;

        this.gridOptions.getNodeChildDetails = this.getNodeChildDetails;
        this.gridOptions.getRowClass = this.getRowClass;

        this.refs.gridWrapper.addEventListener("scroll", this.props.onScroll);

    },

    componentWillUnmount() {
        this.refs.gridWrapper.removeEventListener("scroll", this.props.onScroll);
    },

    componentWillUpdate(nextProps) {
        if (nextProps.loading) {
            let flux = this.getFlux();
            flux.actions.mark('component-AgGrid start');
        }
    },
    componentDidUpdate(prevProps,  prevState) {
        if (!this.props.loading) {
            let flux = this.getFlux();
            flux.actions.measure('component-AgGrid', 'component-AgGrid start');
        }
        if (!this.props.isInlineEditOpen && prevProps.isInlineEditOpen) {
            // done saving close the edit
            this.editRow();
            logger.debug('edit completed');
        }
        // we have a new inserted row put it in edit mode
        if (typeof (this.props.editingIndex) !== 'undefined' && this.props.editingIndex !== null) {
            //get the node at editingIndex
            let atIndex = 0;
            this.api.forEachNode((node) => {
                if (atIndex === this.props.editingIndex + 1)  {
                    //edit the record at specified index
                    this.startEditRow(this.props.editingId, node);
                }
                atIndex++;
            });
        }
    },
    // Performance improvement - only update the component when certain state/props change
    // Since this is a heavy component we dont want this updating all times.
    shouldComponentUpdate(nextProps) {

        if (!_.isEqual(nextProps.loading, this.props.loading)) {
            return true;
        }
        if (!_.isEqual(nextProps.records, this.props.records)) {
            return true;
        }
        if (!_.isEqual(nextProps.columns, this.props.columns)) {
            return true;
        }
        if (!_.isEqual(nextProps.isInlineEditOpen, this.props.isInlineEditOpen) && !nextProps.isInlineEditOpen) {
            return true;
        }
        return false;
    },
    /**
     * Helper method to auto-resize all columns to the content's width. This is not called anywhere right now - more design is needed on sizing.
     */
    autoSizeAllColumns() {
        const allColumnIds = [];
        if (this.columnApi) {
            if (this.props.columns) {
                this.props.columns.forEach(columnDef => {
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
     * is an element inside the edit-mode grid cell?
     * @param elem
     * @returns {boolean}
     */
    isEditChild(elem) {

        let parent = elem.parentNode;
        while (parent) {
            if (parent.classList.contains("editing")) {
                return true;
            }
            if (parent.classList.contains("ag-row") || parent.classList.contains("agGrid")) {
                return false;
            }
            parent = parent.parentNode; // traverse up the DOM
        }
        return false;
    },

    startEditRow(id, node) {
        this.props.onEditRecordStart(id);
        this.editRow(node);
    },
    /**
     * Capture the row-click event. Send to record view on row-click
     * @param params
     */
    onRowClicked(params) {

        const target = params.event.target;

        if (this.isEditChild(target.parentNode)) {
            return;
        }

        //For click on group, expand/collapse the group.
        if (params.node.field === "group") {
            params.node.expanded = !params.node.expanded;
            this.api.onGroupExpandedOrCollapsed();
            return;
        }
        //For click on record action icons or input fields or links or link child elements do nothing
        if (target &&
            target.className.indexOf("qbIcon") !== -1 ||
            target.className.indexOf("iconLink") !== -1 ||
            target.tagName === "INPUT" ||
            target.tagName === "A" ||
            target.parentNode.tagName === "A") {
            return;
        }

        //Click on checkbox column should select the row instead of going to a form.
        if (params.event.target && (params.event.target.getAttribute("colid") === "checkbox")) {
            params.node.setSelected(true, true);
            return;
        }

        // edit row on doubleclick
        if (params.event.detail === 2) {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
            this.startEditRow(params.data[this.props.uniqueIdentifier].value, params.node);
            return;
        }
        if (this.clickTimeout) {
            // already waiting for 2nd click
            return;
        }

        this.clickTimeout = setTimeout(() => {
            // navigate to record if timeout wasn't canceled by 2nd click
            this.clickTimeout = null;
            if (this.props.onRowClick && (this.api.getSelectedRows().length === 0)) {
                this.props.onRowClick(params.data);
            }
        }, 500);
    },

    /**
     * put a node into editing mode
     * @param node new row node to edit, or null if not editing
     */
    editRow(node = null) {

        const currentRow = this.state.editingRowNode;
        const rowsToRefresh = [];

        if (currentRow) {
            // force grid to re-render the previously edited row
            rowsToRefresh.push(currentRow);
        }
        if (node) {
            // force grid to edit the newly edited row
            rowsToRefresh.push(node);
        }

        // the refresh needs the new state so refresh in the setState callback
        this.setState({editingRowNode: node, rowEditErrors: null}, () => {
            this.gridOptions.context.rowEditErrors = null;
            this.api.refreshRows(rowsToRefresh);
        });
    },

    /**
     * Capture the row-selection/deselection change events.
     * For some reason this doesn't seem to fire on deselectAll but doesn't matter for us.
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
     * We want to make sure if all-checkbox is clicked then the event doesn't propagate to all rows in turn.
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
            this.api.getSelectedRows().forEach(row => {
                if (row[SchemaConsts.DEFAULT_RECORD_KEY]) {
                    rows.push(row[SchemaConsts.DEFAULT_RECORD_KEY].value);
                }
            });
        }
        return rows;
    },

    handleEditRecordCancel(id) {
        if (!this.props.onEditRecordCancel) {
            return;
        }
        this.props.onEditRecordCancel(id);
        this.editRow(); // edit nothing
    },


    handleFieldChange(change) {
        if (!this.props.onFieldChange) {
            return;
        }

        // if field was in error remove error
        if (this.state.rowEditErrors && !this.state.rowEditErrors.ok) {
            // is the field being changed currently in error state if so remove error
            // and it will get re-validated on blur or save
            let found = this.state.rowEditErrors.errors.findIndex((err) => err.id === change.fid);
            if (found !== -1) {
                let newErrors = _.cloneDeep(this.state.rowEditErrors);

                // remove the error from the array of errors
                newErrors.errors.splice(found, 1);
                // was it last error? whole row is ok now
                if (newErrors.errors.length === 0) {
                    newErrors.errors = [];
                    newErrors.ok = true;
                }

                //update state, edit tool column
                this.setState({rowEditErrors: newErrors}, () => {
                    this.gridOptions.context.rowEditErrors = newErrors;
                    this.props.onFieldChange(change);
                    this.gridOptions.api.refreshCells([this.state.editingRowNode], ['checkbox']);
                });
            }
        }
        this.props.onFieldChange(change);
    },

    handleRecordSaveClicked(id) {
        if (!this.props.onRecordSaveClicked) {
            return;
        }
        let validation = this.props.onRecordSaveClicked(id);
        if (validation && !validation.ok) {
            //keep in edit and show error
            this.setState({rowEditErrors: validation}, () => {
                this.gridOptions.context.rowEditErrors = validation;
                this.gridOptions.api.refreshCells([this.state.editingRowNode], ['checkbox']);
            });
        }
    },


    handleValidateFieldValue(def, value, checkRequired) {
        let status = this.props.validateFieldValue(def, value, checkRequired);
        let origErrors = this.state.rowEditErrors;
        let newErrors;
        let found = -1;

        // find any existing error on the field
        if (this.state.rowEditErrors && !this.state.rowEditErrors.ok) {
            found = this.state.rowEditErrors.errors.findIndex((err) => err.id === status.id);
        }

        // if field was in error
        if (status.isInvalid) {
            // has exiting error update it
            if (found !== -1) {
                newErrors = _.cloneDeep(this.state.rowEditErrors);
                newErrors.errors[found] = status;
            } else {
                // add into to list of errors in the row
                newErrors = {
                    ok : false,
                    errors: []
                };
                if (this.state.rowEditErrors) {
                    _.cloneDeep(this.state.rowEditErrors);
                }
                newErrors.errors.push(status);
            }
            newErrors.ok = false;
        } else if (found !== -1) {
            // not invalid error, remove from list if its there.
            // remove the error from the array of errors
            newErrors = _.cloneDeep(this.state.rowEditErrors);
            newErrors.errors.splice(found, 1);

            // was it last one? row is ok now
            if (newErrors.errors.length === 0) {
                newErrors.errors = [];
                newErrors.ok = true;
            }
        }
        //update state
        if (newErrors !== undefined && !_.isEqual(origErrors, newErrors)) {
            this.setState({rowEditErrors: newErrors}, () => {
                this.gridOptions.context.rowEditErrors = newErrors;
                this.gridOptions.api.refreshCells([this.state.editingRowNode], ['checkbox']);
            });
        }
        return status;
    },

    handleValidateRecord() {
        if (!this.props.validateRecord) {
            return;
        }
        // in the aggrid record validate so we have
        // the current state and its node/row
        // we can just loop thru the cells and validate each
        this.props.validateRecord(arguments);
    },

    handleRecordNewBlank(id) {
        let validation = this.props.onRecordNewBlank(id);
        if (validation && !validation.ok) {
            //keep in edit and show error
            this.setState({rowEditErrors: validation}, () => {
                this.gridOptions.context.rowEditErrors = validation;
                this.api.refreshRows([this.state.editingRowNode]);
            });
        }
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
        // for now this is being calculated as num_groups*(font size + padding) + num_checkboxes*(size of checkbox + padding)
        // 3px error is because icons need to be fixed, so that'll be removed.
        const checkboxSize = 12;
        return consts.DEFAULT_CELL_PADDING +
            this.props.groupLevel * (consts.FONT_SIZE + consts.GROUP_ICON_PADDING) +
            checkboxSize + consts.DEFAULT_CELL_PADDING - 3;
    },

    /**
     * checkbox column header element
     * (also contains grouping expand/collapse icon if grouping is turned on)
     * @returns {Element} the DOM checkbox header element
     */
    getCheckBoxColumnHeader() {
        let headerCell = document.createElement("div");
        headerCell.className = "checkboxHolder";

        if (this.props.showGrouping) {
            let collapser = document.createElement("span");
            collapser.className = "collapser";
            collapser.setAttribute("state", "open");
            collapser.innerHTML = gridIcons.groupExpanded;
            collapser.onclick = (event) => {
                this.onGroupsExpand(event.target);
            };
            headerCell.appendChild(collapser);
        }

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "selectAllCheckbox";
        checkbox.checked = this.allRowsSelected();
        checkbox.onclick = this.allCheckBoxSelected;

        headerCell.appendChild(checkbox);

        return headerCell;
    },
    /**
     * Builder for "checkbox" column for the grid
     */
    getCheckBoxColumn() {
        //Add checkbox column
        let checkBoxCol = {};
        checkBoxCol.field = "checkbox";

        //ag-grid doesn't seem to allow react components sent into headerCellRender.
        checkBoxCol.headerCellRenderer = this.getCheckBoxColumnHeader;

        checkBoxCol.checkboxSelection = true;
        checkBoxCol.headerClass = "gridHeaderCell";
        checkBoxCol.cellClass = "gridCell selectionCell";
        checkBoxCol.suppressMenu = true;
        checkBoxCol.suppressResize = true;
        if (this.props.showGrouping) {
            checkBoxCol.width = Math.max(this.getCheckBoxColumnGroupedHeaderWidth(), consts.DEFAULT_CHECKBOX_COL_WIDTH);
        } else {
            checkBoxCol.width = consts.DEFAULT_CHECKBOX_COL_WIDTH;
        }
        checkBoxCol.cellRenderer = reactCellRendererFactory(SelectionColumnCheckBoxCellRenderer);
        checkBoxCol.pinned = 'left';

        return checkBoxCol;
    },

    setCSSClass_helper(obj, classname) {
        if (typeof (obj.cellClass) === 'undefined') {
            obj.cellClass = classname;
        } else {
            obj.cellClass += " " + classname;
        }
        if (typeof (obj.headerClass) === 'undefined') {
            obj.headerClass = classname;
        } else {
            obj.headerClass += " " + classname;
        }
    },

    /**
     * ag-grid template for field column headers
     * @param column
     * @returns {Element}
     */
    getHeaderCellTemplate(column) {

        let {headerName} = column;
        let headerSubscript = column.datatypeAttributes && column.datatypeAttributes.unitsDescription ? '(' + column.datatypeAttributes.unitsDescription + ')' : null;

        if (headerSubscript) {
            this.rowHeight = 42;
        }
        let cell = document.createElement('div');
        cell.className = "ag-header-cell";
        let headerSubscriptHTML = headerSubscript ? `<span class="subHeader">${headerSubscript}</span>` : "";
        cell.innerHTML = `<div class="ag-header-cell-text">${headerName}${headerSubscriptHTML}</div>
            <span class="ag-header-icon ag-header-cell-menu-button "></span>`;

        return cell;
    },
    /* for each field attribute that has some presentation effect convert that to a css class before passing to the grid.*/
    getColumnProps() {
        let columns = this.props.columns;

        if (columns) {
            let columnsData = columns.map((obj, index) => {

                let {datatypeAttributes} = obj;

                obj.headerClass = "gridHeaderCell";
                obj.headerCellTemplate = this.getHeaderCellTemplate(obj);
                obj.cellClass = "gridCell";
                obj.suppressResize = true;
                obj.minWidth = 100;

                if (datatypeAttributes) {
                    for (let attr in datatypeAttributes) {
                        switch (attr) {

                        case 'type': {
                            switch (datatypeAttributes[attr]) {

                            case serverTypeConsts.NUMERIC:
                                obj.cellRenderer = reactCellRendererFactory(NumericCellRenderer);
                                break;
                            case serverTypeConsts.DATE :
                                obj.cellRenderer = reactCellRendererFactory(DateCellRenderer);
                                break;
                            case serverTypeConsts.DATE_TIME:
                                obj.cellRenderer = reactCellRendererFactory(DateTimeCellRenderer);
                                break;
                            case serverTypeConsts.TIME_OF_DAY :
                                obj.cellRenderer = reactCellRendererFactory(TimeCellRenderer);
                                break;
                            case serverTypeConsts.CHECKBOX :
                                obj.cellRenderer = reactCellRendererFactory(CheckBoxCellRenderer);
                                break;
                            case serverTypeConsts.USER :
                                obj.cellRenderer = reactCellRendererFactory(UserCellRenderer);
                                break;
                            case serverTypeConsts.CURRENCY :
                                obj.cellRenderer = reactCellRendererFactory(CurrencyCellRenderer);
                                break;
                            case serverTypeConsts.RATING :
                                obj.cellRenderer = reactCellRendererFactory(RatingCellRenderer);
                                break;
                            case serverTypeConsts.PERCENT :
                                obj.cellRenderer = reactCellRendererFactory(PercentCellRenderer);
                                break;
                            case serverTypeConsts.DURATION :
                                obj.cellRenderer = reactCellRendererFactory(DurationCellRenderer);
                                break;
                            default:
                                obj.cellRenderer = reactCellRendererFactory(TextCellRenderer);
                                break;
                            }
                        }
                        }
                    }

                    // todo: this really be be done in the cell renderers instead
                    if (datatypeAttributes.clientSideAttributes) {
                        let clientSideAttributes = datatypeAttributes.clientSideAttributes;
                        for (let cattr in clientSideAttributes) {
                            switch (cattr) {
                            case 'word_wrap':
                                if (clientSideAttributes[cattr]) {
                                    this.setCSSClass_helper(obj, "NoWrap");
                                }
                                break;
                            }
                        }
                    }
                }
                return obj;
            });
            return columnsData;
        }
        return [];
    },
    /**
     * Add a couple of columns to the column definition sent through props -
     * add checkbox column to the beginning of the array and
     * add actions column to the end of the array.
     */
    getColumns() {
        let columnProps = this.getColumnProps();

        let columns = columnProps.slice(0);

        //This should be based on perms -- something like if(this.props.allowMultiSelection)
        columns.unshift(this.getCheckBoxColumn(this.props.showGrouping));

        return columns;
    },
    render() {
        let columnDefs = this.getColumns();
        let gridWrapperClasses = this.getSelectedRows().length ? "gridWrapper selectedRows" : "gridWrapper";

        // TODO Code hygiene, set up loader options as an external constant. https://quickbase.atlassian.net/browse/MB-503
        var loaderOptions = {
            lines: 9,
            length: 0,
            width: 11,
            radius: 18,
            scale: 1,
            corners: 1,
            color: '#000',
            opacity: 0,
            rotate: 0,
            direction: 1,
            speed: 1,
            trail: 60,
            fps: 20,
            zIndex: 2e9,
            className: 'spinner',
            top: '50%',
            left: '50%',
            shadow: false,
            hwaccel: false,
            position: 'absolute'
        };
        return (
            <div className="reportTable">
                <div className={gridWrapperClasses} ref="gridWrapper">
                    <Loader loaded={!this.props.loading} options={loaderOptions}>
                        {this.props.records && this.props.records.length > 0 ?
                            <div className="agGrid">
                                <AgGridReact
                                    gridOptions={this.gridOptions}
                                    // listening for events
                                    onGridReady={this.onGridReady}
                                    onRowClicked={this.onRowClicked}
                                    onSelectionChanged={this.onSelectionChanged}

                                    // binding to array properties
                                    columnDefs={columnDefs}
                                    rowData={this.props.records}
                                    //handlers on col or row changes
                                    onFieldChange={this.handleFieldChange}
                                    onRecordChange={this.props.onRecordChange}
                                    onRecordSaveClicked={this.handleRecordSaveClicked}
                                    onRecordAdd={this.props.onRecordAdd}
                                    onRecordNewBlank={this.props.onRecordNewBlank}
                                    validateRecord={this.props.validateRecord}
                                    validateFieldValue={this.handleValidateFieldValue}
                                    onEditRecordStart={this.props.onEditRecordStart}
                                    onEditRecordCancel={this.handleEditRecordCancel}
                                    onRecordDelete={this.props.onRecordDelete}

                                    //default behavior properties
                                    rowSelection="multiple"
                                    enableColResize="true"
                                    groupHeaders="true"
                                    getRowHeight={this.getRowHeight}

                                    suppressRowClickSelection="true"
                                    suppressCellSelection="true"

                                    //column menus
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
