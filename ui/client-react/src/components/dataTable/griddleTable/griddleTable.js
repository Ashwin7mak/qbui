import React from 'react';
import Griddle from 'griddle-react';

import PaginationComponent from './pagination.js';

import './griddleTable.css';


class GriddleTable extends React.Component {
    initState(props){
        let initialState = {
            "data": props.data || [],
            "currentPage": props.currentPage || 0,
            "maxPages": props.maxPages || 1,
            "externalResultsPerPage": props.externalResultsPerPage || 5,
            "externalSortColumn": props.externalSortColumn || null,
            "externalSortAscending":props.externalSortAscending || true
        };
        return initialState;
    }

    constructor(...args) {
        super(...args);
        this.state = this.initState(...args);
    }

    //general lifecycle methods
    componentWillMount(){
    }

    componentDidMount(){
        this.getExternalData();
    }

    getExternalData(page){
        //TODO: fake data for now. this should go out to node layer and get the real data
        this.setState({results: this.props.data});
        console.log("in get external data");
    }

    //what page is currently viewed
    setPage(index){
        console.log("setPage to: " +  index);
    }

    //this will handle how the data is sorted
    sortData(sort, sortAscending, data){
    }

    //this changes whether data is sorted in ascending or descending order
    changeSort(sort, sortAscending){
    }

    //this method handles the filtering of the data
    setFilter(filter){
    }

    //this method handles determining the page size
    setPageSize(size){
    }

    render(){
        return (
            <Griddle useExternal={this.props.useExternal}
                     results={this.state.data}
                     // other configurable props
                     showFilter={this.props.showFilter}
                     showSettings={this.props.showSettings}
                     columnMetadata={this.props.columnMetadata}
                     useCustomPagerComponent={this.props.useCustomPagerComponent}
                     customPagerComponent={this.props.customPagerComponent}
                     //events
                     externalSetPage={this.setPage}
                     externalChangeSort={this.changeSort}
                     externalSetFilter={this.setFilter} 
                     externalSetPageSize={this.setPageSize}
                     //state variables
                     externalMaxPage={this.state.maxPages} 
                     externalCurrentPage={this.state.currentPage}  
                     resultsPerPage={this.state.externalResultsPerPage} 
                     externalSortColumn={this.state.externalSortColumn} 
                     externalSortAscending={this.state.externalSortAscending}
                />
        );
    }
}
GriddleTable.propTypes = {  };
GriddleTable.defaultProps = {
    showFilter: false,
    useExternal: false, /* TODO: this should always be true for us but needs data from server */
    showSettings: true,
    useFixedHeader: true,
    columnMetadata: [],
    results: [],
    useCustomPagerComponent: true,
    customPagerComponent: PaginationComponent
};

export default GriddleTable;