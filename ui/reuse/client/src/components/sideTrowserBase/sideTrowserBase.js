import React, {Component} from 'react';
import SideMenuBase, {SideMenuBaseProps} from 'REUSE/components/sideMenuBase/sideMenuBase';

import './sideTrowserBase.scss';

class SideTrowserBase extends Component {
    render() {
        return (
            <SideMenuBase {...this.props} baseClass="sideTrowser" />
        );
    }
}

SideTrowserBase.propTypes = {
    ...SideMenuBaseProps
};

export default SideTrowserBase;
