import React from 'react';
import ReactIntl from 'react-intl';

import Hicon from '../harmonyIcon/harmonyIcon';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

let ActionIcon = React.createClass({

    propTypes: {
        tip:React.PropTypes.string,
        icon:React.PropTypes.string
    },

    render() {
        const tooltip = <Tooltip id={this.props.tip} positionTop={22}>{this.props.tip}</Tooltip>;

        return (
            <OverlayTrigger placement="top" overlay={tooltip}>
                <a><Hicon icon={this.props.icon}/></a>
            </OverlayTrigger>);

    }
});

export default ActionIcon;
