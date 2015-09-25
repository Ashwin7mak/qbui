import React from 'react';
import { Router, Route } from 'react-router';

import DataTableReport from '../components/report/dataTable/layout';

export default (
    <Router>
        <Route path="/" component={DataTableReport} >
            <Route path="home" component={DataTableReport} />
        </Route>
    </Router>
);