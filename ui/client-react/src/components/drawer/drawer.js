import React, {PropTypes} from 'react';

import './drawer.scss';

/**
 * A blank container meant to wrap some other component.
 * @see DrawerContainer
 */
class Drawer extends React.Component {
    componentWillMount() {
        if (this.props.onMount) {
            this.props.onMount();
        }
    }
    componentWillUnmount() {
        if (this.props.onUnmount) {
            this.props.onUnmount();
        }
    }
    render() {
        const classNames = ['drawer', this.props.className];
        return (
            <div className={classNames.join(' ')}>
                {this.props.children}
            </div>
        );
    }
}
Drawer.propTypes = {
    onMount: PropTypes.func,
    onUnmount: PropTypes.func
};

export default Drawer;
