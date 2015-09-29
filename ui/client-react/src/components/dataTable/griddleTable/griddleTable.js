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

var serverData = fakeGriddleData;

class GriddleTable extends React.Component {
    initState(props){
        let initialState = {
            "results": props.results,
            "maxPages": props.maxPages || 0,
            "currentPage": props.currentPage,
            "externalResultsPerPage": props.externalResultsPerPage,
            "externalSortColumn": props.externalSortColumn,
            "externalSortAscending": props.externalSortAscending,
            "externalData": serverData
        };

        return initialState;
    }

    constructor(...args) {
        super(...args);
        this.state = this.initState(...args);
        this.setPage = this.setPage.bind(this);
    }

    //general lifecycle methods
    componentWillMount(){
        if (this.props.useExternal) {
            if (!typeof(this.props.getResultsCallback) === 'function') {
                console.log("No data source defined for lazy loading");
            }
            else {
                this.setState({
                    //TODO: "externalData": this.props.getResultsCallback(),
                    "maxPages": Math.round(this.state.externalData.length / this.state.externalResultsPerPage),
                    "results": this.state.externalData.slice(0, this.state.externalResultsPerPage)
                });
            }
        }
        else{
            this.setState({
                "maxPages": Math.round(this.state.results.length / this.state.externalResultsPerPage)
            });
        }
    }

    componentDidMount(){

    }


    //what page is currently viewed
    setPage(index){
        //This should interact with the data source to get the page at the given index
        var number = index === 0 ? 0 : index * this.state.externalResultsPerPage;
        this.setState(
            {
                "results": this.state.externalData.slice(number, number+this.state.externalResultsPerPage>this.state.externalData.length ? this.state.externalData.length : number+this.state.externalResultsPerPage),
                "currentPage": index
            });
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

    useExternal: false, /* TODO: this should always be true for us but needs data from server */
    columnMetadata: [],
    results: [],

    getResultsCallback: null
};

export default GriddleTable;