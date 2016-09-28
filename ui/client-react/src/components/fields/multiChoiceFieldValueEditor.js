import React from 'react';
import Select from 'react-select';
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
        let choices = this.props.choices;
        if (this.props.showAsRadio) {
            choices = choices ?
                choices.map(choice => {
                    return (<label key={choice.coercedValue.value}
                                   className="multiChoiceRadioOption"
                                   onClick={this.selectChoice}
                                   onBlur={this.onBlur}>
                        <input type="radio" name={this.props.radioGroupName}
                               value={choice.coercedValue.value}
                               checked={this.state.choice === choice.coercedValue.value}
                               onChange={this.onClick}/>
                        {choice.displayValue}
                        <br />
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
                           onChange={this.onClick}/>
                    <I18nMessage message={"noneOption"} />
                    <br />
                </label>);
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
        console.log('window Height: ', window.innerHeight);
        console.log('document Height: ', document.body.clientHeight);
        let reportToolsAndContentContainer = document.getElementsByClassName('reportToolsAndContentContainer');
        let reportContainer = document.getElementsByClassName('reportContainer');
        let agBodyContainer = document.getElementsByClassName('ag-body-container');
        let agBodyViewport = document.getElementsByClassName('ag-body-viewport');
        let agBodyViewportWrapper = document.getElementsByClassName('ag-body-viewport-wrapper');
        let agPinnedLeftColsViewport = document.getElementsByClassName('ag-pinned-left-cols-viewport');
        let aPinnedLeftColsContainer = document.getElementsByClassName('ag-pinned-left-cols-container');
        let agBody = document.getElementsByClassName('ag-body');
        if (agBodyContainer.length === 1) {
            console.log('MULTICHOICE reportToolsAndContentContainer', reportToolsAndContentContainer[0].offsetHeight);
            console.log('MULTICHOICE reportContainer', reportContainer[0].offsetHeight);
            console.log('MULTICHOICE agBodyContainer', agBodyContainer[0].offsetHeight);
            console.log('MULTICHOICE agBodyViewPort', agBodyViewport[0].offsetHeight);
            console.log('MULTICHOICE agBodyViewPortWrapper', agBodyViewportWrapper[0].offsetHeight);
            console.log('MULTICHOICE agPinnedLeftColsViewport', agPinnedLeftColsViewport[0].offsetHeight);
            console.log('MULTICHOICE aPinnedLeftColsContainer', aPinnedLeftColsContainer[0].offsetHeight);
            console.log('COMPUTED STYLE reportContainer: ', window.getComputedStyle(reportContainer[0]).getPropertyValue("padding-bottom"));
            console.log('COMPUTED STYLE agBodyContainer: ', window.getComputedStyle(agBodyContainer[0]).getPropertyValue("padding-bottom"));
            console.log('COMPUTED STYLE agBodyViewPort: ', window.getComputedStyle(agBodyViewport[0]).getPropertyValue("padding-bottom"));
            console.log('COMPUTED STYLE agBodyContainer: ', window.getComputedStyle(agBodyViewportWrapper[0]).getPropertyValue("padding-bottom"));
            console.log('COMPUTED STYLE agBodyContainer: ', window.getComputedStyle(agBodyContainer[0]).getPropertyValue("padding-bottom"));
            console.log('COMPUTED STYLE agBody: ', window.getComputedStyle(agBody[0]).getPropertyValue("height"));

        }
        return (
            <div className="multiChoiceContainer">
                {this.props.showAsRadio ?
                    <div className="multiChoiceRadioContainer">
                        { options }
                    </div> :
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
                    onBlur={this.onBlur} />
                }
            </div>
        );
    }
});

export default MultiChoiceFieldValueEditor;
