import React from 'react';
import {Input, InputGroup, FormControl, MenuItem, FormGroup, DropdownButton} from 'react-bootstrap';
import moment from 'moment';

/**
 * Initial field component implementations for demo, these will become separate component files
 * and added to component lib when there stories are implemented
 */
/**
 * simple non-validating cell editor for text
 */
export const DefaultFieldValueEditor = React.createClass({
    displayName: 'DefaultFieldValueEditor',

    propTypes: {
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.object, React.PropTypes.bool]),
        type: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onBlur: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            value: "",
            type: "text"
        };
    },

    onChange(ev) {
        this.props.onChange(ev.target.value);
    },

    render() {
        return <input ref="fieldInput"
                      onChange={this.onChange}
                      onBlur={this.props.onBlur}
                      tabIndex="0"
                      className="cellEdit"
                      type={this.props.type}
                      value={this.props.value}/>;
    }
});

/**
 * placeholder for user picker
 */
export const UserFieldValueEditor = React.createClass({
    displayName: 'UserFieldValueEditor',

    render() {
        return <input ref="fieldInput"
                      tabIndex="0"
                      onBlur={this.props.onBlur}
                      className="cellEdit"/>;
    }
});
/**
 * combo box cell editor
 */
export const ComboBoxFieldValueEditor = React.createClass({

    propTypes: {
        choices: React.PropTypes.array, // array of choices with display value props
        onChange: React.PropTypes.func,
        onBlur: React.PropTypes.func
    },

    // handle text input
    onChange(ev) {
        const newValue = ev.target.value;

        this.props.onChange(newValue);
    },
    // handle dropdown selection
    onSelect(choice) {
        this.props.onChange(choice);
    },

    render() {
        return (
            <InputGroup className="cellEdit">
                <FormControl type="text"
                             value={this.props.value}
                             onChange={this.onChange}
                             onBlur={this.props.onBlur}
                             />
                <DropdownButton pullRight={true}
                                componentClass={InputGroup.Button}
                                id="input-dropdown-addon"
                                title="">

                    {this.props.choices.map((choice, i) => (<MenuItem key={i}
                                                                      onBlur={this.props.onBlur}
                                                                      onSelect={() => {this.onSelect(choice.displayValue);}}>
                                                                {choice.displayValue}
                                                            </MenuItem>))
                    }

                </DropdownButton>
            </InputGroup>
        );
    }
});

/**
 * checkbox cell editor
 */
export const CheckBoxFieldValueEditor = React.createClass({
    displayName: 'CheckBoxFieldValueEditor',

    propTypes: {
        value: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        onBlur: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            value: false
        };
    },

    onChange(ev) {
        const newValue = ev.target.checked;
        this.props.onChange(newValue);
    },

    render() {

        return <input ref="fieldInput"
                      onChange={this.onChange}
                      onBlur={this.props.onBlur}
                      tabIndex="0"
                      className="cellEdit"
                      defaultChecked={this.props.value} // react requirement
                      type="checkbox"
        />;
    }
});
