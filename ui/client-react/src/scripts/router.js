
import React from 'react';
import { Router, Route } from 'react-router';
import DataTableReport from '../components/report/dataTable/layout';
//import Routes from './routes';

//  load the locale


const Report = React.createClass({
    render() {
        return <div><h1>Some report</h1></div>
    }
});

const routes = {
    path: '/',
    component: DataTableReport,
    childRoutes: [
        { path: 'report', component: Report }
    ]
};



React.render(
    <Router routes={routes} />, document.getElementById('content')
);

//React.render(
//    <DataTableReport {...i18n}/>, document.getElementById('content')
//);