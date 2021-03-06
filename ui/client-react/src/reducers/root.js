import {combineReducers} from 'redux';

import user from '../../../reuse/client/src/reducers/userReducer';
import app from './app';
import appBuilder from './appBuilder';
import fields from './fields';
import forms from './forms';
import qbGrid from './qbGrid';
import relationshipBuilder from './relationshipBuilder';
import record from './record';
import report from './report';
import reportBuilder from './reportBuilder';
import search from './search';
import shell from './shell';
import featureSwitches from './featureSwitches';
import tableCreation from './tableCreation';
import tableProperties from './tableProperties';
import animation from './animation';
import embeddedReports from './embeddedReports';
import commonNavReducer from '../../../reuse/client/src/components/sideNavs/commonNavReducer';
import facets from '../../../reuse/client/src/components/facets/facetMenuReducer';
import automation from './automation';
import selectedApp from './selectedApp';
import users from './users';

// combine individual reducers into a single root reducer (qbui)
export default combineReducers({
    app,
    appBuilder,
    user,
    animation,
    automation,
    featureSwitches,
    fields,
    forms,
    qbGrid,
    relationshipBuilder,
    record,
    report,
    reportBuilder,
    search,
    selectedApp,
    shell,
    tableCreation,
    embeddedReports,
    tableProperties,
    builderNav: commonNavReducer('builder'),
    facets,
    users
});
