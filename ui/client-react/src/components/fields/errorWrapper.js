import React from 'react';
import * as CompConstants from '../../constants/componentConstants';
import QBToolTip from '../qbToolTip/qbToolTip';
import Breakpoints from '../../utils/breakpoints';

/**
 * Shows an error tooltip with invalidMessage if isInvalid
 * on hover over child element (supply a single child)
 */
const ErrorWrapper = React.createClass({
    displayName: 'ErrorWrapper',
    propTypes: {
        invalidMessage: React.PropTypes.string,
        isInvalid: React.PropTypes.bool
    },
    render() {
        let isSmall = Breakpoints.isSmallBreakpoint();
        if (this.props.isInvalid) {
            return (isSmall ? <div className="errorDiv">{React.Children.only(this.props.children)}<div className="errorText">{this.props.invalidMessage}</div></div> :
                <QBToolTip location="top" tipId="invalidInput" delayHide={CompConstants.ERROR_TIP_TIMEOUT}
                        plainMessage={this.props.invalidMessage}>
                {React.Children.only(this.props.children)}
                </QBToolTip>);
        } else {
            return React.Children.only(this.props.children);
        }
    }
});

export default ErrorWrapper;

