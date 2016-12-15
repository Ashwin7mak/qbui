import React from 'react';
import ReactDOM from 'react-dom';
import {AgGridReact} from 'ag-grid-react';
import {Button, Dropdown, MenuItem} from 'react-bootstrap';
import QBicon from '../../qbIcon/qbIcon';
import {reactCellRendererFactory} from 'ag-grid-react';
import {I18nMessage} from '../../../utils/i18nMessage';
import Locale from '../../../locales/locales';
import _ from 'lodash';
import Loader  from 'react-loader';
import Fluxxor from 'fluxxor';
import * as query from '../../../constants/query';
import ReportUtils from '../../../utils/reportUtils';
import durationFormatter from '../../../../../common/src/formatter/durationFormatter';
import * as SpinnerConfigurations from "../../../constants/spinnerConfigurations";

import {
    CheckBoxCellRenderer,
    CurrencyCellRenderer,
    DateCellRenderer,
    DateTimeCellRenderer,
    DurationCellRenderer,
    EmailCellRenderer,
    NumericCellRenderer,
    PercentCellRenderer,
    PhoneCellRenderer,
    RatingCellRenderer,
    SelectionColumnCheckBoxCellRenderer,
    TextCellRenderer,
    TimeCellRenderer,
    UrlCellRenderer,
    UserCellRenderer,
    TextFormulaCellRenderer,
    UrlFormulaCellRenderer,
    NumericFormulaCellRenderer,
}  from './cellRenderers';

import {GROUP_TYPE} from '../../../../../common/src/groupTypes';

import '../../../../../node_modules/ag-grid/dist/styles/ag-grid.css';
import './agGrid.scss';
import '../gridWrapper.scss';
import Logger from "../../../utils/logger";


let logger = new Logger();

const serverTypeConsts = require('../../../../../common/src/constants');

let FluxMixin = Fluxxor.FluxMixin(React);
function buildIconElement(icon) {
    return "<span class='qbIcon iconTableUISturdy-" + icon + "'></span>";
}
let gridIcons = {
    groupExpanded: buildIconElement("caret-filled-down"),
    groupContracted: buildIconElement("caret-filled-right"),
    menu: buildIconElement("caret-filled-down"),
    check: buildIconElement("check"),
    error: buildIconElement("alert")
};
let consts = {
    GROUP_HEADER_HEIGHT: 24,
    DEFAULT_HEADER_HEIGHT: 24,
    HEADER_WITH_SUB_HEIGHT: 42,
    ROW_HEIGHT: 32,
    DEFAULT_CHECKBOX_COL_WIDTH: 80,
    GROUP_ICON_PADDING: 4,
    DEFAULT_CELL_PADDING: 8,
    FONT_SIZE: 20,
    HIDDEN_LAST_ROW_HEIGHT:270 // tall enough to accommodate date pickers etc.
};

let AGGrid = React.createClass({
    mixins: [FluxMixin],
    rowHeight: consts.DEFAULT_HEADER_HEIGHT,

    propTypes: {
        primaryKeyName: React.PropTypes.string.isRequired,
        selectionActions: React.PropTypes.element,
        reportHeader: React.PropTypes.element,
        reportFooter: React.PropTypes.element,
        columns: React.PropTypes.array,
        loading: React.PropTypes.bool,
        isInlineEditOpen: React.PropTypes.bool,
        records: React.PropTypes.array,
        appUsers:React.PropTypes.array,
        appId: React.PropTypes.string,
        tblId: React.PropTypes.string,
        rptId: React.PropTypes.string,
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
            currentEditRid: null // the record id currently inline editing, null when not editing
        };
    },

    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
        this.onMenuClose();
        this.installHeaderMenus();
        this.api.setHeaderHeight(this.rowHeight);
        if (this.props.onGridReady) {
            this.props.onGridReady();
        }
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
                <MenuItem disabled><I18nMessage message="report.menu.addColumnBefore"/></MenuItem>
                <MenuItem disabled><I18nMessage message="report.menu.addColumnAfter"/></MenuItem>
                <MenuItem disabled><I18nMessage message="report.menu.hideColumn"/></MenuItem>
            </Dropdown.Menu>
        </Dropdown>);
    },

    /**
     * mount the react header menus into the dom placeholders (ag-header-cell-menu-button class)
     */
    installHeaderMenus() {
        const headers = this.refs.gridWrapper.getElementsByClassName("ag-header-cell-menu-button");
        // convert nodelist to array then iterate to render each menu
        _.map(headers, (header, index) => {
            if (header.childElementCount === 0) {
                const pullRight = index === headers.length - 1;
                ReactDOM.render(this.createHeaderMenu(index, pullRight), header);
            }
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
        switch (column.fieldDef.datatypeAttributes.type) {
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
        switch (column.fieldDef.datatypeAttributes.type) {
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
        queryParams[query.OFFSET_PARAM] = this.props.reportData && this.props.reportData.pageOffset ? this.props.reportData.pageOffset : serverTypeConsts.PAGE.DEFAULT_OFFSET;
        queryParams[query.NUMROWS_PARAM] = this.props.reportData && this.props.reportData.numRows ? this.props.reportData.numRows : serverTypeConsts.PAGE.DEFAULT_NUM_ROWS;

        flux.actions.loadDynamicReport(this.props.appId, this.props.tblId, this.props.rptId, true, this.props.filter, queryParams);
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
        let groupString = ReportUtils.getGroupString(sortFid, asc, GROUP_TYPE.TEXT.equals);

        let sortList = ReportUtils.getSortListString(this.props.sortFids);
        let sortListParam = ReportUtils.prependSortFidToList(sortList, groupString);

        let offset = this.props.reportData && this.props.reportData.pageOffset ? this.props.reportData.pageOffset : serverTypeConsts.PAGE.DEFAULT_OFFSET;
        let numRows = this.props.reportData && this.props.reportData.numRows ? this.props.reportData.numRows : serverTypeConsts.PAGE.DEFAULT_NUM_ROWS;

        let queryParams = {};
        queryParams[query.OFFSET_PARAM] = offset;
        queryParams[query.NUMROWS_PARAM] = numRows;
        queryParams[query.SORT_LIST_PARAM] = sortListParam;

        flux.actions.loadDynamicReport(this.props.appId, this.props.tblId, this.props.rptId, true, this.props.filter, queryParams);
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

    /**
     * edit the selected record in the trowser
     * @param data row record data
     */
    openRecordForEdit(data) {

        const recordId = data[this.props.primaryKeyName].value;

        const flux = this.getFlux();

        flux.actions.openRecordForEdit(recordId);
    },

    /**
     * get list of users for this app
     *
     * @returns app user objects
     */
    getAppUsers() {
        return this.props.appUsers;
    },
    /**
     * cellComponentsMounted - an hash of records and fieldcells in the record
     *  this is place to keep references to the rendered cell components so
     *  error state can be pushed to them from server request invalidation failures
     */
    cellComponentsMounted: {},
    /**
     * adds a cell component reference to the list of rendered cells
     * @param component - the mounted cellRenderer component
     * @param recId - the record id of the row
     * @param fid - the field id of the cell
     */
    onAttach(component, recId, fid) {
        if (typeof this.cellComponentsMounted[recId] === 'undefined') {
            this.cellComponentsMounted[recId] = {};
        }
        this.cellComponentsMounted[recId][fid] = component;
    },
    /**
     * removes a cell component reference to the list of rendered cells
     * also removes the record hash once there are no more mounted cells in the rec/row
     * @param recId - the record id of the row unmounted from
     * @param fid - the field id of the unmounted cell
     */
    onDetach(recId, fid) {
        if (typeof this.cellComponentsMounted[recId] !== 'undefined' &&
            typeof this.cellComponentsMounted[recId][fid] !== 'undefined') {
            delete this.cellComponentsMounted[recId][fid];
            if (Object.keys(this.cellComponentsMounted[recId]).length === 0) {
                delete this.cellComponentsMounted[recId];
            }
        }
    },

    /**
     * for each field error get it's cellRender component
     * and call onValidated to set the error state which will rerender it
     * this is needed so the whole table is not redrawn when there is an invalid
     * input in the inline edit cells in response to save to server
     * @param props - has the new editError
     */
    updateCellErrors(nextProps) {
        this.gridOptions.context.rowEditErrors = nextProps.editErrors;
        if (this.state.editingRowNode !== null && _.has(nextProps, 'editErrors.errors.length')) {
            //edit row components
            let editRowComponents = this.cellComponentsMounted[this.state.currentEditRid];

            nextProps.editErrors.errors.forEach(errorField => {
                let fieldComponent = editRowComponents[errorField.id];
                if (fieldComponent) {
                    let fieldResult = {
                        isInvalid: errorField.isInvalid,
                        invalidMessage: errorField.invalidMessage
                    };
                    fieldComponent.onValidated(fieldResult);
                }
            });

            // Need to always refreshCells so that the rowEdit actions display the most up to date validation status
            this.gridOptions.api.refreshCells([this.state.editingRowNode], ['checkbox']);
        }
    },


    // Careful about setting things in context, they do not update when the related prop updates
    componentDidMount() {
        this.gridOptions.context.flux = this.getFlux();
        this.gridOptions.context.defaultActionCallback = this.openRecordForEdit;
        this.gridOptions.context.cellTabCallback = this.onCellTab;
        this.gridOptions.context.onRecordChange = this.props.onRecordChange;
        this.gridOptions.context.onRecordAdd = this.props.onRecordAdd;
        this.gridOptions.context.onEditRecordStart = this.props.onEditRecordStart;
        this.gridOptions.context.onRecordSaveClicked = this.handleRecordSaveClicked; // does local method, then calls prop method
        this.gridOptions.context.onRecordNewBlank = this.handleRecordNewBlank; // does local method, then calls prop method
        this.gridOptions.context.onFieldChange = this.handleFieldChange;// does local method, then calls prop method
        this.gridOptions.context.onEditRecordCancel = this.handleEditRecordCancel; // does local method, then calls prop method
        this.gridOptions.context.validateFieldValue = this.handleValidateFieldValue;
        this.gridOptions.context.onRecordDelete = this.props.onRecordDelete;

        this.gridOptions.context.rowEditErrors = this.props.editErrors;
        this.gridOptions.context.primaryKeyName = this.props.primaryKeyName;
        this.gridOptions.context.onAttach = this.onAttach;
        this.gridOptions.context.onDetach = this.onDetach;
        this.gridOptions.context.getAppUsers = this.getAppUsers;
        this.gridOptions.context.saving = _.has(this.props, 'pendEdits.saving') ? this.props.pendEdits.saving : false;

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
        this.installHeaderMenus();
        if (!this.props.loading) {
            let flux = this.getFlux();
            flux.actions.measure('component-AgGrid', 'component-AgGrid start');
        }
        if (!this.props.isInlineEditOpen && prevProps.isInlineEditOpen) {
            // done saving close the edit
            this.editRow();
            logger.debug('edit completed');
        }
        // we have a new inserted row put ite.data && node.data[props.primaryKeyName]  in edit mode
        if (typeof (this.props.editingIndex) !== 'undefined') {
            let found = false;
            this.api.forEachNode((node) => {
                if (!found && node.data && node.data[this.props.primaryKeyName] && this.props.editingId === node.data[this.props.primaryKeyName].value) {
                    this.startEditRow(this.props.editingId, node);
                    found = true;
                }
            });
        }
    },

    // Performance improvement - only update the component when certain state/props change
    // Since this is a heavy component we don't want this updating all times.
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

        // if we are still editing and there are new errors
        // update the errors on the table and appropriate cells
        // WARNING: this necessary hack is to update just the cell component errors
        // instead of redrawing the whole table because AgGrid is not using real react dom diffing
        if (nextProps.isInlineEditOpen) {
            this.updateCellErrors(nextProps, this.props);
        }

        if (_.has(this.props, 'pendEdits.saving') &&
            (!_.isEqual(nextProps.pendEdits.saving, this.props.pendEdits.saving) ||
             !_.isEqual(nextProps.pendEdits.saving, this.gridOptions.context.saving))) {
            this.gridOptions.context.saving = nextProps.pendEdits.saving;
            //rerender the editRow action col only
            if (this.state.editingRowNode !== null) {
                this.gridOptions.api.refreshCells([this.state.editingRowNode], ['checkbox']);
            }
            return false;
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
        this.setState({currentEditRid: id}); // note which record is being edited used to index into cellComponentsMounted
        this.props.onEditRecordStart(id);
        this.gridOptions.context.currentEditRid = id;
        this.gridOptions.context.isInlineEditOpen = this.props.isInlineEditOpen;
        this.gridOptions.context.rowEditErrors = this.props.editErrors;
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
            target.className.indexOf("dropdown") !== -1 ||
            target.className.indexOf("iconActionButton") !== -1 ||
            target.tagName === "INPUT" ||
            target.tagName === "A" ||
            target.parentNode.tagName === "A") {
            return;
        }

        // edit row on doubleclick
        if (params.event.detail === 2) {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
            //edit a row if not already editing a row or
            //if you are editing a row but there are no pending changes start new edit
            if (!this.state.editingRowNode || !_.has(this.props, '.pendEdits.isPendingEdit') ||
                   !this.props.pendEdits.isPendingEdit) {
                this.startEditRow(params.data[this.props.primaryKeyName].value, params.node);
            }
            return;
        }
        if (this.clickTimeout) {
            // already waiting for 2nd click
            return;
        }

        this.clickTimeout = setTimeout(() => {
            // navigate to record if timeout wasn't canceled by 2nd click
            this.clickTimeout = null;
            if (this.props.onRowClick && (!this.state.editingRowNode)) {
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
        } else {
            // we stopped editing, so clear the current edit row record id
            this.setState({currentEditRid : null});
        }

        // the refresh needs the new state so refresh in the setState callback
        this.setState({editingRowNode: node}, () => {
            this.gridOptions.context.rowEditErrors = null;
            this.gridOptions.context.saving = _.has(this.props, 'pendEdits.saving') ? this.props.pendEdits.saving : false;
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
    allCheckBoxSelected(event) {
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
                if (row[this.props.primaryKeyName]) {
                    rows.push(row[this.props.primaryKeyName].value);
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

        this.props.onFieldChange(change);
    },

    handleRecordSaveClicked(id) {
        if (!this.props.onRecordSaveClicked) {
            return;
        }
        return this.props.onRecordSaveClicked(id);
    },


    handleValidateFieldValue(def, name, value, checkRequired) {
        let flux = this.getFlux();
        flux.actions.recordPendingValidateField(def, name, value, checkRequired);
    },

    handleRecordNewBlank(id) {
        this.props.onRecordNewBlank(id);
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
        //if any of the columns has a units description add that in parentheses in a new line and raise the header height
        let headerSubscript = column && column.fieldDef && column.fieldDef.datatypeAttributes && column.fieldDef.datatypeAttributes.unitsDescription ? '(' + column.fieldDef.datatypeAttributes.unitsDescription + ')' : null;
        let headerSubscriptHTML = "";

        if (headerSubscript) {
            this.rowHeight = consts.HEADER_WITH_SUB_HEIGHT;
            headerSubscriptHTML = `<span class="subHeader">${headerSubscript}</span>`;
        }

        let cell = document.createElement('div');
        cell.className = "ag-header-cell";

        cell.innerHTML = `<div class="ag-header-cell-text ">${headerName}${headerSubscriptHTML}</div>
            <span class="ag-header-icon ag-header-cell-menu-button "></span>`;

        return cell;
    },
    /* for each field attribute that has some presentation effect convert that to a css class before passing to the grid.*/
    getColumnProps() {
        let columns = this.props.columns;

        if (columns) {
            let columnsData = columns.map((obj, index) => {

                obj.headerClass = "gridHeaderCell";
                obj.headerCellTemplate = this.getHeaderCellTemplate(obj);
                obj.cellClass = "gridCell";
                obj.suppressResize = true;
                obj.minWidth = 100;

                let datatypeAttributes;
                if (_.has(obj, 'fieldDef.datatypeAttributes') &&
                    obj.fieldDef.datatypeAttributes) {
                    datatypeAttributes = obj.fieldDef.datatypeAttributes;
                }
                if (datatypeAttributes) {
                    for (let attr in datatypeAttributes) {
                        switch (attr) {

                        case 'type': {
                            switch (datatypeAttributes[attr]) {

                            case serverTypeConsts.NUMERIC :
                                obj.headerClass += " AlignRight";
                                obj.cellRenderer = reactCellRendererFactory(NumericCellRenderer);
                                break;
                            case serverTypeConsts.DATE :
                                obj.cellRenderer = reactCellRendererFactory(DateCellRenderer);
                                break;
                            case serverTypeConsts.DATE_TIME :
                                obj.cellRenderer = reactCellRendererFactory(DateTimeCellRenderer);
                                break;
                            case serverTypeConsts.TIME_OF_DAY :
                                obj.cellRenderer = reactCellRendererFactory(TimeCellRenderer);
                                break;
                            case serverTypeConsts.CHECKBOX :
                                obj.headerClass += " AlignCenter";
                                obj.cellRenderer = reactCellRendererFactory(CheckBoxCellRenderer);
                                break;
                            case serverTypeConsts.USER :
                                obj.cellRenderer = reactCellRendererFactory(UserCellRenderer);
                                break;
                            case serverTypeConsts.CURRENCY :
                                obj.headerClass += " AlignRight";
                                obj.cellRenderer = reactCellRendererFactory(CurrencyCellRenderer);
                                break;
                            case serverTypeConsts.RATING :
                                obj.headerClass += " AlignRight";
                                obj.cellRenderer = reactCellRendererFactory(RatingCellRenderer);
                                break;
                            case serverTypeConsts.PERCENT :
                                obj.headerClass += " AlignRight";
                                obj.cellRenderer = reactCellRendererFactory(PercentCellRenderer);
                                break;
                            case serverTypeConsts.DURATION :
                                if (durationFormatter.hasUnitsText(datatypeAttributes.scale)) {
                                    obj.headerClass += " AlignRight";
                                }
                                obj.cellRenderer = reactCellRendererFactory(DurationCellRenderer);
                                break;

                            case serverTypeConsts.URL :
                                obj.cellRenderer = reactCellRendererFactory(UrlCellRenderer);
                                break;

                            case serverTypeConsts.PHONE_NUMBER :
                                obj.cellRenderer = reactCellRendererFactory(PhoneCellRenderer);
                                break;

                            case serverTypeConsts.EMAIL_ADDRESS :
                                obj.cellRenderer = reactCellRendererFactory(EmailCellRenderer);
                                break;

                            case serverTypeConsts.TEXT_FORMULA :
                                obj.cellRenderer = reactCellRendererFactory(TextFormulaCellRenderer);
                                break;

                            case serverTypeConsts.NUMERIC_FORMULA :
                                obj.cellRenderer = reactCellRendererFactory(NumericFormulaCellRenderer);
                                break;

                            case serverTypeConsts.URL_FORMULA :
                                obj.cellRenderer = reactCellRendererFactory(UrlFormulaCellRenderer);
                                break;

                            default:
                                obj.cellRenderer = reactCellRendererFactory(TextCellRenderer);
                                break;
                            }
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

        return (
            <div className="reportTable">
                <div className={gridWrapperClasses} ref="gridWrapper">
                    <Loader loaded={!this.props.loading} options={SpinnerConfigurations.LARGE_BREAKPOINT_REPORT}>
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
