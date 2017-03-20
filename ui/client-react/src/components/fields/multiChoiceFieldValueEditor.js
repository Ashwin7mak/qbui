import React from 'react';
import Select from '../select/reactSelectWrapper';
import 'react-select/dist/react-select.min.css';
import './multiChoiceFieldValueEditor.scss';
import './selectCommon.scss';
import QbIcon from '../qbIcon/qbIcon';
import QBToolTip from '../qbToolTip/qbToolTip';
import {I18nMessage} from '../../utils/i18nMessage';
import * as CompConstants from '../../constants/componentConstants';
import Locale from '../../locales/locales';

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
        value: React.PropTypes.any,
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
        let choice = {
            value: '',
            display: '',
        };
        if (this.props.value || this.props.value === 0) {
            choice.value = this.props.value;
            choice.display = this.props.display;
        }
        return {choice};
    },
    /**
     * Set the user selection to component state
     * @param choice
     */
    selectChoice(event) {
        let newValue = {};
        if (event.target) {
            newValue.value = ''; // for when the user selects the 'none' choice
            newValue.display = event.target.value;
            // find the real value that corresponds to the displayValue
            this.props.choices.some((choice) => {
                if (choice.displayValue === event.target.value) {
                    newValue.value = choice.coercedValue.value;
                    return true;
                }
                return false;
            });
        } else {
            newValue.value = event.value.coercedValue.value;
            newValue.display = event.value.displayValue;
        }
        this.setState({choice: newValue});
        if (this.props.onChange) {
            this.props.onChange(newValue.value);
        }
    },

    onBlur() {
        let theVals = {
            value: this.state.choice.value,
            display: this.state.choice.display,
        };
        // If the user picked the blank entry (none), the display contains a space character.
        if (this.state.choice.value === '') {
            theVals.display = '';
        }
        if (this.props.onBlur) {
            this.props.onBlur(theVals);
        }
    },

    renderOption(choice) {
        let isSelected = this.state.choice.value !== '' && this.state.choice.display === choice.label;
        let classes = 'choiceLabel';
        classes += isSelected ? ' selected' : '';
        return (
            <div>
                {isSelected ? <QbIcon className="choiceQBIcon" icon="check-reversed"/> :
                    null}
                <div className={classes}>{choice.value.displayValue}</div>
            </div>);
    },

    getRadioElement() {
        let choices = this.props.choices;
        let selectedValue = this.state.choice.value || CompConstants.MULTICHOICE_RADIOGROUP.NONE_OPTION_VALUE;
        choices = choices ?
            choices.map(choice => {
                return (<label key={choice.coercedValue.value}
                               className="multiChoiceRadioOption"
                               onClick={this.selectChoice}
                               onBlur={this.onBlur}>
                    <input type="radio" name={this.props.radioGroupName}
                           value={choice.displayValue}
                           checked={selectedValue === choice.coercedValue.value}
                           onChange={this.onClick} onBlur={this.onBlur}></input><span className="choiceText">{choice.displayValue}</span>
                    <div className="check"><div className="inside"></div></div>
                </label>);
            }) : [];
        // Add none option if the field is not required
        if (this.props.fieldDef && this.props.fieldDef.required === false) {
            choices.push(<label key={CompConstants.MULTICHOICE_RADIOGROUP.NONE_OPTION_VALUE}
                                className="multiChoiceRadioOption"
                                onClick={this.selectChoice}
                                onBlur={this.onBlur}>
                <input type="radio" name={this.props.radioGroupName}
                       value={CompConstants.MULTICHOICE_RADIOGROUP.NONE_OPTION_VALUE}
                       onChange={this.onClick} onBlur={this.onBlur}
                       checked={selectedValue === CompConstants.MULTICHOICE_RADIOGROUP.NONE_OPTION_VALUE}/>
                        <div className="check"><div className="inside"></div></div>
                <span className="choiceText"><I18nMessage message={"noneOption"}/></span>
            </label>);
        }

        return (<div className="multiChoiceRadioContainer">
                {this.props.invalid ? <div className="errorBar"></div> : ''}
                <div className="multiChoiceRadioOptionContainer">{ choices }</div>
        </div>);
    },

    getReactSelect() {
        const placeHolderMessage = Locale.getMessage("selection.placeholder");
        const notFoundMessage = <I18nMessage message="selection.notFound"/>;
        const emptyOptionText = '\u00a0'; //Non breaking space

        let choices = this.props.choices;
        let selectedValue = _.get(this, 'state.choice.value');
        /**
         *This is commented out right now, because the current Schema in core does not accept/save null inputs
         * This gives the user the ability to select an empty space as an input
         * Claire talked with Sam, and he is having someone update core, once core is updated, we can uncomment this line
         */
        if (this.props.fieldDef && this.props.fieldDef.required === false) {
            choices = ([{coercedValue: {value: CompConstants.MULTICHOICE_RADIOGROUP.NONE_OPTION_VALUE}, displayValue: emptyOptionText}]).concat(choices);
        }
        choices = choices ?
            choices.map(choice => {
                return {
                    value: choice,
                    label: choice.displayValue
                };
            }) : [];

        return <Select
            value={selectedValue && {label: selectedValue}}
            optionRenderer={this.renderOption}
            options={choices}
            onChange={this.selectChoice}
            placeholder={placeHolderMessage}
            noResultsText={notFoundMessage}
            autosize={false}
            clearable={false}
            onBlur={this.onBlur}
            tabIndex={this.props.tabIndex}
        />;
    },

    getFieldElement() {
        if (this.props.showAsRadio) {
            return this.getRadioElement();
        } else {
            return this.getReactSelect();
        }
    },

    render() {
        let editElement = this.getFieldElement();
        return <div className="multiChoiceContainer borderOnError">{editElement}</div>;
    }
});

export default MultiChoiceFieldValueEditor;
