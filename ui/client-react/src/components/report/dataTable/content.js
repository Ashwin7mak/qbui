import React from 'react';
import ReactIntl from 'react-intl';

import { Table } from 'react-bootstrap';
import GriddleTable  from '../../../components/dataTable/griddleTable/griddleTable.js';
import { fakeGriddleData,fakeGriddleColumnMetaData } from '../../../components/dataTable/griddleTable/fakeData.js';
import Loader  from 'react-loader';

import '../../../assets/css/report.css';

import { Locale, getI18nBundle } from '../../../locales/locales';
var i18n = getI18nBundle();
var IntlMixin = ReactIntl.IntlMixin;

const resultsPerPage = 10; //assume that this is the constant number of records per page. This can be passed in as a prop for diff reports

var Content = React.createClass({
    mixins: [IntlMixin],

    getInitialState: function() {
        return {
            reportRecords: this.props.reportData.data.records ? this.props.reportData.data.records : [],
            reportColumns: this.props.reportData.data.columns ? this.props.reportData.data.columns : [],
            firstDataSet: this.props.reportData.data.records ? this.props.reportData.data.records.slice(0, resultsPerPage) : []
        };
    },

    componentWillReceiveProps: function(nextProps){
        if (nextProps.reportData.data) {
            this.setState({
                reportRecords: nextProps.reportData.data.records ? nextProps.reportData.data.records : [],
                reportColumns: nextProps.reportData.data.columns ? nextProps.reportData.data.columns : [],
                firstDataSet: nextProps.reportData.data.records ? nextProps.reportData.data.records.slice(0, resultsPerPage) : []
            });
        }
    },

    getNextDataSet: function(page, callback){
        var that = this;
        if (that.state.reportRecords.length > 0) {
            callback({
                results: that.state.reportRecords.slice((page - 1) * resultsPerPage, (page) * resultsPerPage + 1)
            })
        }
        else{
            callback({results: []});
        }
    },

    render: function() {
        return (
            <Loader loaded={!this.props.reportData.loading}>
                {this.props.reportData.error ?
                    <div>Error loading report!</div> :
                    <GriddleTable {...i18n} getResultsCallback={this.getNextDataSet} results={this.state.firstDataSet} columnMetadata={this.state.reportColumns} useExternal={true} externalResultsPerPage={resultsPerPage}/>}
            </Loader>
        )
    }

});

export default Content;