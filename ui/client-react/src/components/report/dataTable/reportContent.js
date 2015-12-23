import React from 'react';

import GriddleTable  from '../../../components/dataTable/griddleTable/griddleTable.js';
import {DateFormatter, NumericFormatter}  from '../../../components/dataTable/griddleTable/formatters.js';
import Loader  from 'react-loader';
import ReportActions from '../../actions/reportActions';
import ReportHeader from './reportHeader';
const resultsPerPage = 1000; //assume that this is the constant number of records per page. This can be passed in as a prop for diff reports


let ActionsColumn = React.createClass({

    render() {
        let data = this.props.rowData;

        return (<div><ReportActions /></div>);
    }
});

let ReportContent = React.createClass({

    getInitialState: function() {
        return {
            showSelectionColumn: false,
            reportColumns: this.props.reportData && this.props.reportData.data && this.props.reportData.data.columns ? this.getColumnProps(this.props.reportData.data.columns) : []
        };
    },

    componentWillReceiveProps: function(nextProps) {

        if (nextProps.reportData.data) {
            this.setState({
                reportColumns: nextProps.reportData.data.columns ? this.getColumnProps(nextProps.reportData.data.columns) : []
            });
        }
    },
    setCSSClass_helper: function(obj, classname) {
        if (typeof (obj.cssClassName) === 'undefined') {
            obj.cssClassName = classname;
        } else {
            obj.cssClassName += " " + classname;
        }
    },
    /* for each field attribute that has some presentation effect convert that to a css class before passing to griddle.*/
    getColumnProps: function(columns) {
        if (columns) {
            var columnsData = columns.map((obj) => {
                if (obj.datatypeAttributes) {
                    var datatypeAttributes = obj.datatypeAttributes;
                    for (var attr in datatypeAttributes) {
                        switch (attr) {
                        case 'type':
                            {
                                switch (datatypeAttributes[attr]) {
                                case "NUMERIC" :
                                    this.setCSSClass_helper(obj, "AlignRight");
                                    obj.customComponent = NumericFormatter;
                                    break;
                                case "DATE" :
                                    obj.customComponent = DateFormatter;
                                    break;
                                }
                            }
                        }
                    }

                    if (datatypeAttributes.clientSideAttributes) {
                        var clientSideAttributes = datatypeAttributes.clientSideAttributes;
                        for (var cattr in clientSideAttributes) {
                            switch (cattr) {
                            case 'bold':
                                if (clientSideAttributes[cattr]) {
                                    this.setCSSClass_helper(obj, "Bold");
                                }
                                break;
                            case 'word-wrap':
                                if (clientSideAttributes[cattr]) {
                                    this.setCSSClass_helper(obj, "NoWrap");
                                }
                                break;
                            }
                        }
                    }
                }
                return obj;
            });


            columnsData.push({
                columnName: "actions",
                visible:false,
                customComponent: ActionsColumn,
                cssClassName:"actions"

            });

            return columnsData;
        }
        return [];
    },

    /* TODO: paging component that has "next and previous tied to callbacks from the store to get new data set*/
    render: function() {

        return (
            <Loader loaded={!this.props.reportData.loading}>
                {this.props.reportData.error ?
                    <div>Error loading report!</div> :
                    <div>
                        <GriddleTable results={this.props.reportData && this.props.reportData.data ? this.props.reportData.data.filteredRecords : []}
                                      columnMetadata={this.state.reportColumns}
                                      uniqueIdentifier="Record ID#"
                                      showPager={false}
                                      useExternal={false}
                                      resultsPerPage={resultsPerPage}
                                      externalResultsPerPage={resultsPerPage}
                                      reportHeader={<ReportHeader/>}
                                      selectionActions={<ReportActions />}
                        />
                    </div>
                }
            </Loader>
        );
    }

});

export default ReportContent;
