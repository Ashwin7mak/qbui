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
 * A multi-choice field value editor that uses react select, it allows a user to select a single option from a drop down box.
 * Also uses radio group component to render a radio group if called from forms.
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
            choice: choice
        });
    },

    getSelectItems() {
        let choices = this.props.choices;
        /*
        * Checks to see if multi choice should be displayed as radio buttons and if the field is required.
        * If the field is not required, then it will append '<None>' to the end of it
        * */
        if (!this.props.showAsRadio) {
            let none = "\<None\>";
            choices = choices ?
                choices.map(choice => {
                    console.log('MAP choice: ', choice);
                    return <span className="multiChoiceRadiochoice"><Radio value={choice.coercedValue.displayValue} />{choice.displayValue}<br /></span>;
                }) : [];
            /*
             *This is commented out right now, because the current Schema in core does not accept/save null inputs
             * This gives the user the ability to select none as an input.
             * Claire talked with Sam, and he is having someone update core, once core is updated, we can uncomment this line
             * */
            // if (this.props.fieldDef.required === false) {
            //     choices.push(<span className="multiChoiceRadiochoice"><Radio value={""} />{none}<br /></span>);
            // }
            return choices;
        } else {
            /*
             *This is commented out right now, because the current Schema in core does not accept/save null inputs
             * This gives the user the ability to select an empty space as an input
             * Claire talked with Sam, and he is having someone update core, once core is updated, we can uncomment this line
             * */
            // if (this.props.fieldDef.required === false) {
            //     choices = ([{coercedValue: {value: ""}, displayValue: ""}]).concat(choices);
            // }
            return choices ?
                choices.map(choice => {
                    return {
                        value: choice,
                        label: choice.displayValue
                    };
                }) : [];
        }
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

        const placeHolderMessage = <I18nMessage message="selection.placeholder" />;
        const notFoundMessage = <I18nMessage message="selection.notFound" />;
        let choice;
        /*
        * This checks ot see if there is a value, if there is no value, then it sets value to false
        * This allows the placeholder text to be displayed
        * */
        if (this.props.value) {
            choice = this.state.choice;
        } else {
            choice = false;
        }

        return (
            <div className="multiChoiceContainer">
                {this.props.showAsRadio ?
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
                        <RadioGroup name="test"
                                    selectedValue={choice}
                                    onChange={this.selectChoice}
                                    onBlur={this.onBlur}>
                            { options }
                        </RadioGroup>
                    </div>
                }
            </div>
        );
    }
});

export default MultiChoiceFieldValueEditor;
