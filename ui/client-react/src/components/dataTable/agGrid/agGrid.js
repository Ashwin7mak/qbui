import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import {reactCellRendererFactory} from 'ag-grid-react';
import {I18nMessage} from '../../../utils/i18nMessage';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import ReportActions from '../../actions/reportActions';
import LimitConstants from '../../../../../common/src/limitConstants';
import _ from 'lodash';
import '../../../../../node_modules/ag-grid/dist/styles/ag-grid.css';
import './agGrid.scss';

let AllSelector = React.createClass({

    render() {
        return <div>test</div>;
    }
});

let AGGrid = React.createClass({

    contextTypes:{
        touch: React.PropTypes.bool,
        history: React.PropTypes.object
    },

    getInitialState() {
        return {
            selectedRows: [],
            toolsMenuOpen: false,
            selectAllClicked: false
        };
    },

    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
        //this.autoSizeAllColumns();
    },

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState !== this.state) {
            return true;
        }
        if (nextProps !== this.props) {
            //iterate over props and state
            for (var property in nextProps) {
                if (nextProps.hasOwnProperty(property)) {
                    if (!this.props[property]) {
                        return true;
                    } else if (!_.isEqual(this.props[property], nextProps[property])) {
                        if (property === "columns") {
                            if (this.props[property].length !== nextProps[property].length) {
                                return true;
                            } else {
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
     * Helper method to auto-resize all columns to the content's width. This is called on load.
     */
    autoSizeAllColumns() {
        var allColumnIds = [];
        if (this.props.columns) {
            this.props.columns.forEach(function(columnDef) {
                allColumnIds.push(columnDef.field);
            });
            this.columnApi.autoSizeColumns(allColumnIds);
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
     * @param event
     */
    onRowClicked(event) {
        const {appId, tblId} = this.props.reportData;
        var recId = event.node.data[this.props.uniqueIdentifier];
        //create the link we want to send the user to and then send them on their way
        const link = '/app/' + appId + '/table/' + tblId + '/record/' + recId;
        this.context.history.push(link);
    },

    /**
     * Capture the row-select (via checkbox) event.
     * @param event
     */
    onRowSelected(event) {
        if (this.state.selectAllClicked) {
            return;
        }
        const id = event.node.data[this.props.uniqueIdentifier];
        if (this.state.selectedRows.indexOf(id) === -1) {
            // not already selected, add to selectedRows
            this.state.selectedRows.push(event.node.data[this.props.uniqueIdentifier]);
            this.setState({selectedRows: this.state.selectedRows});
        } else {
            // already selected, remove from selectedRows
            this.setState({selectedRows: _.without(this.state.selectedRows, id)});
        }
        this.updateAllCheckbox();
    },
    /**
     * is row selected callback
     */
    isRowSelected(row) {
        return this.state.selectedRows.indexOf(row[this.props.uniqueIdentifier]) !== -1;
    },

    updateAllCheckbox() {
        if (this.props.reportData.data.filteredRecords.length === this.state.selectedRows.length) {
            document.getElementsByClassName("SelectAllCheckbox")[0].checked = true;
        } else {
            document.getElementsByClassName("SelectAllCheckbox")[0].checked = false;
        }
    },
    /**
     * Capture the event if all-select checkbox is clicked.
     * We want to make sure if all-checkbox is clicked then the event doesnt propagate to all rows in turn.
     * Use selectAllClicked state variable to keep track of this.
     */
    allCheckBoxSelected() {
        this.setState({selectAllClicked: true});
        if (event.currentTarget.checked) {
            this.selectAll();
            //push all ids to selectedRows
            let rowIds = [];
            this.props.reportData.data.filteredRecords.forEach((row)=>{
                rowIds.push(row[this.props.uniqueIdentifier]);
            });
            this.setState({selectedRows: rowIds});
        } else {
            this.deselectAll();
            this.setState({selectedRows: []});
        }
        this.updateAllCheckbox();
    },
    // After the component is updated turn off selectAllClicked variable's state.
    // TODO: Better way to do this?
    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectAllClicked) {
            this.setState({selectAllClicked: false});
        }
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
    /**
     * get table actions if we have them - render selectionActions prop if we have an active selection,
     * otherwise the reportHeader prop (cloned with extra key prop for transition group, and selected rows
     * for selectionActions component)
     */
    getTableActions() {

        const hasSelection  = this.state.selectedRows.length;

        let classes = "tableActionsContainer secondaryBar";
        if (this.state.toolsMenuOpen) {
            classes += " toolsMenuOpen";
        }
        if (hasSelection) {
            classes += " selectionActionsOpen";
        }
        return (this.props.reportHeader && this.props.selectionActions && (
            <div className={classes}>{hasSelection ?
                React.cloneElement(this.props.selectionActions, {key:"selectionActions", selection: this.state.selectedRows}) :
                React.cloneElement(this.props.reportHeader, {key:"reportHeader", onMenuEnter:this.onMenuEnter, onMenuExit:this.onMenuExit})}
            </div>));
    },

    getColumns() {
        let columns = this.props.columns.slice(0);
        let self = this;
        let checkBoxCol = {};
        checkBoxCol.field = "checkbox";
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "SelectAllCheckbox";
        checkbox.onclick = function(event) {
            self.allCheckBoxSelected(event);
        };
        checkBoxCol.headerCellRenderer = function() {
            return checkbox;
        };
        //checkBoxCol.headerCellTemplate = reactCellRendererFactory(AllSelector);
        checkBoxCol.checkboxSelection = true;
        checkBoxCol.width = 30;
        columns.unshift(checkBoxCol);
        return columns;
    },

    render() {
        if (this.props.reportData.data.filteredRecords) {
            let columnDefs = this.getColumns();
            return (
                <div className="reportTable" >

                    {this.getTableActions()}
                    <div className="agGrid">
                        <AgGridReact
                            gridOptions={this.gridOptions}

                            // listening for events
                            onGridReady={this.onGridReady}
                            onRowSelected={this.onRowSelected}
                            onRowClicked={this.onRowClicked}


                            // binding to array properties
                            columnDefs={columnDefs}
                            rowData={this.props.reportData.data.filteredRecords}

                            //default behavior properties
                            rowSelection="multiple"
                            enableColResize="true"
                            groupHeaders="true"
                            rowHeight="32"

                            suppressRowClickSelection="true"
                            suppressCellSelection="true"
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div><I18nMessage message={'grid.no_data'}/></div>
            );
        }
    }
});

export default AGGrid;
