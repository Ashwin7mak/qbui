import React from 'react';
import * as CompConstants from '../../constants/componentConstants';
import QBToolTip from './qbToolTip';

/**
 * Shows an error tooltip with invalidMessage if isInvalid
 * on hover over child element (supply a single child)
 */
const ErrorTipItem = React.createClass({
    displayName: 'ErrorTipItem',
    propTypes: {
        invalidMessage: React.PropTypes.string,
        isInvalid: React.PropTypes.bool
    },
    render() {
        return this.props.isInvalid ?
            (<QBToolTip location="top" tipId="invalidInput" delayHide={CompConstants.ERROR_TIP_TIMEOUT}
                        plainMessage={this.props.invalidMessage}>
                {React.Children.only(this.props.children)}
            </QBToolTip>) :
            React.Children.only(this.props.children);
    }
});

export default ErrorTipItem;

