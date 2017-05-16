import React, {PropTypes} from 'react';
import Locale from "../../locales/locales";
import {I18nMessage} from '../../utils/i18nMessage';
import Select from '../select/reactSelectWrapper';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import './linkToRecordTableSelectionDialog.scss';

const LinkToRecordTableSelectionDialog = React.createClass({
    displayName: 'LinkToRecordTableSelectionDialog',
    propTypes: {},

    renderOption(option) {

        return (<div className="tableOption">
                <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={option.icon}/>
                <div className="tableLabel">{option.label}</div>
            </div>);
    },

    selectChoice(choice) {

        this.setState({selectedValue: choice});

    },

    getInitialState() {
        return { selectedValue: null }
    },

    getReactSelect() {
        const placeHolderMessage = "Select a table";
        const notFoundMessage = <I18nMessage message="selection.notFound"/>;
        let selectedValue = _.get(this, 'state.selectedValue');

        let choices = this.props.tables ?
            this.props.tables.map(table => {
                return {
                    value: table.id,
                    icon: table.tableIcon,
                    label: table.name
                };
            }) : [];

        choices = _.filter(choices, (choice) => choice.value !== this.props.childTableId);

        return <Select
            value={selectedValue}
            optionRenderer={this.renderOption}
            options={choices}
            onChange={this.selectChoice}
            placeholder={placeHolderMessage}
            noResultsText={notFoundMessage}
            autosize={false}
            clearable={false}
        />;
    },

    addToForm() {
        this.props.tableSelected(this.state.selectedValue.value);
    },

    render() {

        return (
            <MultiStepDialog show={this.props.show}
                             canProceed={this.state.selectedValue !== null}
                             onCancel={this.props.onCancel}
                             onFinished={this.addToForm}
                             finishedButtonLabel="Add to form"
                             classes={"tableDataConnectionDialog allowOverflow"}
                             titles={["Get another record"]}>
                <div>
                    <div className="tableChooserDescription">When you create or update a record, you can look up and get
                        info from a record in another table
                    </div>

                    <div className="tableChooserHeading">Where is the record you want to get?</div>
                    {this.getReactSelect()}
                </div>
            </MultiStepDialog>);
    }

});

export default LinkToRecordTableSelectionDialog;
