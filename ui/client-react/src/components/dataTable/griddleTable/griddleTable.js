import React from 'react';
import Griddle from 'griddle-react';

import {I18nMessage} from '../../../utils/i18nMessage';
import * as breakpoints from '../../../constants/breakpoints';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

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

class GriddleTable extends React.Component {

    constructor(...args) {
        super(...args);

        this.state = {
            selectedRows: [],
            allowCardSelection: false
        };

        this.onTableClick = this.onTableClick.bind(this);
        this.onCardRowPressed = this.onCardRowPressed.bind(this);
        this.onCardRowSelected = this.onCardRowSelected.bind(this);
        this.getTableActions = this.getTableActions.bind(this);
    }

    /**
     * since Griddle stores the selected rows in its internal state instead of just using a prop
     * and a callback, we have to extract the selection in a roundabout way through a ref and
     * ALSO give griddle a chance to process its update of the selection state before we
     * query the selection
     */
    onTableClick() {
        setTimeout(() => {
            this.setState({selectedRows: this.refs.griddleTable.getSelectedRowIds()});
        }, 0);
    }

    /**
     * toggle the card selection mode
     */
    onCardRowPressed(row) {
        this.setState({allowCardSelection: !this.state.allowCardSelection});

        if (!this.state.allowCardSelection) {
            this.setState({selectedRows: []});
        }
    }

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
    }

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
    }

    render() {

        const isCardLayout = this.context.breakpoint === breakpoints.SMALL_BREAKPOINT;

        let griddleWrapperClasses = this.state.selectedRows.length ? "selectedRows" : "";

        if (this.state.allowCardSelection) {
            griddleWrapperClasses += " allowCardSelection";
        }
        if (this.props.results) {
            // unfortunately Griddle passes only a row data prop to our custom component (i.e. can't pass in a shared prop)
            // so we need store our callbacks in the row data...

            this.props.results.forEach((result) => {
                result.onRowPressed = this.onCardRowPressed;
                result.onRowSelected = this.onCardRowSelected;
                result.selected = this.state.selectedRows.indexOf(result[this.props.uniqueIdentifier]) !== -1;
            });

            return (
                <div className="reportTable" >

                    {this.getTableActions()}

                    <div onClick={this.onTableClick} className={griddleWrapperClasses}>
                        <Griddle {...this.props}
                            ref="griddleTable"
                            isMultipleSelection={true}
                            selectedRowIds={this.state.selectedRows}
                            uniqueIdentifier={this.props.uniqueIdentifier}
                            results={this.props.results}
                            useCustomRowComponent={isCardLayout}
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
GriddleTable.contextTypes = {
    breakpoint: React.PropTypes.string
};

GriddleTable.propTypes = {  };
GriddleTable.defaultProps = {
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
    results: [],
    metadataColumns: ["onRowSelected", "onRowPressed"],
    gridClassName: 'QBGriddle',
    useGriddleStyles: false,
    sortAscendingClassName: "Sorted",
    sortDescendingClassName: "Sorted"
};

export default GriddleTable;
