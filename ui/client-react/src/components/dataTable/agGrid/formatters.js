/* Defines custom formatters that can be used for customComponents for griddle columns*/
/* TODO: define exclusion in case server has some conflicting attributes -
*    for example for a numeric field server lets you select separator pattern - in that case should we ignore locale?
*
* */
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {I18nDate, I18nTime, I18nNumber} from '../../../utils/i18nMessage';
import RowEditActions from './rowEditActions';
import {DefaultCellEditor, ComboBoxCellEditor, DateCellEditor, DateTimeCellEditor, TimeCellEditor, CheckBoxEditor} from './cellEditors';
import IconActions from '../../actions/iconActions';

import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.css';

const TextFormat = 1;
const NumberFormat = 2;
const DateFormat = 3;
const DateTimeFormat = 4;
const TimeFormat = 5;
const CheckBoxFormat = 6;

/**
 * helper function to format date
 * @param dateStr raw date string, empty string for current dateTime
 * @param format moment.js format
 * @returns moment.js formatted date
 */
function formatDate(dateStr, format) {

    if (dateStr) {
        const fixedDate = dateStr.replace(/(\[.*?\])/, ''); // remove [utc] suffix if present
        return moment(fixedDate).format(format);
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

        case TimeFormat: {
            let time = formatDate(this.state.value, "h:mm:ss A");
            return <span className="cellData">
                {this.state.value && time}
                </span>;
        }
        case CheckBoxFormat:
            return <span className="cellData">
                    <input type="checkbox" disabled checked={this.state.value} />{this.state.value}
                </span>;

        default: {
            return <span className="cellData">
                {this.state.value}
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

const CheckBoxFormatter = React.createClass({

    render: function() {
        return  <CellFormatter type={CheckBoxFormat} params={this.props.params} />;
    }
});

const SelectionColumnCheckBoxFormatter = React.createClass({

    getRecordActions() {
        const actions = [
            {msg: 'selection.edit', icon:'edit'},

            {msg: 'selection.print', icon:'print'},
            {msg: 'selection.email', icon:'mail'},
            {msg: 'selection.copy', icon:'duplicate'},
            {msg: 'selection.delete', icon:'delete'}
        ];

        return (<IconActions className="recordActions" actions={actions} maxButtonsBeforeMenu={1} />);
    },

    render() {
        return this.getRecordActions();
    }
});

export {DateFormatter, DateTimeFormatter, TimeFormatter, NumericFormatter, TextFormatter, CheckBoxFormatter, SelectionColumnCheckBoxFormatter};
