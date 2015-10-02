import React from 'react';
import Griddle from 'griddle-react';

import PaginationComponent from './pagination.js';
import { fakeGriddleData } from '../../../components/dataTable/griddleTable/fakeData.js';

import './griddleTable.css';
import './qbGriddleTable.css';

/*
 * Sample component for passing in data  -
 * <GriddleTable results={fakeGriddleData} columnMetadata={fakeGriddleColumnMetaData} useExternal={false}/>
 *
 * Sample component for fetching data from server on demand  - TODO
 * <GriddleTable getResultsCallback={callback} columnMetadata={fakeGriddleColumnMetaData} useExternal={false}/>
 * */

var setDefault = function(original, value){
    return typeof original === 'undefined' ? value : original;
}
class GriddleTable extends React.Component {
    initState(props){

        let initialState = {
            "results": props.results,
            "maxPages": props.maxPages || 0,
            "currentPage": props.currentPage,
            "externalResultsPerPage": props.externalResultsPerPage,
            "externalSortColumn": props.externalSortColumn,
            "externalSortAscending": props.externalSortAscending
        };

        return initialState;
    }

    constructor(...args) {
    super(...args);
        this.state = this.initState(...args);
        this.setPage = this.setPage.bind(this);
        this.getExternalData = this.getExternalData.bind(this);
    }

    //general lifecycle methods
    componentWillMount(){
    }

    getExternalData(page){
        var that = this;
        page = page||1

        this.setState({
            isLoading: true
        });

        this.props.getResultsCallback(page, function (data) {
            var newState = {
                currentPage: page-1,
                isLoading:false,
                results: data.results,
                maxPages: (data.count /that.state.externalResultsPerPage) //+ 1 //need +1 for 1st data set that came in with props
            };

            that.setState(newState);
        });
    }

    componentDidMount(){
        this.getExternalData();
    }

    //what page is currently viewed
    setPage(index){
        //This should interact with the data source to get the page at the given index
        index = index > this.state.maxPages ? this.state.maxPages : index < 1 ? 1 : index + 1;
        this.getExternalData(index);

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
            <div>Data from props (from report store):<p/> {JSON.stringify(this.props.results,null,'  ')}
            <Griddle {...this.props}
                results={this.state.results}
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
        </div>
        );
    }
}
GriddleTable.propTypes = {  };
GriddleTable.defaultProps = {
    //useFixedLayout: false,  // this isnt working right now
    showFilter: false,
    showSettings: false,
    currentPage: 0,
    externalResultsPerPage: 5,
    externalSortColumn: null,
    externalSortAscending: true,

    useCustomPagerComponent: true,
    customPagerComponent: PaginationComponent,

    useExternal: true, /* TODO: this should always be true for us but needs data from server */
    columnMetadata: [],
    results: [],

    getResultsCallback: null
};

export default GriddleTable;