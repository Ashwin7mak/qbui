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

    getData: function(){
      return fakeGriddleData;
    },
    render: function() {
        return (
            <GriddleTable getResultsCallback={this.getData} columnMetadata={fakeGriddleColumnMetaData} useExternal={true}/>
        )
    }
})

export default Content;