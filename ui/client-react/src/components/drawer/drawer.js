import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'lodash';

import KeyboardShortcuts from '../../../../reuse/client/src/components/keyboardShortcuts/keyboardShortcuts';

import './drawer.scss';

/**
 * A blank container meant to wrap some other component. This Drawer component will slide in from
 * the direction set by props.position (defaults to the right side).
 */
class Drawer extends React.Component {
    constructor(props) {
        super(props);
        // to allow css transition, `loaded` flag is set to true after the component mounts
        //this.state = {mounted: false};
        this.uniqueKey = _.uniqueId();
    }

    componentDidMount() {
        //this.setMounted();
    }

    setMounted = () => {
        // need to set state async, otherwise react gets smart and does some batch update magic
        // which will skip css transition on initial render
        //setTimeout(() => this.setState({mounted: true}), 10);
    }

    // TODO: use inline css for setting the direction to slide the drawer. covered in MC-734
    render() {
        const classNames = ['drawer', this.props.position, this.props.className];
        // if (this.props.visible && this.state.mounted) {
        //     classNames.push('visible');
        // }
        //TODO: keyboard shortcut? Do not use KeyboardShorcuts' shortcutBindingsPreventDefault,
        //      since we want to avoid butting heads with the trowser's ESC handler
        return (
            <div className={classNames.join(' ')}>
                {/* KeyboardShortcuts doesn't seem to be working */}
                {false && <KeyboardShortcuts id="drawer"
                    shortcutBindings={[
                        {key: 'esc', callback: () => this.props.keyboardOnCancel()}
                    ]} />}
                {this.props.children}
            </div>
        );
    }
}

Drawer.propTypes = {
    /** wheather the drawer is be visible */
    visible: PropTypes.bool.isRequired,
    /** position of the drawer, defaults to 'right' */
    position: PropTypes.oneOf(['left', 'right', 'top', 'bottom'])
};

Drawer.defaultProps = {
    position: 'right'
};

export default Drawer;
