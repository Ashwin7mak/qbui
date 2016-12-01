import React from 'react';
import Select from 'react-select';

/**
 * This component wraps the react-select component and call stopPropagation() on the keydown event
 * when Escape key is pressed. This prevents the event from hitting other event listeners listening
 * for the Escape key on the document/window (see rowEditActions and trowser).
 */
const reactSelectWrapper = React.createClass({
    displayName: 'ReactSelectWrapper',

    getInitialState() {
        return {
            isOpen: false,
        };
    },

    /**
     * Called when the react-select component opens its dropdown menu.
     */
    onOpen() {
        this.setState({isOpen: true});
    },

    /**
     * Called when the react-select component closes its dropdown menu. When a user presses the
     * Escape key when a dropdown is open events/functions are fired in the following order:
     * 1 react-select's keydown handler receivs the keydown event and closes the dropdown
     * 2 this `onClose` function is called
     * 3 the same keydown event fires `this.handleKey` function
     * 4 setTimeout fires to set `this.state.isOpen` to false
     * We need to set the state in a timeout so that `this.state.isOpen` is set to false after (3).
     * Otherwise this.state.isOpen will be false at step (3).
     */
    onClose() {
        setTimeout(() => this.setState({isOpen: false}), 0);
    },

    handleKey(e) {
        // If the react-select dropdown is open, stop propagation for Escape keydown.
        if (this.state.isOpen && e.key === 'Escape') {
            e.stopPropagation();
        }
    },

    componentWillMount() {
        document.addEventListener('keydown', this.handleKey);
    },

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKey);
    },

    render() {
        return (
            <Select
                onOpen={this.onOpen}
                onClose={this.onClose}
                {...this.props}
            >
                {this.props.children}
            </Select>
        );
    }
});

export default reactSelectWrapper;
