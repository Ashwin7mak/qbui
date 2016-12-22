import {combineReducers} from 'redux';
import nav from './nav';
import form from './form';
import formStack from './formStack';

// combine individual reducers into a single root reducer (qbui)

// maps state keys to reducers
export default combineReducers({
    nav,
    editForm: form,
    viewForms: formStack
});

