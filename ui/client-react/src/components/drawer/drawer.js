import React, {PropTypes} from 'react';
import _ from 'lodash';

import './drawer.scss';

/**
 * A blank container meant to wrap some other component. This Drawer component will slide in from
 * the right.
 */
class Drawer extends React.Component {
    render() {
        const classNames = ['panel', this.props.className];
        classNames.push(this.props.isDrawer ? 'drawer' : '');
        return (
            <div className={classNames.join(' ')}>
                {this.props.children}
            </div>
        );
    }
}

export default Drawer;
