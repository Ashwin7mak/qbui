import React from 'react';
import Keycode from '../../constants/keycodeConstants';

/*

 This higher-order component (HoC) captures key in the window and if its escape it calls the
 onClose property function when such an event occurs.

 A higher-order component is just a function that takes an existing component and returns
 another component that wraps it.
*/
var catchEscapeKeyWrapper = (Component) =>{

    const CatchEscapeKey = React.createClass({

        displayName: 'escapeKey_' + Component.displayName,
        wrapped  : Component,

        propTypes: {
            onClose  : React.PropTypes.func,
        },

        handleKey(e) {
            // close when Esc is pressed
            if ((e.keyCode === Keycode.ESCAPE || e.key === 'Escape') && this.props.onClose) {
                this.props.onClose();
            }
        },

        componentWillMount() {
            // Need to listen to window so this listener will fire after react's onKeydown handlers
            // as well as components/select/reactSelectWrapper
            if (window && window.addEventListener) {
                window.addEventListener("keydown", this.handleKey);
            }
        },

        componentWillUnmount() {
            // Need to listen to window so this listener will fire after react's onKeydown handlers
            // as well as components/select/reactSelectWrapper
            if (window && window.removeEventListener) {
                window.removeEventListener("keydown", this.handleKey);
            }
        },

        render() {
            return (
                     <Component
                         {...this.props}
                         {...this.state}
                    />);
        }
    });

    return CatchEscapeKey;
};
export default catchEscapeKeyWrapper;
