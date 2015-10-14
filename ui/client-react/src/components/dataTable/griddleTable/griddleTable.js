import React from 'react';
import ReactIntl from 'react-intl';
import Griddle from 'griddle-react';

import Logger from '../../../utils/logger';
var logger = new Logger();

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

import PaginationComponent from './pagination.js';
import { fakeGriddleData } from '../../../components/dataTable/griddleTable/fakeData.js';

import './griddleTable.css';
import './qbGriddleTable.scss';

/*
 * Sample component for passing in data  -
 * <GriddleTable results={fakeGriddleData} columnMetadata={fakeGriddleColumnMetaData} useExternal={false}/>
 *
 * Sample component for fetching data from server on demand  - TODO
 * <GriddleTable getResultsCallback={callback} columnMetadata={fakeGriddleColumnMetaData} useExternal={false}/>
 * */

var I18nMessage = React.createClass({
    mixins: [IntlMixin],

    render: function() {
        return <FormattedMessage message={this.getIntlMessage(this.props.message)}/>
    }
});

class GriddleTable extends React.Component {

    initState(props) {
        let initialState = {
            "results": props.results,
            "maxPages": props.maxPages || 0, // this feeds into the pagination component and tells it whether there should be a "Next" available or not.
            "currentPage": props.currentPage,
            "externalResultsPerPage": props.externalResultsPerPage,
            "externalSortColumn": props.externalSortColumn,
            "externalSortAscending": props.externalSortAscending,
            "columnMetadata": props.columnMetadata || [],
            "fullDataSet": [],
            "useExternal": props.useExternal,
            "customPagerComponent": props.customPagerComponent
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


    /* On first time render make the following decisions:
    * Are we getting external data?
    *   If so, Is the 1st data set supplied all the data thats on the table?
    *       If so we dont need to get external data really even though that calling component thinks we do - shut of pagination
    *
    *     else set up the getExternalData callback
    * */
    componentDidMount() {
        if (this.state.useExternal && typeof (this.props.getResultsCallback) === 'function') {
            if (this.state.results)
                if (this.state.results.length > this.state.externalResultsPerPage)
                    this.getExternalData();
                else
                    this.setState({useExternal: false, customPagerComponent: null});
        }
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
         For our purpose that first set of data should always be provided by the store. If not data has been provided then there is nothing to display.
         So in case of no data sent in just render a plain and empty div */
        if (this.props.results) {
            return (
                <div>
                    <Griddle {...this.props}
                        useExternal={this.state.useExternal}
                        results={this.state.results}
                        customPagerComponent={this.state.customPagerComponent}
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
                <div><I18nMessage message={'grid.no_data'}/></div>
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

    getResultsCallback: null,
    gridClassName: 'QBGriddle',
    useGriddleStyles: false,
    sortAscendingClassName: "Sorted",
    sortDescendingClassName: "Sorted",
    //,rowHeight: 30 //TODO not working right now
};

export default GriddleTable;