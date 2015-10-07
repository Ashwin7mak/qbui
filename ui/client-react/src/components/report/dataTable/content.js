import React from 'react';
import ReactIntl from 'react-intl';

import { Table } from 'react-bootstrap';
import GriddleTable  from '../../../components/dataTable/griddleTable/griddleTable.js';
import { fakeGriddleData,fakeGriddleColumnMetaData } from '../../../components/dataTable/griddleTable/fakeData.js';
import Loader  from 'react-loader';

import '../../../assets/css/report.css';

import Locale from '../../../locales/locales';
var i18n = Locale.getI18nBundle();
var IntlMixin = ReactIntl.IntlMixin;

const resultsPerPage = 50; //assume that this is the constant number of records per page. This can be passed in as a prop for diff reports

var Content = React.createClass({
    mixins: [IntlMixin],

    getInitialState: function() {
        return {
            reportRecords: this.props.reportData.data.records ? this.props.reportData.data.records : [],
            reportColumns: this.props.reportData.data.columns ? this.props.reportData.data.columns : [],
            firstDataSet: this.props.reportData.data.records ? this.props.reportData.data.records.slice(0, resultsPerPage+1) : []
        };
    },

    componentWillReceiveProps: function(nextProps){
        var that = this;
        if (nextProps.reportData.data) {
            that.setState({
                reportRecords: nextProps.reportData.data.records ? nextProps.reportData.data.records : [],
                reportColumns: nextProps.reportData.data.columns ? that.getColumnProps(nextProps.reportData.data.columns) : [],
                firstDataSet: nextProps.reportData.data.records ? nextProps.reportData.data.records.slice(0, resultsPerPage+1) : []
            });
        }
    },
    setCSSClass_helper: function(obj, classname){
        if (typeof (obj.cssClassName) == 'undefined')
            obj.cssClassName = classname;
        else
            obj.cssClassName += " " + classname;
    },
    /* for each field attribute that has some presentation effect convert that to a css class before passing to griddle.*/
    getColumnProps: function(columns) {
        var that = this;

        if (columns){
            var columnsData = columns.map(function(obj){
                if (obj.datatypeAttributes) {
                    var datatypeAttributes = obj.datatypeAttributes;
                    for (var attr in datatypeAttributes) {
                        switch (attr) {
                            case 'type':
                                datatypeAttributes[attr] == "NUMERIC" ? that.setCSSClass_helper(obj, "AlignRight") : null;
                                break;
                        }
                    }

                    if (datatypeAttributes.clientSideAttributes) {
                        var clientSideAttributes = datatypeAttributes.clientSideAttributes;
                        for (var attr in clientSideAttributes) {
                            switch (attr) {
                                case 'bold':
                                    clientSideAttributes[attr] == true ? that.setCSSClass_helper(obj, "Bold") : null;
                                    break;
                                case 'word-wrap':
                                    clientSideAttributes[attr] == true ? that.setCSSClass_helper(obj, "NoWrap") : null;
                                    break;
                            }
                        }
                    }
                }
                return obj;
            });
            return columnsData;
        }
        return [];
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