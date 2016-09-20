import React from 'react';
import Select from 'react-select';
import {RadioGroup, Radio} from 'react-radio-group';
import 'react-select/dist/react-select.min.css';
import './multiChoiceFieldValueEditor.scss';
import './selectCommon.scss';
import QbIcon from '../qbIcon/qbIcon';
/**
 * # MultiChoiceFieldValueEditor
 * A multi-choice field value editor that uses react select, it allows a user to select a single option from a drop down box
 */
const MultiChoiceFieldValueEditor = React.createClass({
    displayName: 'MultiChoiceFieldValueEditor',

    propTypes: {
        /**
         * expects an array of choices */
        choices: React.PropTypes.array,
        /**
         * gets the selected value for input box for multi choice */
        value: React.PropTypes.object,
        /**
         * listen for losing focus by setting a callback to the onBlur prop */
        onBlur: React.PropTypes.func,
        /**
         * data type attributes for the field */
        fieldDef: React.PropTypes.object,
        /**
         * Used in forms. If set to true, will render radio buttons. Otherwise will render listbox.
         * This property should map to 'show as radio buttons' property in a form */
        showAsRadio: React.PropTypes.bool
    },

    getInitialState() {
        return {
            choice: {
                label: this.props.value
            }
        };
    },

    selectChoice(choice) {
        this.setState({
            choice
        });
    },

    getSelectItems() {
        return this.props.choices ?
            this.props.choices.map(choice => {
                return {
                    value: choice,
                    label: choice.displayValue};
            }) : [];
    },

    onBlur() {
        const theVals = {
            value: this.state.choice.value.coercedValue.value,
            display: this.state.choice.value.displayValue
        };

        if (this.props.onBlur) {
            this.props.onBlur(theVals);
        }
    },

    renderOption(choice) {
        return (
            <div>
                {this.state.choice.label === choice.value.displayValue && <QbIcon className="choiceQBIcon" icon="check-reversed"/>}
                <div className="choiceLabel">{choice.value.displayValue}</div>
            </div>);
    },

    render() {
        const options = this.getSelectItems();

        return (
            <div className="multiChoiceContainer">
                {this.props.showAsRadio ?
                    <Select
                        className="cellEdit"
                        tabIndex="0"
                        value={this.state.choice}
                        optionRenderer={this.renderOption}
                        options={options}
                        onChange={this.selectChoice}
                        placeholder="Select..."
                        noResultsText="Not found"
                        autosize={false}
                        clearable={false}
                        onBlur={this.onBlur} /> :

                    <RadioGroup name="test" selectedValue={this.state.selectedValue}
                                onChange={this.handleChange}
                                onBlur={this.onBlur}>
                        {   Object.keys(options).map(function(key, value) {
                            return (<span>
                                        <Radio value={key} /> {value}
                                    </span>);
                        })}
                    </RadioGroup>
                }
            </div>
        );
    }
});

export default MultiChoiceFieldValueEditor;
