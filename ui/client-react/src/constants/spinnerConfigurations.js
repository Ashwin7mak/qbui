/**
 * This file contains the configurations used for the 'loading' spinner.
 */
import _ from 'lodash';

//TODO  need a way to share scss vars in js
let colorBlue500 = '#7090ab';
let colorBlack100 = '#ffffff';
let spinnerZindex = 2e9

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
    speed: 1.0,
    trail: 60,
    fps: 20,
    zIndex: spinnerZindex,
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
}
);

// Used in small icon places
export const SMALL_SPINNER =  _.merge({}, BASE_SPINNER, {
    scale : 0.28,
    top: '54%',
    left: '33%',
    position: 'absolute'
}
);

// Used in AgGrid when refreshing the full report, for large breakpoint.
export const LARGE_BREAKPOINT_REPORT = LARGE_ABSOLUTE_CENTERED_SPINNER;

// Used in the left navbar when apps or tables are loading
export const LEFT_NAV_BAR =  _.merge({}, LARGE_RELATIVE_SPINNER, {
    color:colorBlack100
});

// Used in records count is not initially available very large datasets
export const RECORD_COUNT = SMALL_SPINNER;

// Used in records count is not initially available very large datasets
export const INLINE_SAVING = SMALL_SPINNER;

// Use on next swipe area in CARD_VIEW
export const CARD_VIEW_NAVIGATION =  _.merge({}, SMALL_SPINNER, {
    color:colorBlue500
});


