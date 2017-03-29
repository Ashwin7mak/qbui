import React, {PropTypes, Component} from 'react';
import MouseTrap from 'mousetrap';

class KeyboardShortcuts extends Component {
    constructor(props) {
        super(props);

        this.addAllKeyBindings = this.addAllKeyBindings.bind(this);
        this.addAllKeyBindingsPreventDefault = this.addAllKeyBindingsPreventDefault.bind(this);
        this.removeAllKeyBindings = this.removeAllKeyBindings.bind(this);
    }

    componentWillMount() {
        if (this.props.shortcutBindingsPreventDefault) {
            this.addAllKeyBindingsPreventDefault(this.props.shortcutBindingsPreventDefault);
        } else {
            this.addAllKeyBindings(this.props.shortcutBindings);
        }
    }

    componentWillUnmount() {
        this.removeAllKeyBindings();
    }

    addAllKeyBindings(bindings = []) {
        bindings.forEach(binding => {
            MouseTrap.bind(binding.key, () => binding.callback(binding.content));
        });
    }

    addAllKeyBindingsPreventDefault(bindings = []) {
        bindings.forEach(binding => {
            MouseTrap(document.body).bind(binding.key, () => binding.callback(binding.content));
        });
    }

    removeAllKeyBindings() {
        if (this.props.shortcutBindingsPreventDefault) {
            this.props.shortcutBindingsPreventDefault.forEach(binding => {
                MouseTrap.unbind(binding.key);
            });
        } else {
            this.props.shortcutBindings.forEach(binding => {
                MouseTrap.unbind(binding.key);
            });
        }
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
    /**
     * An array of keyboard bindings that will be active while this component is mounted. It should be immutable. */
    shortcutBindingsPreventDefault: PropTypes.arrayOf(PropTypes.shape({
        /**
         * The keyboard shortcut you want to activate the callback
         * See available options at https://craig.is/killing/mice#api.bind */
        key: PropTypes.string.isRequired,

        /** The callback that will be activated when the key is pressed */
        callback: PropTypes.func.isRequired,

        /** Content will be passed as the first argument to the callback. It is optional. */
        content: PropTypes.any,
    }))

};

export default KeyboardShortcuts;

