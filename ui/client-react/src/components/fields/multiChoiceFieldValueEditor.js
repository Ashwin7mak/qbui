import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.min.css';
import './multiChoiceFieldValueEditor.scss';
import './selectCommon.scss';
import QbIcon from '../qbIcon/qbIcon';
import QBToolTip from '../qbToolTip/qbToolTip';
import {I18nMessage} from '../../utils/i18nMessage';
import * as CompConstants from '../../constants/componentConstants';
import Breakpoints from '../../utils/breakpoints';
import Locale from '../../locales/locales';
import ValidationWrapper from './ValidatedFieldWrapper';
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
        if (this.props.showAsRadio || Breakpoints.isSmallBreakpoint()) {
            // For radio render
            let val = this.props.value ? this.props.value : "";
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
    selectChoice(event) {
        if (event.target) {
            this.setState({
                choice: event.target.value
            });
        } else {
            this.setState({
                choice: {label: event.value.displayValue}
            });
        }
    },
    /**
     * Populate items for component render
     * @returns {Array}
     */
    getSelectItems() {
        let touch = Breakpoints.isSmallBreakpoint();
        let choices = this.props.choices;
        let selectedValue = this.state.choice ? this.state.choice : CompConstants.MULTICHOICE_RADIOGROUP.NONE_OPTION_VALUE;
        if (this.props.showAsRadio) {
            choices = choices ?
                choices.map(choice => {
                    return (<label key={choice.coercedValue.value}
                                   className="multiChoiceRadioOption"
                                   onClick={this.selectChoice}
                                   onBlur={this.onBlur}>
                        <input type="radio" name={this.props.radioGroupName}
                               value={choice.coercedValue.value}
                               checked={selectedValue === choice.coercedValue.value}
                               onChange={this.onClick}/>
                        {choice.displayValue}
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
                           onChange={this.onClick}
                           checked={selectedValue === CompConstants.MULTICHOICE_RADIOGROUP.NONE_OPTION_VALUE}/>
                    <I18nMessage message={"noneOption"} />
                </label>);
            }
            return choices;
        } else if (touch) {
            if (choices) {
                let placeholder =  Locale.getMessage('selection.placeholder');
                choices = choices.map(choice => {
                    return (<option value={choice.coercedValue.value}>{choice.displayValue}</option>);
                });
                // Add the placeholder/none option to the top of the array
                if (this.props.fieldDef && this.props.fieldDef.required === false) {
                    choices.unshift(<option value={CompConstants.MULTICHOICE_RADIOGROUP.NONE_OPTION_VALUE}>{placeholder}</option>);
                }
            }
            return choices;
        } else {
            /**
             *This is commented out right now, because the current Schema in core does not accept/save null inputs
             * This gives the user the ability to select an empty space as an input
             * Claire talked with Sam, and he is having someone update core, once core is updated, we can uncomment this line
             */
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
        let theVals;
        if (this.props.showAsRadio || Breakpoints.isSmallBreakpoint()) {
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
                {this.state.choice.label !== '' ?
                this.state.choice.label === choice.label && <QbIcon className="choiceQBIcon" icon="check-reversed"/> :
                    null}
                <div className="choiceLabel">{choice.value.displayValue}</div>
            </div>);
    },

    render() {
        const options = this.getSelectItems();

        const placeHolderMessage = <I18nMessage message="selection.placeholder"/>;
        const notFoundMessage = <I18nMessage message="selection.notFound"/>;

        let choice;
        if (this.props.showAsRadio) {
            choice = this.props.value ? this.state.choice : '';
        } else {
            choice = this.props.value ? this.state.choice : false;
        }
        let touch = Breakpoints.isSmallBreakpoint();
        let editElement = null;
        if (this.props.showAsRadio) {
            editElement = <div className="multiChoiceRadioContainer">
                {this.props.isInvalid ? <div className="errorBar"></div> : ''}
                <div className="multiChoiceRadioOptionContainer">{ options }</div></div>;
        } else if (touch) {
            let selectedValue = this.state.choice ? this.state.choice : CompConstants.MULTICHOICE_RADIOGROUP.NONE_OPTION_VALUE;
            editElement = <select className="select" value={selectedValue} onChange={this.selectChoice}
                                  onBlur={this.onBlur}>{options}</select>;
        } else {
            editElement = <Select
                    tabIndex="0"
                    value={choice}
                    optionRenderer={this.renderOption}
                    options={options}
                    onChange={this.selectChoice}
                    placeholder={placeHolderMessage}
                    noResultsText={notFoundMessage}
                    autosize={false}
                    clearable={false}
                    onBlur={this.onBlur} />;
        }

        return  <div className="multiChoiceContainer">{editElement}</div>;
    }
});

export default ValidationWrapper(MultiChoiceFieldValueEditor);
