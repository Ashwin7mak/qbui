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
import {CellValueRenderer, UserCellValueRenderer, NumberCellValueRenderer, DateCellValueRenderer, TextCellValueRenderer} from './cellValueRenderers';
import CellEditor from './cellEditor'

import * as dateTimeFormatter from '../../../../../common/src/formatter/dateTimeFormatter';
import * as timeOfDayFormatter from '../../../../../common/src/formatter/timeOfDayFormatter';
import * as numericFormatter from '../../../../../common/src/formatter/numericFormatter';

import IconActions from '../../actions/iconActions';

import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.css';
import './dateTimePicker.scss';

import * as formats from '../../../constants/fieldFormats';

/**
 * cell renderer
 */
const CellRenderer = React.createClass({

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
            valueAndDisplay: this.props.initialValue
        };
    },



    render: function() {
        // render the cell value and editor (CSS will hide one or the other)

        return (<span className="cellWrapper">
            {this.props.initialValue !== null &&
            <CellValueRenderer value={this.state.valueAndDisplay.value}
                               display={this.state.valueAndDisplay.display}
                               attributes={this.props.colDef.datatypeAttributes}/>  }

            {this.props.initialValue !== null &&
            <CellEditor type={this.props.type}
                        value={this.state.valueAndDisplay.value}
                        colDef={this.props.colDef}
                        onChange={this.onChange}/>  }
        </span>);
    },

    onChange(value) {
        switch (this.props.type) {
        case formats.DATE_FORMAT:
        case formats.DATETIME_FORMAT:
        case formats.TIME_FORMAT: {
            this.dateTimeCellEdited(value);
            break;
        };
        case formats.NUMBER_FORMAT:
        case formats.RATING_FORMAT:
        case formats.CURRENCY_FORMAT:
        case formats.PERCENT_FORMAT: {
            this.numericCellEdited(value);
            break;
        }
        default: {
            this.cellEdited(value);
        }
        }
    },
    /**
     * cell was edited, update the r/w and r/o value
     * @param newValue
     */
    cellEdited(value) {
        let newDisplay = value;

        this.state.valueAndDisplay.value = value;
        this.state.valueAndDisplay.display = newDisplay;

        this.setState(this.state);
    },

    /**
     * date, datetime, or time cell was edited
     * @param value
     */
    dateTimeCellEdited(value) {
        let newValue = value;
        this.state.valueAndDisplay.value = value;

        let newDisplay = value;

        switch (this.props.type) {
        case formats.DATE_FORMAT: {
            // normalized form is YYYY-MM-DD
            newDisplay = dateTimeFormatter.format(this.state.valueAndDisplay, this.props.colDef.datatypeAttributes);
            break;
        }
        case formats.TIME_FORMAT: {
            // normalized form is 1970-01-01THH:MM:SSZ
            newDisplay = timeOfDayFormatter.format(this.state.valueAndDisplay, this.props.colDef.datatypeAttributes);
            break;
        }
        case formats.DATETIME_FORMAT: {
            // normalized form is YYYY-MM-DDTHH:MM:SSZ
            newDisplay = dateTimeFormatter.format(this.state.valueAndDisplay, this.props.colDef.datatypeAttributes);
            break;
        }
        }

        this.state.value.display = newDisplay;
        this.setState(this.state);
    },

    /**
     * numeric cell edited, update the display value from common formatter
     * @param value
     */
    numericCellEdited(value) {
        let newValue = Number(value);

        this.state.valueAndDisplay.value = newValue;

        let newDisplay = numericFormatter.format(this.state.valueAndDisplay, this.props.colDef.datatypeAttributes);

        this.state.valueAndDisplay.display = newDisplay;
        this.setState(this.state);
    }
});

// formatter classes (cell formatters render an editor and a display value)

export const TextCellRenderer = React.createClass({
    render: function() {
        return  <CellRenderer type={formats.TEXT_FORMAT} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});

export const DateCellRenderer = React.createClass({
    render: function() {
        return  <CellRenderer type={formats.DATE_FORMAT} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});

export const DateTimeCellRenderer = React.createClass({
    render: function() {
        return  <CellRenderer type={formats.DATETIME_FORMAT} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});

export const TimeCellRenderer = React.createClass({
    render: function() {
        return  <CellRenderer type={formats.TIME_FORMAT} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});

export const NumericCellRenderer = React.createClass({
    render: function() {
        return  <CellRenderer type={formats.NUMBER_FORMAT}  colDef={this.props.params.column.colDef} initialValue={this.props.params.value}/>;
    }
});

export const CurrencyCellRenderer = React.createClass({

    render: function() {
        return  <CellRenderer type={formats.CURRENCY_FORMAT} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});

export const PercentCellRenderer = React.createClass({

    render: function() {
        return  <CellRenderer type={formats.PERCENT_FORMAT} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});

export const RatingCellRenderer = React.createClass({

    render: function() {
        return  <CellRenderer type={formats.RATING_FORMAT} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});
export const UserCellRenderer = React.createClass({

    render: function() {
        return  <CellRenderer type={formats.USER_FORMAT} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});
export const CheckBoxCellRenderer = React.createClass({

    render: function() {
        return  <CellRenderer type={formats.CHECKBOX_FORMAT} colDef={this.props.params.column.colDef} initialValue={this.props.params.value} />;
    }
});

export const SelectionColumnCheckBoxCellRenderer = React.createClass({

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
            <IconActions dropdownTooltip={true} className="recordActions" pullRight={false} menuIcons actions={actions} maxButtonsBeforeMenu={1} />
        </div>);
    }
});

