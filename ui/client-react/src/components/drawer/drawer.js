import React, {PropTypes} from 'react';
import _ from 'lodash';
import {Route} from 'react-router-dom';

import RecordRouteWithUniqueId from '../record/recordRoute';
import './drawer.scss';

/**
 * A blank container meant to wrap some other component. This Drawer component will slide in from
 * the right.
 */
class Drawer extends React.Component {
    componentWillMount() {
        // TODO: name mount to something else
        if (this.props.mount) {
            this.props.mount();
        }
    }
    componentWillUnmount() {
        if (this.props.unmount) {
            this.props.unmount();
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

export default Drawer;
