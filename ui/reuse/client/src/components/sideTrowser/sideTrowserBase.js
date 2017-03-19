import React, {Component} from 'react';
import ReSideMenuBase, {SideMenuBaseProps} from '../reSideMenu/reSideMenuBase';

import './sideTrowserBase.scss';

class SideTrowserBase extends Component {
    render() {
        return (
            <ReSideMenuBase {...this.props} baseClass="sideTrowser" />
        );
    }
}

ReSideMenuBase.propTypes = {
    ...SideMenuBaseProps
};

export default SideTrowserBase;
