/* Defines custom formatters that can be used for customComponents for griddle columns*/
/* TODO: define exclusion in case server has some conflicting attributes -
*    for example for a numeric field server lets you select separator pattern - in that case should we ignore locale?
*
* */
import React from 'react';
import ReactDOM from 'react-dom';
import {I18nDate, I18nTime, I18nNumber} from '../../../utils/i18nMessage';
import {Input} from 'react-bootstrap';
import {DateRangePicker} from 'react-bootstrap-daterangepicker';
import RowEditActions from './rowEditActions';
import moment from 'moment';

const TextFormat = 1;
const NumberFormat = 2;
const DateFormat = 3;
const DateTimeFormat = 4;
const TimeFormat = 5;
const CheckBoxFormat = 6;
/**
 * simple non-validating cell editor for now
 */
const DefaultCellEditor = React.createClass({

    onChange(ev) {
        const newValue = ev.target.value;

        this.props.onChange(newValue);
    },
    render() {
        return <input ref="cellInput"
                      onChange={this.onChange}
                      tabIndex="0"
                      className="cellData"
                      type="text"
                      value={this.props.value}/>;
    }
});

const DateCellEditor = React.createClass({
    onChange(ev) {
        const newValue = ev.target.value;

        this.props.onChange(newValue);
    },
    render() {
        return <input ref="cellInput"
                      onChange={this.onChange}
                      tabIndex="0"
                      className="cellData"
                      type="date"
                      value={this.props.value}/>;
    }
});

const DateTimeCellEditor = React.createClass({
    onChange(ev) {
        const newValue = ev.target.value;

        this.props.onChange(newValue);
    },
    render() {
        return <input ref="cellInput"
                      onChange={this.onChange}
                      tabIndex="0"
                      className="cellData"
                      type="datetime-local"
                      value={this.props.value}/>;
    }
});

const TimeCellEditor = React.createClass({
    onChange(ev) {
        const newValue = ev.target.value;

        this.props.onChange(newValue);
    },
    render() {
        return <input ref="cellInput"
                      onChange={this.onChange}
                      tabIndex="0"
                      className="cellData"
                      type="time"
                      value={this.props.value}/>;
    }
});

const CheckBoxEditor = React.createClass({
    onChange(ev) {
        const newValue = ev.target.value;

        this.props.onChange(newValue);
    },
    render() {
        return <input ref="cellInput"
                      onChange={this.onChange}
                      tabIndex="0"
                      className="cellData"
                      type="checkbox"
                      value={this.props.value}/>;
    }
});

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

    getCellRenderer() {

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
            let rawInput = this.state.value ? this.state.value.replace(/(\[.*?\])/, '') : "";
            let dateTime = moment(rawInput).format("MM/DD/YY H:mm A");
            return <span className="cellData">
                {this.state.value && dateTime}
                </span>;
        }

        case TimeFormat: {
            let rawInput = this.state.value ? this.state.value.replace(/(\[.*?\])/, '') : "";

            let time = moment(rawInput).format("H:mm A");
            return <span className="cellData">
                {this.state.value && time}
                </span>;
        }
        case CheckBoxFormat:
            return <span className="cellData">
                    <input type="checkbox" disabled checked={this.state.value} />
                </span>;

        default: {
            return <span className="cellData">
                {this.state.value}
                </span>;
        }
        }
    },
    getCellEditor() {
        switch (this.props.type) {
        case CheckBoxFormat:
            return <CheckBoxEditor value={this.state.value} onChange={this.cellEdited} />;

        case DateFormat:
            return <DateCellEditor value={this.state.value} onChange={this.cellEdited} />;
            //return (<DateRangePicker startDate={moment('1/1/2014')} endDate={moment('3/1/2014')}>
            //    <div>Click Me To Open Picker!</div>
            //</DateRangePicker>);
            //return <div className="cellData">blah</div>
        case DateTimeFormat: {
            let rawInput = this.state.value ? this.state.value.replace(/(\[.*?\])/, '') : "";
            let dateTime = rawInput === "" ? moment() : moment(rawInput);
            let formatted = dateTime.format("YYYY-MM-DDThh:mm:ss");
            return <DateTimeCellEditor value={formatted} onChange={this.cellEdited}/>;
        }
        case TimeFormat: {
            let rawInput = this.state.value ? this.state.value.replace(/(\[.*?\])/, '') : "";
            let time = rawInput === "" ? moment() : moment(rawInput);
            return <TimeCellEditor value={time.format("HH:mm")} onChange={this.cellEdited}/>;
        }
        default: {
            return <DefaultCellEditor value={this.state.value} onChange={this.cellEdited} />;
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
        case TimeFormat: {
            let parts = value.split(/\:|\-/g);
            let time = moment(0).local();
            time.hours(parseInt(parts[0]), 'h');
            time.minutes(parseInt(parts[1]), 'm');
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
                                data={this.props.params.data}

                />}
                {this.getCellRenderer()}
                {this.getCellEditor()}
                </span>);

    }
});

export const DateFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={DateFormat} params={this.props.params} />;
    }
});

export const DateTimeFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={DateTimeFormat} params={this.props.params} />;
    }
});

export const TimeFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={TimeFormat} params={this.props.params} />;
    }
});

export const NumericFormatter = React.createClass({
    render: function() {
        return  <CellFormatter type={NumberFormat} params={this.props.params}/>;
    }
});

export const TextFormatter = React.createClass({

    render: function() {
        return  <CellFormatter type={TextFormat} params={this.props.params} />;
    }
});

export const CheckBoxFormatter = React.createClass({

    render: function() {
        return  <CellFormatter type={CheckBoxFormat} params={this.props.params} />;
    }
});
