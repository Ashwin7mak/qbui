import React from 'react';
import Select from 'react-select';
import {RadioGroup, Radio} from 'react-radio-group';
import 'react-select/dist/react-select.min.css';
import './multiChoiceFieldValueEditor.scss';
import './selectCommon.scss';
import QbIcon from '../qbIcon/qbIcon';
import {I18nMessage} from '../../utils/i18nMessage';
import * as CompConstants from '../../constants/componentConstants';
/**
 * # MultiChoiceFieldValueEditor
 * A multi-choice field value editor that uses react select, allows a user to select a single option from a drop down box.
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
        value: React.PropTypes.string,
        /**
         * listen for losing focus by setting a callback to the onBlur prop */
        onBlur: React.PropTypes.func,
        /**
         * data type attributes for the field. Currently supports 'required' attribute only. */
        fieldDef: React.PropTypes.object,
        /**
         * Used in forms. If set to true, will render radio buttons. Otherwise will render listbox.
         * This property should map to 'show as radio buttons' property in a form */
        showAsRadio: React.PropTypes.bool,
        /**
         * Group name for the radio buttons, if component is rendered as radio button group
         */
        radioGroupName: React.PropTypes.string
    },

    getInitialState() {
        if (this.props.showAsRadio) {
            let val = this.props.value ? this.props.value : "";
            // Radio Group component expects a string value.
            return {
                choice: val
            };
        }
        return {
            // React select expects an object
            choice: {
                label: this.props.value
            }
        };
    },
    /**
     * Set the user selection to component state
     * @param choice
     */
    selectChoice(choice) {
        if (this.props.showAsRadio) {
            this.setState({
                choice: choice
            });
        } else {
            this.setState({
                choice: {label: choice}
            });
        }
    },
    /**
     * Populate items for component render
     * @returns {Array}
     */
    getSelectItems() {
        let choices = this.props.choices;
        /*
        * Checks to see if multi choice should be displayed as radio buttons and if the field is required.
        * If the field is not required, append '<None>' as the last radio button
        * */
        if (!this.props.showAsRadio) {
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
        } else {
            choices = choices ?
                choices.map(choice => {
                    return <span key={choice.coercedValue.value} className="multiChoiceRadioOption">
                                <Radio value={choice.coercedValue.value} />{choice.displayValue}<br />
                            </span>;
                }) : [];
            // This gives the user the ability to select none as an input.
            if (this.props.fieldDef && this.props.fieldDef.required === false) {
                choices.push(<span key={""} className="multiChoiceRadioOption"><Radio key={""} value={CompConstants.MULTICHOICE_RADIOGROUP.NONE_OPTION_VALUE}/>{CompConstants.MULTICHOICE_RADIOGROUP.NONE_OPTION_MESSAGE}<br /></span>);
            }
            return choices;
        }
    },

    onBlur() {
        let theVals;
        if (this.props.showAsRadio) {
            theVals = {
                value: this.state.choice,
                display: this.state.choice
            };
        } else {
            theVals = {
                value: this.state.choice.label,
                display: this.state.choice.label
            };
        }
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

        const placeHolderMessage = <I18nMessage message="selection.placeholder"/>;
        const notFoundMessage = <I18nMessage message="selection.notFound"/>;
        let choice;
        if (this.props.showAsRadio) {
            choice = this.props.value ? this.state.choice : false;
        } else {
            choice = this.props.value ? this.state.choice.label : '';
        }
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
                        <RadioGroup name={this.props.radioGroupName}
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
