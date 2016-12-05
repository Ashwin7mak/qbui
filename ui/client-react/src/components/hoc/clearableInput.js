import React from 'react';

import QBToolTip from '../qbToolTip/qbToolTip';
import QBicon from '../qbIcon/qbIcon';

const ClearableInputWrapper = React.createClass({
    displayName: 'ClearableInputWrapper',

    propTypes: {
        clearInput  : React.PropTypes.func,
    },

    render() {
        return (
            <span className="inputDeleteIcon isFocused">
                {this.props.children}
                <div className="clearIcon">
                    <QBToolTip tipId="clearInput" i18nMessageKey="fields.textField.clear">
                        <QBicon onClick={this.props.clearInput} icon="clear-mini" />
                    </QBToolTip>
                </div>
            </span>
        );
    }
});
export default ClearableInputWrapper;
