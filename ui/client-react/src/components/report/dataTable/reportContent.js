import React from 'react';

import GriddleTable  from '../../../components/dataTable/griddleTable/griddleTable';
import CardViewList from '../../../components/dataTable/cardView/cardViewList';
import AGGrid  from '../../../components/dataTable/agGrid/agGrid';
import {reactCellRendererFactory} from 'ag-grid-react';
import {DateFormatter, NumericFormatter, TextFormatter}  from '../../../components/dataTable/agGrid/formatters';

import ReportActions from '../../actions/reportActions';
import Fluxxor from 'fluxxor';

let FluxMixin = Fluxxor.FluxMixin(React);

const resultsPerPage = 1000; //assume that this is the constant number of records per page. This can be passed in as a prop for diff reports

let ReportContent = React.createClass({
    mixins: [FluxMixin],

    contextTypes: {
        history: React.PropTypes.object
    },
    getInitialState: function() {
        return {
            showSelectionColumn: false
        };
    },

    setCSSClass_helper: function(obj, classname) {
        if (typeof (obj.cellClass) === 'undefined') {
            obj.cellClass = classname;
        } else {
            obj.cellClass += " " + classname;
        }
        if (typeof (obj.headerClass) === 'undefined') {
            obj.headerClass = classname;
        } else {
            obj.headerClass += " " + classname;
        }
    },

    /* for each field attribute that has some presentation effect convert that to a css class before passing to the grid.*/
    getColumnProps: function(columns) {
        if (!columns) {
            columns = this.props.reportData.data.columns;
        }


        if (columns) {
            let columnsData = columns.map((obj, index) => {
                obj.headerClass = "gridHeaderCell";
                obj.cellClass = "gridCell";
                obj.suppressResize = true;
                obj.minWidth = 100;
                obj.addEditActions = (index === 1);
                obj.openActiveRow = this.openActiveRow;

                if (obj.datatypeAttributes) {
                    var datatypeAttributes = obj.datatypeAttributes;
                    for (var attr in datatypeAttributes) {
                        switch (attr) {
                        case 'type': {
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
                            default:
                                obj.cellRenderer = reactCellRendererFactory(TextFormatter);
                                obj.customComponent = TextFormatter;
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

            return columnsData;
        }
        return [];
    },
    openActiveRow(data) {
//console.log('go');
        const appId = this.props.appId;
        const tblId = this.props.tblId;
        var recId = data[this.props.uniqueIdentifier];
        //create the link we want to send the user to and then send them on their way
        const link = `/app/${appId}/table/${tblId}/record/${recId}`;

        this.props.history.pushState(null, link);
    },

    /**
     * when we scroll the grid wrapper, hide the add record
     * icon for a bit
     */
    onScrollRecords() {
        const flux = this.getFlux();

        const createTimeout = () => {
            this.scrollTimer = setTimeout(() => {
                this.scrollTimer = null;
                flux.actions.scrollingReport(false);
            }, 1000);
        };

        if (this.scrollTimer) {
            //reset timeout
            clearTimeout(this.scrollTimer);
            createTimeout();
        } else {
            flux.actions.scrollingReport(true);
            createTimeout();
        }

    },

    /* TODO: paging component that has "next and previous tied to callbacks from the store to get new data set*/
    render: function() {
        let isTouch = this.context.touch;
        let columnsDef = this.getColumnProps();

        let recordCount = 0;
        if (this.props.reportData.data) {
            recordCount = this.props.reportData.data.filteredRecordsCount ? this.props.reportData.data.filteredRecordsCount : this.props.reportData.data.recordsCount;
        }

        return (<div className="loadedContent">
                {this.props.reportData.error ?
                    <div>Error loading report!</div> :
                    <div className="reportContent">
                        {!isTouch ?
                            <AGGrid loading={this.props.reportData.loading}
                                    records={this.props.reportData.data ? this.props.reportData.data.filteredRecords : []}
                                    columns={columnsDef}
                                    uniqueIdentifier="Record ID#"
                                    appId={this.props.reportData.appId}
                                    tblId={this.props.reportData.tblId}
                                    rptId={this.props.reportData.rptId}
                                    reportHeader={this.props.reportHeader}
                                    pageActions={this.props.pageActions}
                                    selectionActions={<ReportActions />}
                                    onScroll={this.onScrollRecords}
                                    showGrouping={this.props.reportData.data.hasGrouping}
                                    recordCount={recordCount}
                                    groupLevel={this.props.reportData.data ? this.props.reportData.data.groupLevel : 0}
                                    groupEls={this.props.reportData.data ? this.props.reportData.data.groupEls : []}
                                    sortFids={this.props.reportData.data ? this.props.reportData.data.sortFids : []}
                                    filter={{selections: this.props.reportData.selections,
                                        facet: this.props.reportData.facetExpression,
                                        search: this.props.reportData.searchStringForFiltering}} /> :
                            <CardViewList reportData={this.props.reportData}
                                uniqueIdentifier="Record ID#"
                                reportHeader={this.props.reportHeader}
                                selectionActions={<ReportActions />}
                                onScroll={this.onScrollRecords}/>
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
