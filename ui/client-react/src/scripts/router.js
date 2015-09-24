
import React from 'react';
//import { Router, Route, Link } from 'react-router'

import DataTable from '../components/report/dataTable/layout';

import Nav from '../components/nav/nav';
import Fluxxor from 'fluxxor';

import ReportsStore from '../stores/ReportsStore';
import reportActions from'../actions/reportActions';

import ReportDataStore from '../stores/ReportDataStore';
import reportDataActions from'../actions/reportDataActions';

let stores = { ReportsStore: new ReportsStore(),
    ReportDataStore: new ReportDataStore()
};
let flux = new Fluxxor.Flux(stores);
flux.addActions(reportActions);
flux.addActions(reportDataActions);

flux.actions.loadReports('mydbid')


//  load the locale
import { getI18nBundle } from '../locales/locales';
var i18n = getI18nBundle();

React.render(
    <Nav flux={flux} {...i18n}/>, document.getElementById('content')
);
