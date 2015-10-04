import React from 'react';
import Griddle from 'griddle-react';

import Logger from '../../../utils/logger';
var logger = new Logger();

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

class GriddleTable extends React.Component {
    initState(props) {

        let initialState = {
            "results": props.results,
            "maxPages": props.maxPages || 0, // this feeds into the pagination component and tells it whether there should be a "Next" available or not.
            "currentPage": props.currentPage,
            "externalResultsPerPage": props.externalResultsPerPage,
            "externalSortColumn": props.externalSortColumn,
            "externalSortAscending": props.externalSortAscending,
            "fullDataSet": []
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
    componentWillMount() {
    }

    getExternalData(page) {
        var that = this;
        page = page || 1

        this.setState({
            isLoading: true
        });

        // dont go to the server if we already have the data - the user might be paginating back and forth on already rendered results.
        if (page <= this.state.maxPages)
        {
            var newState = {
                currentPage: page - 1,
                isLoading: false,
                results: this.state.fullDataSet.slice((page-1)*this.state.externalResultsPerPage, page*this.state.externalResultsPerPage) // we always pull 1 extra record than neccesary to know if "Next" is available or not. So leave out that one extra record
            };

            that.setState(newState);
        }
        else {
            this.props.getResultsCallback(page, function (data) {
                var newState = {
                    currentPage: page - 1,
                    isLoading: false,
                    maxPages: data.results.length > that.state.externalResultsPerPage ? that.state.maxPages + 1 : that.state.maxPages,
                    results: data.results.length > that.state.externalResultsPerPage ? data.results.slice(0, data.results.length - 1) : data.results // we always pull 1 extra record than neccesary to know if "Next" is available or not. So leave out that one extra record
                };
                newState.fullDataSet = that.state.fullDataSet.concat(newState.results)

                that.setState(newState);
            });
        }
    }

    componentDidMount() {
        this.getExternalData();
    }

    //what page is currently viewed
    setPage(index) {
        //This should interact with the data source to get the page at the given index
        index = index+1;
        this.getExternalData(index);

    }

    //this will handle how the data is sorted
    sortData(sort, sortAscending, data){
    }

    //this changes whether data is sorted in ascending or descending order
    changeSort(sort, sortAscending) {
    }

    //this method handles the filtering of the data
    setFilter(filter) {
    }

    //this method handles determining the page size
    setPageSize(size) {
    }

    render() {
        /* Griddle has a bug where you have to supply the first set of data to render otherwise it will not re-render even when data is set later.
        For our purpose that first set of data should always be provided by the store. If not data has been provided then there is nothing to display.  */
        if (this.props.results.length == 0) {
            return (
                <div>Data from props (from report store):<p/> {JSON.stringify(this.props.results, null, '  ')}
                    <Griddle {...this.props}
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
        else {
            return (
                <div>Data from props (from report store):<p/> {JSON.stringify(this.props.results, null, '  ')}

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