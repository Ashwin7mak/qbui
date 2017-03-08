import {combineReducers} from 'redux';
import shell from './shell';
import forms from './forms';
import reports from './reports';
import featureSwitches from './featureSwitches';

// combine individual reducers into a single root reducer (qbui)

// maps state keys to reducers
export default combineReducers({
    featureSwitches,
    shell,
    forms,
    reports
});

