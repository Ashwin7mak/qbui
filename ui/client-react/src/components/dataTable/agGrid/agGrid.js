import React from 'react';
import {I18nMessage} from '../../../utils/i18nMessage';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import ReportActions from '../../actions/reportActions';
import CardView from '../griddleTable/cardView.js';
import LimitConstants from '../../../../../common/src/limitConstants';
import _ from 'lodash';
import {AgGridReact} from 'ag-grid-react';
import '../../../../../node_modules/ag-grid/dist/styles/ag-grid.scss';
import '../../../../../node_modules/ag-grid/dist/styles/theme-fresh.scss';
import './agGrid.scss';

class AGGrid extends React.Component {

    contextTypes: {
        touch: React.PropTypes.bool,
        history: React.PropTypes.object
    }

    constructor(...args) {
        super(...args);

        this.state = {
            showGrid: true,
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
                groupExpanded: '<i class="fa fa-minus-square-o"/>',
                groupContracted: '<i class="fa fa-plus-square-o"/>',
                columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
                columnGroupClosed: '<i class="fa fa-plus-square-o"/>'
            },
            selectedRows: [],
            allowCardSelection: false,
            toolsMenuOpen: false
        };

        // the grid options are optional, because you can provide every property
        // to the grid via standard React properties. however, the react interface
        // doesn't block you from using the standard JavaScript interface if you
        // wish. Maybe you have the gridOptions stored as JSON on your server? If
        // you do, the providing the gridOptions as a standalone object is just
        // what you want!
        this.gridOptions = {
            // this is how you listen for events using gridOptions
            onModelUpdated: function() {
                console.log('event onModelUpdated received');
            }
        };
    }
    onShowGrid(show) {
        this.setState({
            showGrid: show
        });
    }

    onToggleToolPanel(event) {
        this.setState({showToolPanel: event.target.checked});
    }

    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
        this.autoSizeAll();
    }

    selectAll() {
        this.api.selectAll();
    }

    deselectAll() {
        this.api.deselectAll();
    }

    onRowClicked(event) {
        console.log('onRowClicked: ' + event.node.data);
        const {appId, tblId} = this.props.reportData;
        var recId = event.node.data[this.props.uniqueIdentifier];
        //create the link we want to send the user to and then send them on their way
        const link = '/app/' + appId + '/table/' + tblId + '/record/' + recId;
        this.context.history.push(link);
    }

    onRowSelected(event) {
        const id = event.node.data[this.props.uniqueIdentifier];
        if (this.state.selectedRows.indexOf(id) === -1) {
            // not already selected, add to selectedRows
            this.state.selectedRows.push(event.node.data[this.props.uniqueIdentifier]);
            this.setState({selectedRows: this.state.selectedRows});
        } else {
            // already selected, remove from selectedRows
            this.setState({selectedRows: _.without(this.state.selectedRows, id)});
        }
    }

    autoSizeAll() {
        var allColumnIds = [];
        this.props.reportData.data.columns.forEach(function(columnDef) {
            allColumnIds.push(columnDef.field);
        });
        this.columnApi.autoSizeColumns(allColumnIds);
    }


    /**
     * keep track of tools menu being open (need to change overflow css style)
     */
    onMenuEnter() {
        this.setState({toolsMenuOpen:true});
    }
    /**
     * keep track of tools menu being closed (need to change overflow css style)
     */
    onMenuExit() {
        this.setState({toolsMenuOpen:false});
    }
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
    }

    /**
     * is row selected callback
     */
    isRowSelected(row) {
        return this.state.selectedRows.indexOf(row[this.props.uniqueIdentifier]) !== -1;
    }
    allCheckBoxSelected() {
        if (event.currentTarget.checked) {
            this.selectAll();
            //push all ids to selectedRows
            let rowIds = [];
            this.props.reportData.data.filteredRecords.forEach((row)=>{
                rowIds.push(row[this.props.uniqueIdentifier]);
            });
        } else {
            this.deselectAll();
        }
    }

    render() {

        const isCardLayout = this.context.touch;

        let griddleWrapperClasses = this.state.selectedRows.length ? "selectedRows" : "";

        if (this.state.allowCardSelection) {
            griddleWrapperClasses += " allowCardSelection";
        }

        let rowData = this.props.reportData && this.props.reportData.data ? this.props.reportData.data.filteredRecords : [];

        if (rowData) {
            let columns = this.props.reportData.data.columns;
            let self = this;
            if (this.props.allowRowSelection) {
                //lets add a checkbox column to the columnDefs.
                columns.unshift({
                    headerCellRenderer:function() {
                        var checkAll = document.createElement('input');
                        checkAll.type = 'checkbox';
                        checkAll.onclick = function(event) {
                            self.allCheckBoxSelected(event.currentTarget.checked);
                            event.stopPropagation();
                        }
                        return checkAll;
                    },
                    checkboxSelection: true,
                    field: 'selectionField',
                    width: '32px',
                    suppressMenu: true,
                    suppressSorting: true,
                    suppressResize: true,
                    pinned: 'left'
                });
            }
            return (
                <div className="reportTable" >

                    {this.getTableActions()}
                    <div className="agGrid">
                        <AgGridReact
                            // gridOptions is optional - it's possible to provide
                            // all values as React props
                            gridOptions={this.gridOptions}

                            // listening for events
                            onGridReady={this.onGridReady.bind(this)}
                            onRowSelected={this.onRowSelected.bind(this)}
                            onRowClicked={this.onRowClicked.bind(this)}

                            // binding to an object property
                            icons={this.state.icons}

                            // binding to array properties
                            columnDefs={columns}
                            rowData={rowData}

                            // no binding, just providing harde coded strings for the properties
                            rowSelection="multiple"
                            enableColResize="true"
                            enableSorting="true"
                            enableFilter="true"
                            groupHeaders="true"
                            rowHeight="32"
                            //debug="true"

                            suppressRowClickSelection="true"
                            suppressCellSelection="true"
                            suppressSizeToFit="true"
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
}
AGGrid.defaultProps = {
    "showToolPanel": false,
    "quickFilterText": false
};
export default AGGrid;
