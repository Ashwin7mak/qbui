
import React from 'react';
import ReactIntl from 'react-intl';

import Header from '../../../components/header/header';
import Stage from '../../../components/stage/stage';
import Footer from '../../../components/footer/footer';

import ReportStage from '../../../components/report/dataTable/stage';
import ReportContent from '../../../components/report/dataTable/content';

import { Locale, getI18nBundle } from '../../../locales/locales';
var i18n = getI18nBundle();
var IntlMixin = ReactIntl.IntlMixin;
var FormattedDate = ReactIntl.FormattedDate;

var CurrentDate = React.createClass({

    mixins: [IntlMixin],

    render: function() {
        return <FormattedDate locales={[Locale]} value={new Date()} day="numeric" month="long" year="numeric"/>
    }
});

var ReportStageContent = React.createClass({
    render: function() {
        return <ReportStage {...i18n}/>
    }
});

class DataTableReport extends React.Component {
    render() {
        return <div>
            <Header leftContent="Intuit QuickBase" rightContent={<CurrentDate/>}/>
            <Stage stageContent={<ReportStageContent/>}/>
            <div id="layout-content"></div>
            <Footer {...i18n} />
        </div>;
    }
};

export default DataTableReport;