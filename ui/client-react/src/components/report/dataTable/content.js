import React from 'react';
import ReactIntl from 'react-intl';

//import { Table } from 'react-bootstrap';
import GriddleTable  from '../../../components/dataTable/griddleTable/griddleTable.js';
import {DateFormatter, NumericFormatter}  from '../../../components/dataTable/griddleTable/formatters.js';
import Loader  from 'react-loader';

import Locale from '../../../locales/locales';
var i18n = Locale.getI18nBundle();
var IntlMixin = ReactIntl.IntlMixin;

const resultsPerPage = 1000; //assume that this is the constant number of records per page. This can be passed in as a prop for diff reports

var Content = React.createClass({
    mixins: [IntlMixin],

    getInitialState: function() {
        return {
            reportColumns: this.props.reportData && this.props.reportData.data && this.props.reportData.data.columns ? this.getColumnProps(this.props.reportData.data.columns) : []
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var self = this;
        if (nextProps.reportData.data) {
            self.setState({
                reportColumns: nextProps.reportData.data.columns ? self.getColumnProps(nextProps.reportData.data.columns) : []
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
        var self = this;

        if (columns) {
            var columnsData = columns.map(function(obj) {
                if (obj.datatypeAttributes) {
                    var datatypeAttributes = obj.datatypeAttributes;
                    for (var attr in datatypeAttributes) {
                        switch (attr) {
                        case 'type':
                            {
                                switch (datatypeAttributes[attr]) {
                                case "NUMERIC" :
                                    self.setCSSClass_helper(obj, "AlignRight");
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
                                    self.setCSSClass_helper(obj, "Bold");
                                }
                                break;
                            case 'word-wrap':
                                if (clientSideAttributes[cattr]) {
                                    self.setCSSClass_helper(obj, "NoWrap");
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


    /* TODO: paging component that has "next and previous tied to callbacks from the store to get new data set*/
    render: function() {
        return (
            <Loader loaded={!this.props.reportData.loading}>
                {this.props.reportData.error ?
                    <div>Error loading report!</div> :
                        <div>
                            <GriddleTable {...i18n} mobile={this.props.mobile} results={this.props.reportData && this.props.reportData.data ? this.props.reportData.data.filteredRecords : []} columnMetadata={this.state.reportColumns} showPager={false} useExternal={false} resultsPerPage={resultsPerPage} externalResultsPerPage={resultsPerPage} />
                        </div>
                }
            </Loader>
        );
    }

});

export default Content;
