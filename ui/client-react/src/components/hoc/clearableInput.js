import React from 'react';

/**
 * This higher-order component (HoC) captures key in the window and if its escape it calls the
 * onClose property function when such an event occurs.
 *
 * A higher-order component is just a function that takes an existing component and returns
 * another component that wraps it.
 *
 */
export default clearableWrapper = (Component) =>{
    const clearableInput = React.createClass({

        //displayName: 'escapeKey_' + Component.displayName,
        wrapped  : Component,

        propTypes: {
            onClear  : React.PropTypes.func
        },

        handleClear(e) {
            // close when Esc is pressed
            if (e.keyCode === 27 && this.props.onClose) {
                this.props.onClose();
            }
        },

        render() {
            return (
                <div>
                    <Component {...this.props} />
                    <div></div>
                </div>
            );
        }
    });

    return CatchEscapeKey;
};
