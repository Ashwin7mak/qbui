import React from 'react';

import GriddleTable  from '../../../components/dataTable/griddleTable/griddleTable.js';
import AGGrid  from '../../../components/dataTable/agGrid/agGrid.js';
import {reactCellRendererFactory} from 'ag-grid-react';
import {DateFormatter, NumericFormatter}  from '../../../components/dataTable/griddleTable/formatters.js';

import ReportActions from '../../actions/reportActions';

const resultsPerPage = 1000; //assume that this is the constant number of records per page. This can be passed in as a prop for diff reports

let ReportContent = React.createClass({

    getInitialState: function() {
        return {
            showSelectionColumn: false,
            reportColumns: this.props.reportData && this.props.reportData.data && this.props.reportData.data.columns ? this.getColumnProps(this.props.reportData.data.columns) : []
        };
    },

    componentWillReceiveProps: function(nextProps) {

        if (nextProps.reportData.data && this.props.reportData.data.columns !== nextProps.reportData.data.columns) {
            this.setState({
                reportColumns: nextProps.reportData.data.columns ? this.getColumnProps(nextProps.reportData.data.columns) : []
            });
        }
    },

    setCSSClass_helper: function(obj, classname) {
        //for ag-grid
        if (typeof (obj.cellClass) === 'undefined') {
            obj.cellClass = classname;
        } else {
            obj.cellClass += "," + classname;
        }
        if (typeof (obj.headerClass) === 'undefined') {
            obj.headerClass = classname;
        } else {
            obj.headerClass += "," + classname;
        }
        //for griddle
        if (typeof (obj.cssClassName) === 'undefined') {
            obj.cssClassName = classname;
        } else if (obj.cssClassName.indexOf(classname) === -1) {
            obj.cssClassName += " " + classname;
        }
    },

    /* for each field attribute that has some presentation effect convert that to a css class before passing to griddle.*/
    getColumnProps: function(columns) {
        if (!columns) {
            columns = this.props.reportData.data.columns;
        }
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
                                    obj.cellRenderer = reactCellRendererFactory(NumericFormatter);
                                    obj.customComponent = NumericFormatter;
                                    break;
                                case "DATE" :
                                    obj.cellRenderer = reactCellRendererFactory(DateFormatter);
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
                obj.suppressMenu = true;
                obj.minWidth = 100;
                return obj;
            });

            return columnsData;
        }
        return [];
    },

    /* TODO: paging component that has "next and previous tied to callbacks from the store to get new data set*/
    render: function() {
        let isTouch = this.context.touch;
        let columnsDef = this.getColumnProps();

        return (<div className="loadedContent">
                {this.props.reportData.error ?
                    <div>Error loading report!</div> :
                    <div className="reportContent">
                        {!isTouch ?
                            <AGGrid reportData={this.props.reportData}
                                    columns={columnsDef}
                                    uniqueIdentifier="Record ID#"
                                    resultsPerPage={resultsPerPage}
                                    reportHeader={this.props.reportHeader}
                                    selectionActions={<ReportActions />}
                            ></AGGrid> :
                            <GriddleTable reportData={this.props.reportData}
                                    columnMetadata={columnsDef}
                                    uniqueIdentifier="Record ID#"
                                    resultsPerPage={resultsPerPage}
                                    reportHeader={this.props.reportHeader}
                                    selectionActions={<ReportActions />}
                                    showPager={false}
                                    useExternal={false}
                                    externalResultsPerPage={resultsPerPage}
                            ></GriddleTable>
                        }
                    </div>
                }
            </div>
        );
    }

});

ReportContent.contextTypes = {
    touch: React.PropTypes.bool
};

export default ReportContent;
