import React from 'react';
import ReactIntl from 'react-intl';

import { Table } from 'react-bootstrap';
import GriddleTable  from '../../../components/dataTable/griddleTable/griddleTable.js';
import { fakeGriddleData,fakeGriddleColumnMetaData } from '../../../components/dataTable/griddleTable/fakeData.js';
import Loader  from 'react-loader';

import '../../../assets/css/report.css';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Content = React.createClass({
    mixins: [IntlMixin],

    getNextDataSet: function(page, callback){
        callback({results:this.props.data.records.slice((page-1)*5,(page)*5+1)});
    },

    //Render with callback
    /*
   render: function() {
        console.log(this.props.data);
        var firstDataSet = this.props.data.records.slice(0,5);
        return (
            <Loader loaded={!this.props.reportData.loading}>
                {this.props.reportData.error ?
                    <div>Error loading report!</div> :
                    <GriddleTable getResultsCallback={this.getNextDataSet} results={firstDataSet} columnMetadata={this.props.data.columns} useExternal={true}/>}
            </Loader>
        )
    */

    render: function() {
        let reportColumns = this.props.reportData.data ? this.props.reportData.data.columns : [];
        let reportRecords = this.props.reportData.data ? this.props.reportData.data.records : [];

        //  todo paging..
        return (
            <Loader loaded={!this.props.reportData.loading}>
                {this.props.reportData.error ?
                    <div>Error loading report!</div> :
                    <GriddleTable columnMetadata={reportColumns} useExternal={true} data={reportRecords}/>}
            </Loader>
        )
    }

});

export default Content;