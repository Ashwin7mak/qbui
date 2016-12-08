import React from 'react';
import ReactDOM from 'react-dom';

import QBToolTip from '../qbToolTip/qbToolTip';
import QBicon from '../qbIcon/qbIcon';

/**
 * A higher-order component which adds a "clear" icon to the wrapped component. Assumes an
 * `onChange` function to be passed in as a prop. Calls `onChange` with an object containing an
 * empty string when the clear icon is clicked.
 */
const ClearableInputWrapper = (Component) => {
    const ClearableInput = React.createClass({
        propTypes: {
            onClose  : React.PropTypes.func,
        },

        clearInput() {
            if (this.props.onChange) {
                // onChange should expect a React synthetic event, mimic event structure
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
                            <QBicon ref="clearIconButton" onClick={this.clearInput} className="clearIconButton" icon="clear-mini" />
                        </QBToolTip>
                    </div>
                </span>
            );
        }
    });
    return ClearableInput;
};
export default ClearableInputWrapper;
