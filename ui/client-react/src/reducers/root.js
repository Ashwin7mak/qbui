import {combineReducers} from 'redux';
import shell from './shell';
import forms from './forms';
import record from './record';
import report from './report';
import embeddedReports from './embeddedReports';

// combine individual reducers into a single root reducer (qbui)

// maps state keys to reducers
export default combineReducers({
    shell,
    forms,
    record,
    report,
    embeddedReports
});
