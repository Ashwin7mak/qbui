import React from 'react';
import Griddle from 'griddle-react';

import PaginationComponent from './pagination.js';

import './griddleTable.css';
import './qbGriddleTable.css';


class GriddleTable extends React.Component {
    initState(props){
        let initialState = {
            "data": props.data,
            externalResultsPerPage: props.externalResultsPerPage,
            "externalSortColumn": props.externalSortColumn,
            "externalSortAscending": props.externalSortAscending
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
    }

    //what page is currently viewed
    setPage(index){
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
            <Griddle {...this.props}
                     results={this.state.data}
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
    //useFixedLayout: false,  // this isnt working right now
    showFilter: false,
    showSettings: false,
    maxPages: 0,
    currentPage: 0,
    externalResultsPerPage: 20,
    externalSortColumn: null,
    externalSortAscending: true,

    useCustomPagerComponent: true,
    customPagerComponent: PaginationComponent,

    useExternal: false, /* TODO: this should always be true for us but needs data from server */
    columnMetadata: [],
    results: []
};

export default GriddleTable;