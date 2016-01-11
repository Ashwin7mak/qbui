import React from 'react';
import Griddle from 'griddle-react';

import {I18nMessage} from '../../../utils/i18nMessage';
import * as breakpoints from '../../../constants/breakpoints';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
//import {History} from 'react-router';
import ReportActions from '../../actions/reportActions';
import ReportHeader from '../../report/dataTable/reportHeader';
import CardView from './cardView.js';
import _ from 'lodash';

import './griddleTable.scss';
import './qbGriddleTable.scss';
/*
 * Sample component looks like  -
 * <GriddleTable results={fakeGriddleData} columnMetadata={fakeGriddleColumnMetaData} useExternal={false}/>
 * */

let GriddleTable = React.createClass({

    //mixins: [History],

    contextTypes: {
        breakpoint: React.PropTypes.string
    },

    /**
     * make row callbacks available via context since we can't pass them as props to a custom row
     * in Griddle
     */
    childContextTypes: {
        allowCardSelection: React.PropTypes.func,
        onToggleCardSelection: React.PropTypes.func,
        onRowSelected: React.PropTypes.func,
        onRowClicked: React.PropTypes.func,
        isRowSelected: React.PropTypes.func
    },
    getChildContext() {
        return {
            onToggleCardSelection: this.onToggleCardSelection,
            allowCardSelection: this.allowCardSelection,
            onRowSelected: this.onCardRowSelected,
            onRowClicked: this.onRowClicked,
            isRowSelected: this.isRowSelected
        };
    },

    getDefaultProps() {
        return {
            mobile: false,
            showFilter: false,
            showSettings: false,
            currentPage: 0,
            resultsPerPage: 1000,
            useCustomRowComponent: false,
            customRowComponent: CardView,
            customRowComponentClassName: "custom-row",
            useExternal: false, /* this should always be false for us since the store takes care of just sending the data thats to be rendered at any point in time */
            columnMetadata: [],
            reportData: {},
            metadataColumns: ["selected"],
            gridClassName: 'QBGriddle',
            useGriddleStyles: false,
            sortAscendingClassName: "Sorted",
            sortDescendingClassName: "Sorted"
        };
    },

    getInitialState() {
        return {
            selectedRows: [],
            allowCardSelection: false
        };
    },
    /**
     * since Griddle stores the selected rows in its internal state instead of just using a prop
     * and a callback, we have to extract the selection in a roundabout way through a ref and
     * ALSO give griddle a chance to process its update of the selection state before we
     * query the selection
     */
    onTableClick() {
        setTimeout(() => {
            if (this.refs.griddleTable) {
                let selectedRowIds = this.refs.griddleTable.getSelectedRowIds();
                this.setState({
                    selectedRows: selectedRowIds,
                    allowCardSelection: selectedRowIds.length > 0
                });
            }
        }, 0);
    },

    allowCardSelection() {
        return this.state.allowCardSelection;
    },

    /**
     * toggle the card selection mode
     */
    onToggleCardSelection(allow = true) {
        this.setState({allowCardSelection: allow});

        if (!allow) {
            this.setState({selectedRows: []});
        }
    },

    /**
     * report row was clicked
     * @param row data
     */
    onRowClicked(row) {

        const {appId, tblId} = this.props.reportData;
        const recId = row[this.props.uniqueIdentifier];

        const link = '/app/' + appId + '/table/' + tblId + '/record/' + recId;

        // something like this I expect, maybe in an action instead:
        // this.history.pushState(null, link);
    },

    /**
     * card row selection callback
     * @param row
     */
    onCardRowSelected(row) {

        const id = row[this.props.uniqueIdentifier];
        if (this.state.selectedRows.indexOf(id) === -1) {
            // not already selected, add to selectedRows
            this.state.selectedRows.push(row[this.props.uniqueIdentifier]);
            this.setState({selectedRows: this.state.selectedRows});
        } else {
            // already selected, remove from selectedRows
            this.setState({selectedRows: _.without(this.state.selectedRows, id)});
        }
    },

    /**
     * get table actions if we have them - render selectionActions prop if we have an active selection,
     * otherwise the reportHeader prop (cloned with extra key prop for transition group, and selected rows
     * for selectionActions component)
     */
    getTableActions() {

        return (this.props.reportHeader && this.props.selectionActions && (
            <ReactCSSTransitionGroup transitionName="tableActions" component="div" className={"tableActionsContainer"}  transitionEnterTimeout={300} transitionLeaveTimeout={300}>

                {this.state.selectedRows.length ?
                    React.cloneElement(this.props.selectionActions, {key:"selectionActions", selection: this.state.selectedRows}) :
                    React.cloneElement(this.props.reportHeader, {key:"reportHeader"})}
            </ReactCSSTransitionGroup>));
    },

    /**
     * is row selected callback
     */
    isRowSelected(row) {
        return this.state.selectedRows.indexOf(row[this.props.uniqueIdentifier]) !== -1;
    },

    render() {

        const isCardLayout = this.context.breakpoint === breakpoints.SMALL_BREAKPOINT;

        let griddleWrapperClasses = this.state.selectedRows.length ? "selectedRows" : "";

        if (this.state.allowCardSelection) {
            griddleWrapperClasses += " allowCardSelection";
        }

        let results = this.props.reportData && this.props.reportData.data ? this.props.reportData.data.filteredRecords : [];

        if (results) {

            return (
                <div className="reportTable" >

                    {this.getTableActions()}

                    <div onClick={this.onTableClick} className={griddleWrapperClasses}>
                        <Griddle {...this.props}
                            ref="griddleTable"
                            isMultipleSelection={true}
                            selectedRowIds={this.state.selectedRows}
                            uniqueIdentifier={this.props.uniqueIdentifier}
                            results={results}
                            useCustomRowComponent={isCardLayout}
                            onRowClick={this.onRowClicked}
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

export default GriddleTable;
