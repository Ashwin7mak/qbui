import React from 'react';
import Griddle from 'griddle-react';

import {I18nMessage} from '../../../utils/i18nMessage';
import * as breakpoints from '../../../constants/breakpoints';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import ReportActions from '../../actions/reportActions';
import CardView from './cardView.js';
import LimitConstants from './../../../../../common/src/limitConstants';
import _ from 'lodash';

import './griddleTable.scss';
import './qbGriddleTable.scss';
/*
 * Sample component looks like  -
 * <GriddleTable results={fakeGriddleData} columnMetadata={fakeGriddleColumnMetaData} useExternal={false}/>
 * */

let GriddleTable = React.createClass({

    contextTypes: {
        touch: React.PropTypes.bool,
        history: React.PropTypes.object
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
            showFilter: false,
            showSettings: false,
            currentPage: 0,
            resultsPerPage: LimitConstants.resultsPerPage,
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
            allowCardSelection: false,
            toolsMenuOpen: false
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

    onToggleCardSelection(allow = true, row = null) {
        this.setState({allowCardSelection: allow});

        if (!allow) {
            this.setState({selectedRows: []});
        } else if (row) {
            this.onCardRowSelected(row);
        }
    },


    /**
     * report row was clicked
     * @param row data
     */
    onRowClicked(row) {

        const {appId, tblId} = this.props.reportData;
        var recId;

        //check to see if props exist, if they do we need to get recId from row.props.data (this is for non-custom row component clicks)
        if (row.props) {
            recId = row.props.data[this.props.uniqueIdentifier];
        } else {
            recId = row[this.props.uniqueIdentifier];
        }
        //create the link we want to send the user to and then send them on their way
        const link = '/app/' + appId + '/table/' + tblId + '/record/' + recId;
        this.context.history.push(link);

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

    onMenuEnter() {
        this.setState({toolsMenuOpen:true});
    },
    onMenuExit() {
        this.setState({toolsMenuOpen:false});
    },
    /**
     * get table actions if we have them - render selectionActions prop if we have an active selection,
     * otherwise the reportHeader prop (cloned with extra key prop for transition group, and selected rows
     * for selectionActions component)
     */
    getTableActions() {

        return (this.props.reportHeader && this.props.selectionActions && (
            <ReactCSSTransitionGroup transitionName="tableActions"
                                     component="div"
                                     className={this.state.toolsMenuOpen ? "tableActionsContainer toolsMenuOpen" : "tableActionsContainer"}
                                     transitionEnterTimeout={300}
                                     transitionLeaveTimeout={300}>

                {this.state.selectedRows.length ?
                    React.cloneElement(this.props.selectionActions, {key:"selectionActions", selection: this.state.selectedRows}) :
                    React.cloneElement(this.props.reportHeader, {key:"reportHeader", onMenuEnter:this.onMenuEnter, onMenuExit:this.onMenuExit})}
            </ReactCSSTransitionGroup>));
    },

    /**
     * is row selected callback
     */
    isRowSelected(row) {
        return this.state.selectedRows.indexOf(row[this.props.uniqueIdentifier]) !== -1;
    },

    render() {

        const isCardLayout = this.context.touch;

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
