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
        return {choice: this.props.value ? this.props.value : null};
    },

    selectUser(user) {
        console.log('selectUser: ', user);
        this.setState({choice: user ? user.value : null});
    },

    // getAppUser(id) {
    //     console.log('getAppUser ID', id);
    //     return this.props.choices.find(user => user.userId === id);
    // },


    getSelectItems() {
        const datatypeAttributes = this.props.fieldDef && this.props.fieldDef.datatypeAttributes ? this.props.fieldDef.datatypeAttributes : {};
        console.log('getSelectedItems choices: ', this.props.choices);
        return this.props.choices ?
            this.props.choices.map(choice => {
                const label = ({value: choice}, datatypeAttributes);
                return {
                    value: choice,
                    label};
            }) : [];
    },

    onBlur() {

        const datatypeAttributes = this.props.fieldDef && this.props.fieldDef.datatypeAttributes ? this.props.fieldDef.datatypeAttributes : {};
        const user = this.getAppUser(this.state.choice);

        const theVals = {
            value: user,
            display: user ? userFormatter.format({value: user}, datatypeAttributes) : ''
        };

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
        console.log('value: ', this.props.choices);
        console.log('choices: ', this.props.value);
        console.log('fieldDef: ', this.props.fieldDef);
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
