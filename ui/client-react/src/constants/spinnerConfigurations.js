/**
 * This file contains the configurations used for the 'loading' spinner.
 */
import _ from 'lodash';
import {darkForWhiteBackground, lightForDarkBackground, paleForPaleBackground} from './colors';

let spinnerZindex = 2e9;

const BASE_SPINNER = {
    //http://spin.js.org/#?lines=7&length=0&width=16&radius=17&scale=1.00&corners=1.0&opacity=0&rotate=0&direction=1&speed=1.0&trail=60&top=50&left=50
    lines: 7,
    length:0,
    width: 16,
    radius: 17,
    scale: 1.0,
    corners: 1.0,
    opacity: 0,
    rotate: 0,
    direction: 1,
    speed: 1.5,
    trail: 60,
    fps: 20,
    zIndex: spinnerZindex,
    color:darkForWhiteBackground,
    className: 'spinner',
    shadow: false,
    hwaccel: false,
    position: 'relative'
};

const LARGE_RELATIVE_SPINNER = BASE_SPINNER;

const LARGE_ABSOLUTE_CENTERED_SPINNER =  _.merge({}, BASE_SPINNER, {
    top: '50%',
    left: '50%',
    position: 'absolute'
});

// Used in small icon places
export const SMALL_SPINNER =  _.merge({}, BASE_SPINNER, {
    scale : 0.28,
    top: '54%',
    left: '33%',
    position: 'absolute'
});

export const SMALL_PALE_SPINNER =  _.merge({}, SMALL_SPINNER, {
    color:paleForPaleBackground
});

export const LARGE_RELATIVE_LIGHT_SPINNER = _.merge({}, LARGE_RELATIVE_SPINNER, {
    color:lightForDarkBackground
});

//---------------------------------------------------------------------
// USAGE in Loader Components
// use one of these below or add a new semantic one below
// based on above definitions and override
//-----------------------------------

// Used in AgGrid when refreshing the full report, for large breakpoint.
export const LARGE_BREAKPOINT_REPORT = LARGE_ABSOLUTE_CENTERED_SPINNER;
export const LARGE_BREAKPOINT_FORM = LARGE_ABSOLUTE_CENTERED_SPINNER;

// Used in the left navbar when apps or tables are loading
export const LEFT_NAV_BAR =  LARGE_RELATIVE_LIGHT_SPINNER;

// Used in the trowser content loading
export const TROWSER_CONTENT =  LARGE_RELATIVE_SPINNER;

// Used in card view when refreshing the full report, for large breakpoint.
export const CARD_VIEW_REPORT = LARGE_RELATIVE_SPINNER;

// Used in records count is not initially available very large datasets
export const RECORD_COUNT = SMALL_SPINNER;

// Used in records count is not initially available very large datasets
export const INLINE_SAVING = SMALL_SPINNER;

// Use on next swipe area in CARD_VIEW
export const CARD_VIEW_NAVIGATION =  SMALL_PALE_SPINNER;


