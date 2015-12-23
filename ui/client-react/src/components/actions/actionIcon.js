import React from 'react';
import ReactIntl from 'react-intl';

import Hicon from '../harmonyIcon/harmonyIcon';
import {Tooltip, OverlayTrigger, Glyphicon} from 'react-bootstrap';

let ActionIcon = React.createClass({

    defaultProps: {
        bsRole: ""
    },

    propTypes: {
        tip:React.PropTypes.string,
        icon:React.PropTypes.string,
        bsStyle:React.PropTypes.string
    },

    render() {
        const tooltip = <Tooltip id={this.props.tip} positionTop={22}>{this.props.tip}</Tooltip>;

        return (
            <OverlayTrigger placement="top" overlay={tooltip}>
                <a href="#" bsStyle={this.props.bsRole}>{this.props.icon ?
                    <Hicon icon={this.props.icon}/> :
                    <Glyphicon glyph={this.props.glyph}/> }
                </a>
            </OverlayTrigger>);

    }
});

export default ActionIcon;
