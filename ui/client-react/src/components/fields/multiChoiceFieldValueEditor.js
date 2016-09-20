import React from 'react';
import Select from 'react-select';
import {RadioGroup, Radio} from 'react-radio-group';
import 'react-select/dist/react-select.min.css';
import './multiChoiceFieldValueEditor.scss';
import './selectCommon.scss';
import QbIcon from '../qbIcon/qbIcon';
import {I18nMessage} from '../../utils/i18nMessage';
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
        console.log('this.props.value: ', this.props.value);
        return {
            choice: {
                label: this.props.value
            }
        };
    },

    selectChoice(choice) {
        this.setState({
            choice: choice
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
        var radioButtons = [];
        for (var i = 0; i < options.length; i++) {
            radioButtons.push(<span className="multiChoiceRadio"><Radio value={options[i].value.coercedValue} />{options[i].label}</span>);
        }

        const placeHolderMessage = <I18nMessage message="selection.placeholder" />;
        const notFoundMessage = <I18nMessage message="selection.notFound" />;
        let choice;
        console.log('BEFORE IF this.props.value: ', typeof this.props.value);

        if (this.props.value) {
            choice = {label: this.props.value};
        } else {
            choice = false;
        }

        console.log('THIS CHOICE: ', choice);


        return (
            <div className="multiChoiceContainer">
                {!this.props.showAsRadio ?
                    <Select
                        tabIndex="0"
                        value={choice}
                        optionRenderer={this.renderOption}
                        options={options}
                        onChange={this.selectChoice}
                        placeholder={placeHolderMessage}
                        noResultsText={notFoundMessage}
                        autosize={false}
                        clearable={false}
                        onBlur={this.onBlur} /> :
                    <div className="multiChoiceRadioContainer">
                        <RadioGroup name="test" selectedValue={this.state.selectedValue}
                                    onChange={this.handleChange}
                                    onBlur={this.onBlur}>
                            { radioButtons }
                        </RadioGroup>
                    </div>
                }
            </div>
        );
    }
});

export default MultiChoiceFieldValueEditor;
