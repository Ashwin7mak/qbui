import React from 'react';
import {Input, InputGroup, FormControl, MenuItem, FormGroup, DropdownButton} from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';
import moment from 'moment';

/**
 * simple non-validating cell editor for text
 */
export const DefaultFieldEditor = React.createClass({

    propTypes: {
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.object, React.PropTypes.bool]),
        type: React.PropTypes.string,
        onChange: React.PropTypes.func
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
        return <input ref="cellInput"
                      onChange={this.onChange}
                      tabIndex="0"
                      className="cellEdit"
                      type={this.props.type}
                      value={this.props.value}/>;
    }
});

/**
 * placeholder for user picker
 */
export const UserFieldEditor = React.createClass({

    render() {
        return <input ref="cellInput"
                      tabIndex="0"
                      className="cellEdit"/>;
    }
});
/**
 * combo box cell editor
 */
export const ComboBoxFieldEditor = React.createClass({

    propTypes: {
        choices: React.PropTypes.array, // array of choices with display value props
        onChange: React.PropTypes.func
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
                             onChange={this.onChange}/>
                <DropdownButton pullRight={true}
                                componentClass={InputGroup.Button}
                                id="input-dropdown-addon"
                                title="">

                    {this.props.choices.map((choice, i) => (<MenuItem key={i}
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
 * date-only cell editor
 */
export const DateFieldEditor = React.createClass({

    propTypes: {
        value: React.PropTypes.string, // YYYY-MM-DD
        onChange: React.PropTypes.func
    },

    onChange(newValue) {
        this.props.onChange(newValue);
    },

    render() {
        //let formatted = this.props.value ? formatDate(this.props.value, "YYYY-MM-DD") : "";
        const fixedDate = this.props.value.replace(/(\[.*?\])/, ''); // remove [utc] suffix if present
        return <div className="cellEdit dateTimeField">
            <DateTimeField dateTime={fixedDate}
                           format="YYYY-MM-DD"
                           inputFormat="MM-DD-YYYY"
                           onChange={this.onChange}
                           mode="date"/>
        </div>;
    }
});

/**
 * date + time cell editor
 */
export const DateTimeFieldEditor = React.createClass({

    propTypes: {
        value: React.PropTypes.string, // YYYY-MM-DDThh:mm:ss
        onChange: React.PropTypes.func
    },

    onChange(newValue) {
        this.props.onChange(newValue);
    },

    render() {

        const fixedDate = this.props.value.replace(/(\[.*?\])/, ''); // remove [utc] suffix if present

        return <div className="cellEdit dateTimeField">
            <DateTimeField dateTime={fixedDate}
                           format="YYYY-MM-DDTHH:mm:ssZ"
                           inputFormat="MM-DD-YYYY hh:mm:ss A"
                           onChange={this.onChange}
                           mode="datetime"/>
        </div>;
    }
});

/**
 * time of day cell editor
 */
export const TimeFieldEditor = React.createClass({

    propTypes: {
        value: React.PropTypes.string, // YYYY-MM-DDThh:mm:ss (Epoch date)
        onChange: React.PropTypes.func
    },
    onChange(newValue) {
        this.props.onChange(newValue);
    },
    render() {

        const localTime = this.props.value.replace(/Z(\[.*?\])/, ''); // remove Z[utc] suffix if present
        return <div className="cellEdit dateTimeField">
            <DateTimeField dateTime={localTime}
                           format="YYYY-MM-DDTHH:mm:ss"
                           inputFormat="h:mm:ss A"
                           onChange={this.onChange}
                           mode="time"/>
        </div>;
    }
});

/**
 * checkbox cell editor
 */
export const CheckBoxFieldEditor = React.createClass({

    propTypes: {
        value: React.PropTypes.bool,
        onChange: React.PropTypes.func
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

        return <input ref="cellInput"
                      onChange={this.onChange}
                      tabIndex="0"
                      className="cellEdit"
                      defaultChecked={this.props.value} // react requirement
                      type="checkbox"
        />;
    }
});
