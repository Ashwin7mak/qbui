import {combineReducers} from 'redux';
import nav from './nav';
import forms from './forms';

// combine individual reducers into a single root reducer (qbui)

// maps state keys to reducers
export default combineReducers({
    nav,
    forms
});

