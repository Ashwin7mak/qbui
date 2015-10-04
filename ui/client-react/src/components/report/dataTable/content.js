import React from 'react';
import ReactIntl from 'react-intl';

import { Table } from 'react-bootstrap';
import GriddleTable  from '../../../components/dataTable/griddleTable/griddleTable.js';
import { fakeGriddleData,fakeGriddleColumnMetaData } from '../../../components/dataTable/griddleTable/fakeData.js';

import '../../../assets/css/report.css';

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Content = React.createClass({
    mixins: [IntlMixin],

    getNextDataSet: function(page, callback){
        callback({results:fakeGriddleData.slice((page-1)*5,(page)*5+1)});
    },

    //Render with callback
    //
    //render: function() {
    //    var firstDataSet = fakeGriddleData.slice(0,5);
    //    return (
    //        <GriddleTable getResultsCallback={this.getNextDataSet} results={firstDataSet} columnMetadata={fakeGriddleColumnMetaData} useExternal={true}/>
    //    )
    //}

    render: function() {
        let reportColumns = this.props.data ? this.props.data.columns : [];
        let reportRecords = this.props.data ? this.props.data.records : [];

        //  todo paging..
        return (
            <GriddleTable columnMetadata={reportColumns} useExternal={true} data={reportRecords}/>
        )
    }

});

export default Content;