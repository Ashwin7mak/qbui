import React from 'react';
import catchClicksOutside from './catchClickOutside';

/*
 the callback to call when a click out side the component is thwarted, and op
*/
/**
 * This higher-order component (HoC) captures clicks outside component and stops the propagation if
 * such an event occurs.
 *
 * A higher-order component is just a function that takes an existing component and returns
 * another component that wraps it extending its functionality by composition.
 *
 * Pass in
 * @param Component -  the Component to wrap with this functionality
 * @param thwartedClickHandler  - optional callback called when outside action is thwarted
 * @param isException - optional callback that returns true if its an outside click that's allowed and not thwarted
 * @returns {XML}
 */
let thwartClicksOutsideWrapper = (Component, clickHandler,  isException)  => {

    let thwartOutsideClicks = (e) => {
        if (e) {
            if (e.stopImmediatePropagation) {
                e.stopImmediatePropagation();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }

            // if any let handler know outside click was thwarted
            if (clickHandler) {
                clickHandler(e);
            }
        }
    };

    const ClicksOutside = React.createClass({
        displayName: 'thwartClicksOutside_' + Component.displayName,
        wrapped  : Component,

        render() {
            return (
                     <Component
                         {...this.props}
                         {...this.state}
                    />
        );
        }
    });

    return catchClicksOutside(ClicksOutside, thwartOutsideClicks, isException) ;
};

export default thwartClicksOutsideWrapper;
