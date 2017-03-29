import React, {PropTypes, Component} from 'react';
import MouseTrap from 'mousetrap';

/**
 * adds a bindGlobal method to Mousetrap that allows you to
 * bind specific keyboard shortcuts that will still work
 * inside a text input field
 *
 * usage:
 * Mousetrap.bindGlobal('ctrl+s', _saveChanges);
 */

class KeyboardShortcuts extends Component {
    constructor(props) {
        super(props);

        this.addAllKeyBindings = this.addAllKeyBindings.bind(this);
        this.removeAllKeyBindings = this.removeAllKeyBindings.bind(this);
    }

    componentWillMount() {
        this.addAllKeyBindings(this.props.shortcutBindings);
    }

    componentWillUnmount() {
        this.removeAllKeyBindings();
    }

    addAllKeyBindings(bindings = []) {
        bindings.forEach(binding => {
            MouseTrap(document.body).bind(binding.key, () => binding.callback(binding.content));
        });
    }

    removeAllKeyBindings() {
        this.props.shortcutBindings.forEach(binding => {
            MouseTrap(document.body).unbind(binding.key);
        });
    }

    render() {
        return <div className={`keyBindingsActiveFor${this.props.id}`}>
            {this.props.children}
            </div>;
    }
}

KeyboardShortcuts.propTypes = {
    /**
     * An id that identifies the keyboard shortcuts that belong to this instance of the component */
    id: PropTypes.string.isRequired,

    /**
     * An array of keyboard bindings that will be active while this component is mounted. It should be immutable. */
    shortcutBindings: PropTypes.arrayOf(PropTypes.shape({
        /**
         * The keyboard shortcut you want to activate the callback
         * See available options at https://craig.is/killing/mice#api.bind */
        key: PropTypes.string.isRequired,

        /** The callback that will be activated when the key is pressed */
        callback: PropTypes.func.isRequired,

        /** Content will be passed as the first argument to the callback. It is optional. */
        content: PropTypes.any,
    })),
    /** This stops the browser default callbacks */
    stopDefaultCallback: PropTypes.bool
};

export default KeyboardShortcuts;

