import React, {PropTypes, Component} from 'react';
import Mousetrap from 'mousetrap';
import {bindGlobal} from './mouseTrapBindGlobal';

bindGlobal(Mousetrap);

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
        }
        if (this.props.shortcutBindings) {
            this.addAllKeyBindings(this.props.shortcutBindings);
        }
    }

    componentWillUnmount() {
        console.log('UNMOUNTED');
        Mousetrap.reset();
        this.removeAllKeyBindings();
    }

    addAllKeyBindings(bindings = []) {
        console.log('addAllKeyBindings: ', bindings);
        bindings.forEach(binding => {
            console.log('bindings: ', binding.callback);
            Mousetrap.bind(binding.key, () => binding.callback(binding.content));
        });
    }

    addAllKeyBindingsPreventDefault(bindings = []) {
        console.log('PreventDefault: ', bindings);
        bindings.forEach(binding => {
            Mousetrap.bindGlobal(binding.key, () => binding.callback(binding.content));
        });
    }

    removeAllKeyBindings() {
        // Order matters, keys must be unbinded in the order that they were passed in to be binded
        let shortcutBindingsPreventDefault = this.props.shortcutBindingsPreventDefault || [];
        let shortcutBindings = this.props.shortcutBindings || [];

        shortcutBindingsPreventDefault.forEach(binding => {
            console.log(binding.key);
            Mousetrap(document.body).unbind(binding.key, binding.callback);
        });

        shortcutBindings.forEach(binding => {
            console.log(binding.key);
            Mousetrap.unbind(binding.key, binding.callback);
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
    /**
     *  IMPORTANT: Only use the below prop if absolutely necessary
     *  This array allows the keyboard bindings to override default keyboard behavior
     *  An example is allowing keyboard bindings to work even when the focus is on an input field, select field, textarea and etc... */
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

