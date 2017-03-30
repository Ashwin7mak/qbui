import {combineReducers} from 'redux';

import fields from './fields';
import forms from './forms';
import record from './record';
import report from './report';
import search from './search';
import shell from './shell';
import featureSwitches from './featureSwitches';
import tableCreation from './tableCreation';
import animation from './animation';

// combine individual reducers into a single root reducer (qbui)
export default combineReducers({
    animation,
    featureSwitches,
    fields,
    forms,
    record,
    report,
    search,
    shell,
    tableCreation
});

