import React, {PropTypes} from 'react';
import KeyboardShortcuts from '../../../../reuse/client/src/components/keyboardShortcuts/keyboardShortcuts';
import './drawer.scss';

/**
 *
 */
class Drawer extends React.Component {
    constructor(props) {
        super(props);
        // to allow css transition, `loaded` flag is set to true after the component mounts
        this.state = {mounted: false};
    }

    componentDidMount() {
        this.setMounted();
    }

    setMounted = () => {
        // need to set state async, otherwise react gets smart and does some batch update magic
        // which will skip css transition on initial render
        setTimeout(() => this.setState({mounted: true}), 10);
    }

    // TODO: use inline css for setting the direction to slide the drawer
    render() {
        const classNames = ['drawer', this.props.position, this.props.className];
        if (this.props.visible && this.state.mounted) {
            classNames.push('visible');
        }
        //TODO: keyboard shortcut? ESC while focus is on component only to prevent butting heads
        // with trowser
        return (
            <div className={classNames.join(' ')}>
                {/* KeyboardShortcuts doesn't seem to be working */}
                {false && <KeyboardShortcuts id="drawer"
                    shortcutBindings={[
                        {key: 'esc', callback: () => this.props.keyboardOnCancel()}
                    ]} />}
                {this.props.content}
                {this.props.children}
            </div>
        );
    }
}

Drawer.propTypes = {
    /** wheather the drawer is be visible */
    visible: PropTypes.bool.isRequired,
    /** main content of drawer */
    content: PropTypes.node,
    /** position of the drawer, defaults to 'right' */
    position: PropTypes.oneOf(['left', 'right', 'top', 'bottom'])
};

Drawer.defaultProps = {
    position: 'right'
};

export default Drawer;
