import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.min.css';
import './userFieldValueEditor.scss';
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
        return this.props.choices ?
            this.props.choices.map(choice => {
                return {
                    value: choice,
                    label: choice.displayValue};
            }) : [];
    },

    onBlur() {
        //give the right value to display for the parent,
        const theVals = {
            value: this.state.choice,
            display: this.state.choice
        };
        this.props.onBlur(theVals);
    },

    renderOption(choice) {
        return (
            <div className="userOption">
                {this.state.choice.label === choice.value.displayValue && <QbIcon icon="check-reversed"/>}
                <div className="userLabel">{choice.value.displayValue}</div>
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
                placeholder="Search..."
                noResultsText="Not found"
                autosize={false}
                clearable={false}
                onBlur={this.onBlur} />
        );
    }
});

export default MultiChoiceFieldValueEditor;
