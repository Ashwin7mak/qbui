import React from 'react';
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
            onClose  : React.PropTypes.func
        },

        handleKey(e) {
            // close when Esc is pressed
            if (e.keyCode === 27 && this.props.onClose) {
                this.props.onClose();
            }
        },
        componentWillMount() {
            if (window && window.removeEventListener) {
                window.addEventListener("keydown", (e) => this.handleKey(e), false);
            }
        },

        componentWillUnmount() {
            if (window && window.removeEventListener) {
                window.removeEventListener("keydown", (e) => this.handleKey(e), false);
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
