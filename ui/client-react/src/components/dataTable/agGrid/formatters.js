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
import {DefaultCellEditor, ComboBoxCellEditor, DateCellEditor, DateTimeCellEditor, TimeCellEditor, UserCellEditor, CheckBoxEditor} from './cellEditors';
import {UserCellRenderer} from './cellRenderers';

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

/**
 * helper function to format date
 * @param dateStr raw date string, empty string for current dateTime
 * @param format moment.js format
 * @returns moment.js formatted date
 */
function formatDate(dateStr, format) {

    if (dateStr) {
        const fixedDate = dateStr.replace(/(\[.*?\])/, ''); // remove [utc] suffix if present
        return moment(new Date(fixedDate)).format(format);
    }
    return moment().format(format);
}


/**
 * cell formatter (renderer)
 */
const CellFormatter = React.createClass({

    propTypes: {
        type: React.PropTypes.number.isRequired,
        params: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            value: this.props.params.value
        };
    },

    /**
     * render the cell value (read-only, hidden when row is in edit mode)
     */
    renderCellValue() {

        switch (this.props.type) {
        case NumberFormat:
            return <span className="cellData">
                {this.state.value && <I18nNumber value={this.state.value}></I18nNumber>}
                </span>;

        //case UserFormat:
        //    return <span className="cellData">
        //        <UserCellRenderer value={this.state.value} />
        //        </span>;

        case DateFormat:
            return <span className="cellData">
                {this.state.value && <I18nDate value={this.state.value}></I18nDate>}
                </span>;

        case DateTimeFormat: {
            let dateTime = formatDate(this.state.value, "MM/DD/YY h:mm:ss A");

            return <span className="cellData">
                {this.state.value && dateTime}
                </span>;
        }

        //case TimeFormat: {
        //    let time = formatDate(this.state.value, "h:mm:ss A");
        //    return <span className="cellData">
        //        {this.state.value && time}
        //        </span>;
        //}
        case CheckBoxFormat:
            return <span className="cellData">
                    <input type="checkbox" disabled checked={this.state.value} />{this.state.value}
                </span>;

        default: {
            let display = this.state.value;
            if (typeof display === 'object') {
                display = JSON.stringify(display);
            }
            return <span className="cellData">
                {display}
                </span>;
        }
        }
    },

    /**
     * render the cell editor (hidden when row is NOT in edit mode)
     */
    renderCellEditor() {
        switch (this.props.type) {
        case CheckBoxFormat:
            return <CheckBoxEditor value={this.state.value} onChange={this.cellEdited} />;

        case DateFormat: {
            let formatted = this.state.value ? formatDate(this.state.value, "YYYY-MM-DD") : "";
            return <DateCellEditor value={formatted} onChange={this.cellEdited}/>;
        }
        case DateTimeFormat: {
            let formatted = this.state.value ? formatDate(this.state.value, "YYYY-MM-DDThh:mm:ss A") : "" ;
            return <DateTimeCellEditor value={formatted} onChange={this.cellEdited}/>;
        }
        case TimeFormat: {
            let formatted = this.state.value ? formatDate(this.state.value, "YYYY-MM-DDThh:mm:ss A") : "" ;

            return <TimeCellEditor value={formatted} onChange={this.cellEdited}/>;
        }
        case NumberFormat: {
            return <DefaultCellEditor value={this.state.value}
                                      type="number"
                                      onChange={this.cellEdited}/>;
        }
        case UserFormat: {
            return <UserCellEditor value={this.state.value}
                                   onChange={this.cellEdited}/>;
        }
        default: {

            if (this.props.params.colDef.choices) {
                return <ComboBoxCellEditor choices={this.props.params.colDef.choices} value={this.state.value}
                                          onChange={this.cellEdited}/>;
            } else {
                return <DefaultCellEditor value={this.state.value}
                                          onChange={this.cellEdited}/>;
            }
        }
        }
    },
    /**
     * cell was edited, update the r/w and r/o value
     * @param newValue
     */
    cellEdited(value) {
        let newValue = value;
        switch (this.props.type) {
        case TimeFormat:
        case DateTimeFormat: {
            let time = moment(value, "YYYY-MM-DDThh:mm:ss A");
            time.seconds(0);
            newValue = time.utc().format();
        }
        }
        let change = {oldVal : this.props.params.data[this.props.params.column.colId],
                    newVal: newValue, fid: +this.props.params.colDef.id};
        this.props.params.context.recordChanges[this.props.params.colDef.id] = change
        // this.props.params.context.recordChanges[this.props.params.colDef.headerName] = change;
        this.setState({value: newValue});
    },

    render: function() {
        // render the cell value and editor (CSS will hide one or the other)

        return (<span className="cellWrapper">
                {this.props.params.colDef && this.props.params.colDef.addEditActions &&
                    <RowEditActions flux={this.props.params.context.flux}
                                    api={this.props.params.api}
                                    data={this.props.params.data} />
                }
                {this.renderCellValue()}
                {this.renderCellEditor()}
                </span>);
    }
});

// formatter classes (cell formatters render an editor and a display value)
// there is work to be done to use display formats for both input and output
// The output part is at least partly done in Node now but that needs to be implemented in the UI layer!!!)

const DateFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={DateFormat} params={this.props.params} />;
    }
});

const DateTimeFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={DateTimeFormat} params={this.props.params} />;
    }
});

const TimeFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={TimeFormat} params={this.props.params} />;
    }
});

const NumericFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={NumberFormat} params={this.props.params}/>;
    }
});

const TextFormatter = React.createClass({

    render: function() {
        return  <CellFormatter type={TextFormat} params={this.props.params} />;
    }
});
const UserFormatter = React.createClass({

    render: function() {
        return  <CellFormatter type={UserFormat} params={this.props.params} />;
    }
});
const CheckBoxFormatter = React.createClass({

    render: function() {
        return  <CellFormatter type={CheckBoxFormat} params={this.props.params} />;
    }
});

const SelectionColumnCheckBoxFormatter = React.createClass({

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
                            data={this.props.params.data}
                            params={this.props.params}
            />
            <IconActions dropdownTooltip={false} className="recordActions" pullRight={false} menuIcons actions={actions} maxButtonsBeforeMenu={1} />
        </div>);
    }
});

export {DateFormatter, DateTimeFormatter, TimeFormatter, NumericFormatter, TextFormatter, UserFormatter, CheckBoxFormatter, SelectionColumnCheckBoxFormatter};
