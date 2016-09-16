import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.min.css';
import './multiChoiceFieldValueEditor.scss';
import QbIcon from '../qbIcon/qbIcon';
/**
 * combo box cell editor
 */
export const MultiChoiceFieldValueEditor = React.createClass({
    displayName: 'MultiChoiceFieldValueEditor',

    propTypes: {
        choices: React.PropTypes.array,
        value: React.PropTypes.object,
        onBlur: React.PropTypes.func,
        /**
         * data type attributes for the field */
        fieldDef: React.PropTypes.object
    },

    getInitialState() {
        return {choice: {label: this.props.value}};
    },

    selectChoice(choice) {
        this.setState({choice});
    },

    getSelectItems() {
        let choices = this.props.choices;

        if (this.props.fieldDef.required === false) {
            choices = [{coercedValue: {value: ''}, displayValue:''}].concat(choices);
        }

        return choices ?
            choices.map(choice => {
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
        this.props.onBlur(theVals);
    },

    renderOption(choice) {
        console.log('renderOption: ', choice);
        if (choice.value.displayValue === "") {
            return <div>&nbsp;</div>;
        }
        return (
            <div className="choiceOption">
                {this.state.choice.label === choice.value.displayValue && <QbIcon icon="check-reversed"/>}
                <div className="choiceLabel">{choice.value.displayValue}</div>
            </div>);
    },

    render() {
        return (
            <Select
                className="cellEdit"
                tabIndex="0"
                value={this.state.choice}
                optionRenderer={this.renderOption}
                options={this.getSelectItems()}
                onChange={this.selectChoice}
                placeholder="Select..."
                noResultsText="Not found"
                autosize={false}
                clearable={false}
                onBlur={this.onBlur} />
        );
    }
});

export default MultiChoiceFieldValueEditor;
