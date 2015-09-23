
import React from 'react';

import Header from '../components/header/header';
import Stage from '../components/stage/stage';
import Footer from '../components/footer/footer';

import ReportStage from '../components/report/dataTable/stage';
import ReportContent from '../components/report/dataTable/content';

//  load the locale
var defaultLocale = document.documentElement.getAttribute('lang');
import { getLocale, ReactIntl } from '../locales/locales';

var i18n = getLocale(defaultLocale);
var IntlMixin = ReactIntl.IntlMixin;
var FormattedDate = ReactIntl.FormattedDate;

var CurrentDate = React.createClass({

    mixins: [IntlMixin],

    render: function() {
        return <FormattedDate locales={[defaultLocale]} value={new Date()} day="numeric" month="long" year="numeric"/>
    }
});

React.render(
    <div>
        <Header leftContent="Intuit QuickBase" rightContent={<CurrentDate/>}/>
        <Stage stageContent="this is the stage content text"/>
        <div id="layout-content"></div>
        <Footer {...i18n} />
    </div>, document.getElementById('content')
);

//  TODO: this doesn't feel right...maybe explicit components to support the different stage content layouts???
React.render(
    <ReportStage {...i18n}/>, document.getElementById('layout-stage-content')
);

React.render(
    <ReportContent {...i18n}/>, document.getElementById('layout-content')
);


