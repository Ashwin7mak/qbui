
import React from 'react';

import Header from '../../../components/header/header';
import Stage from '../../../components/stage/stage';
import Footer from '../../../components/footer/footer';

import ReportStage from '../../../components/report/dataTable/stage';
import ReportContent from '../../../components/report/dataTable/content';

var defaultLocale = document.documentElement.getAttribute('lang');
import { getLocale, ReactIntl } from '../../../locales/locales.js';
var FormattedDate = ReactIntl.FormattedDate;
var i18n = getLocale(defaultLocale);
var IntlMixin = ReactIntl.IntlMixin;

var CurrentDate = React.createClass({

    mixins: [IntlMixin],

    render: function() {
        return <FormattedDate locales={[defaultLocale]} value={new Date()} day="numeric" month="long" year="numeric"/>
    }
});

var ReportStageContent = React.createClass({
    render: function() {
        return <ReportStage {...i18n}/>
    }
});

class DataTable extends React.Component {
    render() {
        return <div>
            <Header leftContent="Intuit QuickBase" rightContent={<CurrentDate/>}/>
            <Stage stageContent={<ReportStageContent/>}/>
            <div id="layout-content"></div>
            <Footer {...i18n} />
        </div>;
    }
};

export default DataTable;