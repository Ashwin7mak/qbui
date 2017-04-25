import React from 'react';
import QBicon from '../qbIcon/qbIcon';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

/**
 * mailto: icon link with a tooltip
 */
let EmailReportLink = React.createClass({

    getDefaultProps() {
        return {
            tipPlacement: "top"
        };
    },
    propTypes: {
        subject:React.PropTypes.string,
        body:React.PropTypes.string,
        tip:React.PropTypes.string,
        tipPlacement: React.PropTypes.string
    },
    render() {
        const href = "mailto:?subject=" + this.props.subject + "&body=" + this.props.body;
        const tooltip = <Tooltip id={this.props.tip}>{this.props.tip}</Tooltip>;
        return (
            <OverlayTrigger placement={this.props.tipPlacement} overlay={tooltip} >
                <a className={"iconLink icon-mail"} href={href} >
                    <QBicon icon="mail" />
                    {this.props.children}
                </a>
            </OverlayTrigger>);
    }
});

export default EmailReportLink;
