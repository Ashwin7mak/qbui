import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import {reactCellRendererFactory} from 'ag-grid-react';
import {I18nMessage} from '../../../utils/i18nMessage';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import ReportActions from '../../actions/reportActions';
import RecordActions from '../../actions/recordActions';
import _ from 'lodash';
import Loader  from 'react-loader';
import Fluxxor from 'fluxxor';
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
    groupExpanded: buildIconElement("caret-filled-up"),
    groupContracted: buildIconElement("caret-filled-down")
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
        tblId: React.PropTypes.string
    },
    contextTypes:{
        touch: React.PropTypes.bool,
        history: React.PropTypes.object,
        flux: React.PropTypes.object
    },

    // agGrid has a "context" param that is of type object and gets passed down to all cell renderer functions.
    // Since the external components are not in the tree hierarchy as the grid itself, and hence dont share the same react context,
    // use this "context" object to pass down such pieces to the components.
    gridOptions: {
        context :{}
    },
    getInitialState() {
        return {
            toolsMenuOpen: false,
            allRowsSelected: false
        };
    },
    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
    },

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
    getGroupRowRenderer(params) {
        let groupCellText = document.createElement("span");
        groupCellText.className = "group-header";
        groupCellText.textContent = params.data.group;
        return groupCellText;
    },
    componentDidMount() {
        this.gridOptions.context.flux = this.getFlux();
        this.gridOptions.getNodeChildDetails = this.getNodeChildDetails;
    },
    // For some reason react always thinks the component needs to be re-rendered because props have changed.
    // Analysis shows that the action column renderer is returning notEquals, event though nothing has changed.
    // Since re-render is expensive the following figures out if ALL is same and the only piece that has changed is the "actions" column then dont update.
    shouldComponentUpdate(nextProps, nextState) {
        if (!_.isEqual(nextState, this.state)) {
            return true;
        }
        if (nextProps !== this.props) {
            //iterate over props and state
            for (var property in nextProps) {
                if (nextProps.hasOwnProperty(property)) {
                    if (!this.props[property]) {
                        return true;
                    }
                    if (!_.isEqual(this.props[property], nextProps[property])) {
                        if (property === "columns") {
                            if (this.props[property].length !== nextProps[property].length) {
                                return true;
                            }
                            let prevColumns = this.props[property];
                            let nextColumns = nextProps[property];
                            for (var i = 0; i < prevColumns.length ; i++) {
                                if (!_.isEqual(prevColumns[i], nextColumns[i])) {
                                    if (prevColumns[i].field === "actions") {
                                        return false;
                                    }
                                    return true;
                                }
                            }
                        }
                        return true;
                    }
                }
            }
            return false;
        }
        return true;
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
        this.api.selectAll();
    },
    /**
     * Grid API - deselectAll "deselects" all rows.
     */
    deselectAll() {
        this.api.deselectAll();
    },
    /**
     * Capture the row-click event. Send to record view on row-click
     * @param params
     */
    onRowClicked(params) {
        //For click on group headers do nothing
        if (params.node.field === "group") {
            return;
        }

        const appId = this.props.appId;
        const tblId = this.props.tblId;
        var recId = params.data[this.props.uniqueIdentifier];
        //create the link we want to send the user to and then send them on their way
        const link = `/app/${appId}/table/${tblId}/record/${recId}`;
        this.context.history.push(link);
    },
    /**
     * Capture the row-selection/deselection change events.
     * For some reason this doesnt seem to fire on deselectAll but doesnt matter for us.
     */
    onSelectionChanged() {
        this.updateAllCheckbox();
    },

    /**
     * Helper method to flip the master checkbox if all rows are checked
     */
    updateAllCheckbox() {
        let flux = this.getFlux();
        let selectedRows = this.getSelectedRows().length;
        let allRowsSelected = flux.stores.ReportDataStore.data.filteredRecordsCount === selectedRows;
        var newState = {
            toolsMenuOpen: selectedRows > 0,
            allRowsSelected : allRowsSelected
        };
        this.setState(newState);
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
        this.updateAllCheckbox();
    },
    componentDidUpdate(prevProps, prevState) {
        //this.autoSizeAllColumns();
    },
    /**
     * keep track of tools menu being open (need to change overflow css style)
     */
    onMenuEnter() {
        this.setState({toolsMenuOpen:true});
    },
    /**
     * keep track of tools menu being closed (need to change overflow css style)
     */
    onMenuExit() {
        this.setState({toolsMenuOpen:false});
    },
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
     * get table actions if we have them - render selectionActions prop if we have an active selection,
     * otherwise the reportHeader prop (cloned with extra key prop for transition group, and selected rows
     * for selectionActions component)
     */
    getTableActions() {

        const selectedRows = this.getSelectedRows();
        const hasSelection  = selectedRows.length;

        let classes = "tableActionsContainer secondaryBar";
        if (this.state.toolsMenuOpen) {
            classes += " toolsMenuOpen";
        }
        if (hasSelection) {
            classes += " selectionActionsOpen";
        }
        return (this.props.reportHeader && this.props.selectionActions && (
            <div className={classes}>{hasSelection ?
                React.cloneElement(this.props.selectionActions, {key:"selectionActions", selection: selectedRows}) :
                React.cloneElement(this.props.reportHeader, {key:"reportHeader"/*, onMenuEnter:this.onMenuEnter, onMenuExit:this.onMenuExit*/})}
            </div>));
    },

    onGroupsExpand(element) {
        if (!element.getAttribute("state")) {
            element = element.parentElement;
        }
        if (element.getAttribute("state") === "close") {
            element.setAttribute("state", "open");
            this.api.expandAll();
        } else {
            element.setAttribute("state", "close");
            this.api.collapseAll();
        }
    },

    getCheckBoxColumn() {
        //Add checkbox column
        let checkBoxCol = {};
        checkBoxCol.field = "checkbox";
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "selectAllCheckbox";
        checkbox.checked = this.state.allRowsSelected;
        checkbox.onclick = (event) => {
            this.allCheckBoxSelected(event);
        };
        var headerCell = document.createElement("div");
        headerCell.className = "checkboxHolder";

        if (this.props.showGrouping) {
            var collapser = document.createElement("span");
            collapser.className = "collapser";
            collapser.setAttribute("state", "open");
            collapser.innerHTML = gridIcons.groupContracted;
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
            // this is a weird calculation but this is because we want the checkbox to always show based on number of grouping levels
            // for now this is being calulated as num_groups*30 + num_checkboxes*20 + 10
            let flux = this.getFlux();
            checkBoxCol.width = flux.stores.ReportDataStore.data.groupLevel * 30 + 20 + 10;
        } else {
            checkBoxCol.width = 60;
        }
        return checkBoxCol;
    },
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
        if (columns.length > 0) {
            columns.push(this.getActionsColumn());
        }
        return columns;
    },

    render() {
        let columnDefs = this.getColumns();
        let griddleWrapperClasses = this.getSelectedRows().length ? "griddleWrapper selectedRows" : "griddleWrapper";
        return (
            <div className="reportTable" >

                {this.getTableActions()}
                <div className={griddleWrapperClasses}>
                    <Loader loaded={!this.props.loading}>
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

                                    //default behavior properties
                                    rowSelection="multiple"
                                    enableColResize="true"
                                    groupHeaders="true"
                                    rowHeight="34"

                                    suppressRowClickSelection="true"
                                    suppressCellSelection="true"

                                    //grouping behavior
                                    groupSelectsChildren="true"
                                    groupUseEntireRow={this.props.showGrouping}
                                    groupRowInnerRenderer={this.getGroupRowRenderer}

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
