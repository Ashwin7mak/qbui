import {combineReducers} from 'redux';

import fields from './fields';
import forms from './forms';
import record from './record';
import report from './report';
import reportFieldSelectMenu from './reportFieldSelectMenu';
import search from './search';
import shell from './shell';
import featureSwitches from './featureSwitches';
import tableCreation from './tableCreation';
import tableProperties from './tableProperties';
import animation from './animation';
import embeddedReports from './embeddedReports';
import commonNavReducer from '../../../reuse/client/src/components/sideNavs/commonNavReducer';

// combine individual reducers into a single root reducer (qbui)
export default combineReducers({
    animation,
    featureSwitches,
    fields,
    forms,
    record,
    report,
    reportFieldSelectMenu,
    search,
    shell,
    tableCreation,
    embeddedReports,
    tableProperties,
    builderNav: commonNavReducer('builder')
});
