import {combineReducers} from 'redux';
import shell from './shell';
import forms from './forms';
import reports from './reports';
import featureSwitches from './featureSwitches';
import animation from './animation';
import keyboard from '../../../reuse/client/src/components/reKeyboardShortcuts/reKeyboardReducer';

// combine individual reducers into a single root reducer (qbui)

// maps state keys to reducers
export default combineReducers({
    animation,
    featureSwitches,
    shell,
    forms,
    reports,
    keyboard,
});

