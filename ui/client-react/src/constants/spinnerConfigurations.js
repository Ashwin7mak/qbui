/**
 * This file contains the configurations used for the 'loading' spinner.
 */


// Used in AgGrid when refreshing the full report, for large breakpoint.
export const LARGE_BREAKPOINT_REPORT = {
    lines: 9,
    length: 0,
    width: 11,
    radius: 18,
    scale: 1,
    corners: 1,
    opacity: 0,
    rotate: 0,
    direction: 1,
    speed: 1,
    trail: 60,
    fps: 20,
    zIndex: 2e9,
    className: 'spinner',
    top: '50%',
    left: '50%',
    shadow: false,
    hwaccel: false,
    position: 'absolute'
};

// Used in records count
export const RECORD_COUNT = {
    lines: 7,
    length: 0,
    width: 5,
    radius: 5,
    scale: 1,
    corners: 1,
    opacity: 0,
    rotate: 0,
    direction: 1,
    speed: 1.1,
    trail: 60,
    fps: 20,
    zIndex: 2e9,
    className: 'spinner',
    top: '54%',
    left: '33%',
    shadow: false,
    hwaccel: false,
    position: 'absolute'
};

// Used in card view previous and next buttons
export const CARD_VIEW_NAVIGATION = {
    lines: 7,
    length: 0,
    width: 5,
    radius: 5,
    scale: 1,
    corners: 1,
    opacity: 0,
    rotate: 0,
    direction: 1,
    speed: 1.1,
    trail: 60,
    fps: 20,
    zIndex: 2e9,
    color: '#7090ab',
    className: 'spinner',
    top: '50%',
    left: '30%',
    shadow: false,
    hwaccel: false,
    position: 'absolute'
};
