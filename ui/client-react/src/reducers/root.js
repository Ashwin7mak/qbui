import {combineReducers} from 'redux';
import nav from './nav';
import form from './form';
import formStack from './formStack';

// combine individual reducers into a single root reducer (qbui)

export default combineReducers({
    nav: nav,
    editForm: form,
    viewForms: formStack
});

