
import React from 'react';
//import { Router, Route, Link } from 'react-router'

import DataTableReport from '../components/report/dataTable/layout';

//  load the locale
var defaultLocale = document.documentElement.getAttribute('lang');
import { getLocale } from '../locales/locales.js';

var i18n = getLocale(defaultLocale);

React.render(
    <DataTableReport {...i18n}/>, document.getElementById('content')
);