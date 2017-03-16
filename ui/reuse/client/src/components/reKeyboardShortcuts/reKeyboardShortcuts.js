import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import MouseTrap from 'mousetrap';
import {addAllKeyBindings, removeAllKeyBindings} from './reKeyboardActions';


const mapStateToProps = state => {
    return {
        keyboard: state.keyboard,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addAllKeyBindings: (id, bindings) => dispatch(addAllKeyBindings(id, bindings)),
        removeAllKeyBindings: id => dispatch(removeAllKeyBindings(id)),
    }
};


export class ReKeyboardShortcuts extends Component {
    constructor(props) {
        super(props);

        this.addAllKeyBindings = this.addAllKeyBindings.bind(this);
        this.removeAllKeyBindings = this.removeAllKeyBindings.bind(this);
    }

    componentWillMount() {
        this.addAllKeyBindings(this.props.shortcutBindings);
    }

    // TODO:: Don't unbind everything when new props are passed in
    componentWillReceiveProps(nextProps) {
        if (nextProps.shortcutBindings !== this.props.shortcutBindings) {
            this.removeAllKeyBindings();
            this.addAllKeyBindings(nextProps.shortcutBindings);
        }
    }

    componentWillUnmount() {
        this.removeAllKeyBindings();
    }

    addAllKeyBindings(bindings = []) {
        bindings.forEach(binding => {
            MouseTrap.bind(binding.key, () => binding.callback(binding.content));
        });
        this.props.addAllKeyBindings(this.props.id, bindings);
    }

    removeAllKeyBindings() {
        this.props.shortcutBindings.forEach(binding => {
            MouseTrap.unbind(binding.key);
        });
        this.props.removeAllKeyBindings(this.props.id);
    }

    render() {
        return <div className={`keyBindingsActiveFor${this.props.id}`}/>;
    }
}

ReKeyboardShortcuts.propTypes = {
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
        content: PropTypes.any
    }))
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReKeyboardShortcuts);