import React from 'react';
import ReactDOM from 'react-dom';

import QBToolTip from '../qbToolTip/qbToolTip';
import QBicon from '../qbIcon/qbIcon';

/**
 * A higher-order component which adds a "clear" icon to the wrapped component.
 */
const ClearableInputWrapper = (Component) => {
    const ClearableInput = React.createClass({
        clearInput() {
            if (this.props.onChange) {
                // onChange expects React synthetic event, mimic event structure
                this.props.onChange({target: {value: ''}});
                ReactDOM.findDOMNode(this.refs.textInput).focus();
            }
        },
        render() {
            return (
                <span className="inputDeleteIcon">
                    <Component ref="textInput" {...this.props} />
                    <div className="clearIcon">
                        <QBToolTip tipId="clearInput" i18nMessageKey="fields.textField.clear">
                            <QBicon onClick={this.clearInput} icon="clear-mini" />
                        </QBToolTip>
                    </div>
                </span>
            );
        }
    });
    return ClearableInput;
};
export default ClearableInputWrapper;
