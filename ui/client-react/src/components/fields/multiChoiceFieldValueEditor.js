import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.min.css';
import './userFieldValueEditor.scss';
/**
 * combo box cell editor
 */
export const MultiChoiceFieldValueEditor = React.createClass({
    displayName: 'MultiChoiceFieldValueEditor',

    propTypes: {
        choices: React.PropTypes.array,
        value: React.PropTypes.object,
        /**
         * data type attributes for the field */
        fieldDef: React.PropTypes.object
    },

    getInitialState() {
        console.log('getInitialSTate this.props.value: ', this.props.value);
        return {choice: {label: this.props.value}};
    },

    selectUser(choice) {
        console.log('selectUser: ', choice);
        this.setState({choice});
    },

    // getAppUser(id) {
    //     console.log('getAppUser ID', id);
    //     return this.props.choices.find(user => user.userId === id);
    // },


    getSelectItems() {
        const datatypeAttributes = this.props.fieldDef && this.props.fieldDef.datatypeAttributes ? this.props.fieldDef.datatypeAttributes : {};
        console.log('before map choices: ', this.props.choices);

        return this.props.choices ?
            this.props.choices.map(choice => {
                console.log('map choice: ', choice.displayValue);
                return {
                    value: choice,
                    label: choice.displayValue};
            }) : [];
    },

    onBlur() {
        console.log('onBlur this.stat.choice: ', this.state.choice);
        //give the right value to display for the parent,
        const theVals = {
            value: this.state.choice,
            display: this.state.choice
        };
        console.log('onBlur theVals: ', theVals)
        this.props.onBlur(theVals);
    },

    renderOption(choice) {
        console.log('renderOption option: ', choice)
        return (
            <div className="userOption">
                <div className="userLabel">{choice.value.displayValue}</div>
            </div>);
    },

    render() {
        console.log('this.state.choice: ', this.state.choice);
        console.log('this.getSelectItems: ', this.getSelectItems());
        return (
            <Select
                className="cellEdit"
                tabIndex="0"
                matchPos="start"
                value={this.state.choice}
                optionRenderer={this.renderOption}
                options={this.getSelectItems()}
                onChange={this.selectUser}
                onBlur={this.onBlur} />
        );
    }
});

export default MultiChoiceFieldValueEditor;
