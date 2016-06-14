/* Defines custom formatters that can be used for customComponents for griddle columns*/
/* TODO: define exclusion in case server has some conflicting attributes -
*    for example for a numeric field server lets you select separator pattern - in that case should we ignore locale?
*
* */
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Locale from '../../../locales/locales';
import {I18nDate, I18nTime, I18nNumber} from '../../../utils/i18nMessage';
import RowEditActions from './rowEditActions';
import {DefaultFieldEditor, ComboBoxFieldEditor, DateFieldEditor, DateTimeFieldEditor, TimeFieldEditor, UserFieldEditor, CheckBoxFieldEditor} from '../../fields/fieldEditors';
import {UserCellRenderer, NumberCellRenderer, DateCellRenderer, TextCellRenderer} from './cellRenderers';

import * as dateTimeFormatter from '../../../../../common/src/formatter/dateTimeFormatter';
import * as timeOfDayFormatter from '../../../../../common/src/formatter/timeOfDayFormatter';
import * as numericFormatter from '../../../../../common/src/formatter/numericFormatter';

import IconActions from '../../actions/iconActions';

import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.css';
import './dateTimePicker.scss';

const TextFormat = 1;
const NumberFormat = 2;
const DateFormat = 3;
const DateTimeFormat = 4;
const TimeFormat = 5;
const CheckBoxFormat = 6;
const UserFormat = 7;
const CurrencyFormat = 8;
const PercentFormat = 9;
const RatingFormat = 10;

/**
 * cell formatter (renderer)
 */
const CellFormatter = React.createClass({

    propTypes: {
        type: React.PropTypes.number.isRequired,
        colDef: React.PropTypes.object,
        initialValue: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            initialValue: null
        };
    },
    /* setting state from props is an anti-pattern but we're doing it to avoid rerendering */
    getInitialState() {
        return {
            value: this.props.initialValue
        };
    },

    /**
     * render the cell value (read-only, hidden when row is in edit mode)
     */
    renderCellValue() {

        const attributes = this.props.colDef.datatypeAttributes;

        switch (this.props.type) {
        case NumberFormat:
        case RatingFormat:
            return (<span className="cellData">
                {this.state.value.display && <NumberCellRenderer value={this.state.value.display} attributes={attributes} />}
                </span>);

        case UserFormat:
            return (<span className="cellData">
                <UserCellRenderer value={this.state.value.display} />
                </span>);

        case DateFormat:
            return (<span className="cellData">
                <DateCellRenderer value={this.state.value.display} />
                </span>);

        case DateTimeFormat: {
            return (<span className="cellData">
                <DateCellRenderer value={this.state.value.display} />
                </span>);
        }

        case TimeFormat: {
            return (<span className="cellData">
                <DateCellRenderer value={this.state.value.display} />
                </span>);
        }
        case CheckBoxFormat:
            return (<span className="cellData">
                    <input type="checkbox" disabled checked={this.state.value.value} />
                </span>);

        case PercentFormat:
        case CurrencyFormat:

        case TextFormat:
        default: {
            return (<span className="cellData">
                <TextCellRenderer value={this.state.value.display} />
                </span>);
        }
        }
    },

    /**
     * render the cell editor (hidden when row is NOT in edit mode)
     */
    renderCellEditor() {
        switch (this.props.type) {
        case CheckBoxFormat:
            return <CheckBoxFieldEditor value={this.state.value.value} onChange={this.cellEdited} />;

        case DateFormat: {
            return <DateFieldEditor value={this.state.value.value} onChange={this.dateTimeCellEdited} />;
        }

        case DateTimeFormat: {
            return <DateTimeFieldEditor value={this.state.value.value} onChange={this.dateTimeCellEdited} />;
        }

        case TimeFormat: {
            return <TimeFieldEditor value={this.state.value.value} onChange={this.dateTimeCellEdited} />;
        }

        case NumberFormat:
        case RatingFormat:
        case CurrencyFormat:
        case PercentFormat: {
            return <DefaultFieldEditor value={this.state.value.value}
                                      type="number"
                                      onChange={this.numericCellEdited} />;
        }

        case UserFormat: {
            return <UserFieldEditor value={this.state.value.value}
                                   onChange={this.cellEdited} />;
        }
        default: {

            if (this.props.colDef.choices) {
                return <ComboBoxFieldEditor choices={this.props.colDef.choices} value={this.state.value.value}
                                          onChange={this.cellEdited} />;
            } else {
                return <DefaultFieldEditor value={this.state.value.value}
                                          onChange={this.cellEdited} />;
            }
        }
        }
    },

    /**
     * cell was edited, update the r/w and r/o value
     * @param newValue
     */
    cellEdited(value) {
        let newDisplay = value;

        this.state.value.value = value;
        this.state.value.display = newDisplay;
        this.setState(this.state);
    },

    dateTimeCellEdited(value) {
        let newValue = value;
        this.state.value.value = value;

        let newDisplay = value;

        switch (this.props.type) {
        case DateFormat: {
            // normalized form is YYYY-MM-DD
            newDisplay = dateTimeFormatter.format(this.state.value, this.props.colDef.datatypeAttributes);
            break;
        }
        case TimeFormat: {
            // normalized form is 1970-01-01THH:MM:SSZ
            newDisplay = timeOfDayFormatter.format(this.state.value, this.props.colDef.datatypeAttributes);
            break;
        }
        case DateTimeFormat: {
            // normalized form is YYYY-MM-DDTHH:MM:SSZ
            newDisplay = dateTimeFormatter.format(this.state.value, this.props.colDef.datatypeAttributes);
            break;
        }
        }

        this.state.value.display = newDisplay;
        this.setState(this.state);
    },
    numericCellEdited(value) {
        let newValue = Number(value);

        this.state.value.value = newValue;

        let newDisplay = numericFormatter.format(this.state.value, this.props.colDef.datatypeAttributes);

        this.state.value.display = newDisplay;
        this.setState(this.state);
    },
    render: function() {
        // render the cell value and editor (CSS will hide one or the other)

        return (<span className="cellWrapper">
            {this.props.initialValue !== null && this.renderCellValue()}
            {this.props.initialValue !== null && this.renderCellEditor()}
        </span>);
    }
});

// formatter classes (cell formatters render an editor and a display value)
// there is work to be done to use display formats for both input and output
// The output part is at least partly done in Node now but that needs to be implemented in the UI layer!!!)

export const TextCellFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={TextFormat} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});

export const DateCellFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={DateFormat} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});

export const DateTimeCellFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={DateTimeFormat} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});

export const TimeCellFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={TimeFormat} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});

export const NumericCellFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={NumberFormat}  colDef={this.props.params.column.colDef} initialValue={this.props.params.value}/>;
    }
});

export const CurrencyCellFormatter = React.createClass({

    render: function() {
        return  <CellFormatter type={CurrencyFormat} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});

export const PercentCellFormatter = React.createClass({

    render: function() {
        return  <CellFormatter type={PercentFormat} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});

export const RatingCellFormatter = React.createClass({

    render: function() {
        return  <CellFormatter type={RatingFormat} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});
export const UserCellFormatter = React.createClass({

    render: function() {
        return  <CellFormatter type={UserFormat} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});
export const CheckBoxCellFormatter = React.createClass({

    render: function() {
        return  <CellFormatter type={CheckBoxFormat} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});

export const SelectionColumnCheckBoxCellFormatter = React.createClass({

    onClickEdit() {
        if (this.props.params.context.defaultActionCallback) {
            this.props.params.context.defaultActionCallback(this.props.params.data);
        }
    },

    render() {
        const record = Locale.getMessage('records.singular');
        const actions = [
            {msg: Locale.getMessage('selection.edit') + " " + record, rawMsg: true, className:'edit', icon:'edit', onClick: this.onClickEdit},
            {msg: Locale.getMessage('selection.print') + " " + record, rawMsg: true, className:'print', icon:'print'},
            {msg: Locale.getMessage('selection.email') + " " + record, rawMsg: true, className:'email', icon:'mail'},
            {msg: Locale.getMessage('selection.copy') + " " + record, rawMsg: true, className:'duplicate', icon:'duplicate'},
            {msg: Locale.getMessage('selection.delete') + " " + record, rawMsg: true, className:'delete', icon:'delete'}
        ];

        return (<div>
            <RowEditActions flux={this.props.params.context.flux}
                            api={this.props.params.api}
                            data={this.props.params.data} />
            <IconActions dropdownTooltip={false} className="recordActions" pullRight={false} menuIcons actions={actions} maxButtonsBeforeMenu={1} />
        </div>);
    }
});

