import {combineReducers} from 'redux';

import fields from './fields';
import forms from './forms';
import record from './record';
import report from './report';
import search from './search';
import shell from './shell';
import featureSwitches from './featureSwitches';
import animation from './animation';
import embeddedReports from './embeddedReports';

// combine individual reducers into a single root reducer (qbui)

// maps state keys to reducers
export default combineReducers({
    animation,
    featureSwitches,
    fields,
    forms,
    record,
    report,
    search,
    shell,
    embeddedReports
});
