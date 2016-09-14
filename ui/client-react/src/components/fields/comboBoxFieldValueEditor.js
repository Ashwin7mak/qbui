import React from 'react';
import {Input, InputGroup, FormControl, MenuItem, FormGroup, DropdownButton} from 'react-bootstrap';

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

export default ComboBoxFieldValueEditor;
