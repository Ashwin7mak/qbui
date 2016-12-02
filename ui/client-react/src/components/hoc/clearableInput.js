import React from 'react';

/**
 * A higher-order component which adds a "clear" icon to the wrapped component.
 */

export default clearableInputWrapper = (Component) =>{

    const ClearableInput = React.createClass({

        displayName: 'clearable_' + Component.displayName,

        propTypes: {
            clearInput  : React.PropTypes.func,
        },

        getInitialState() {
            return {
                isFocused: false,
            };
        },

        onFocus() {
            this.setState({isFocused: true});
        },

        onBlur(ev) {
            this.setState({isFocused: false});
        },

        render() {
            const classNames = ['inputDeleteIcon'];
            classNames.push(this.state.isFocused ? 'isFocused' : '');
            return (
                <span className={classNames.join(" ")}>
                    <Component {...this.props} onFocus={this.onFocus} onBlur={this.onBlur} />
                    <div className="clearIcon">
                        <QBToolTip tipId="clearInput" i18nMessageKey="fields.textField.clear">
                            <QBicon onClick={this.props.clearInput} icon="clear-mini" />
                        </QBToolTip>
                    </div>
                </span>
            );
        }
    });

    return ClearableInput;
};
