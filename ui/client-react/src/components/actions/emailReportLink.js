import React from 'react';
import ReactIntl from 'react-intl';

import Hicon from '../harmonyIcon/harmonyIcon';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

/**
 * mailto: link
 */
let EmailReportLink = React.createClass({

    propTypes: {
        subject:React.PropTypes.string,
        body:React.PropTypes.string
    },
    render() {
        const href = "mailto:?subject=" + this.props.subject + "&body=" + this.props.body;
        const tooltip = <Tooltip id={this.props.tip}>{this.props.tip}</Tooltip>;
        return (
            <OverlayTrigger placement="top" overlay={tooltip}>
                <a  href={href} >
                    <Hicon icon="email" />
                </a>
            </OverlayTrigger>);
    }
});

export default EmailReportLink;
