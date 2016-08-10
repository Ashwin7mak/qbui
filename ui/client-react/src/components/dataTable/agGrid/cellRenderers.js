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
import {CellValueRenderer} from './cellValueRenderers';
import CellEditor from './cellEditor';

import * as dateTimeFormatter from '../../../../../common/src/formatter/dateTimeFormatter';
import * as timeOfDayFormatter from '../../../../../common/src/formatter/timeOfDayFormatter';
import * as numericFormatter from '../../../../../common/src/formatter/numericFormatter';

import IconActions from '../../actions/iconActions';

import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.css';
import './dateTimePicker.scss';

import * as formats from '../../../constants/fieldFormats';
import _ from 'lodash';
import Logger from "../../../utils/logger";


let logger = new Logger();

/**
 * cell renderer
 */
const CellRenderer = React.createClass({

    propTypes: {
        type: React.PropTypes.number.isRequired,
        colDef: React.PropTypes.object,
        onTabColumn: React.PropTypes.func,
        initialValue: React.PropTypes.object,
        editing: React.PropTypes.bool,
        validateFieldValue: React.PropTypes.func,
        qbGrid: React.PropTypes.bool // temporary, used to determine if we need to render both a renderer and editor (for ag-grid)
    },

    getDefaultProps() {
        return {
            initialValue: null,
            qbGrid: false
        };
    },

    /* setting state from props is an anti-pattern but we're doing it to avoid re-rendering */
    getInitialState() {
        if (this.props.initialValue) {

            return {
                valueAndDisplay:  {
                    id: this.props.initialValue.id,
                    value : this.props.initialValue.value,
                    display : this.props.initialValue.display,
                    isInvalid: false,
                    invalidMessage: ''
                }
            };
        } else {
            logger.warn('"this.props.initialValue" in getInitialState is undefined');
            return {};
        }
    },

    /**
     * inform the grid that we've tabbed out of an editor
     */
    onTabColumn() {
        if (this.props.params) {
            this.props.params.context.cellTabCallback(this.props.colDef);
        }
    },

    /**
     *
     * @returns {*}
     */
    getClassNameForType(cellType) {
        switch (cellType) {
        case formats.DATE_FORMAT:            return "dateFormat";
        case formats.DATETIME_FORMAT:        return "dateTimeFormat";
        case formats.TIME_FORMAT:            return "timeFormat";
        case formats.NUMBER_FORMAT:          return "numberFormat";
        case formats.RATING_FORMAT:          return "ratingFormat";
        case formats.CURRENCY_FORMAT:        return "currencyFormat";
        case formats.PERCENT_FORMAT:         return "percentFormat";
        case formats.DURATION_FORMAT:        return "durationFormat";
        case formats.PHONE_FORMAT:           return "phoneFormat";
        case formats.TEXT_FORMAT:            return "textFormat";
        case formats.MULTI_LINE_TEXT_FORMAT: return "multiLineTextFormat";
        default:                             return "textFormat";
        }
    },

    render() {

        let isEditable = !this.props.colDef.builtIn;

        let key = ''; // for uniq key
        if (this.props.params && this.props.params.data && this.props.params.context &&
                this.props.params.rowIndex && this.props.initialValue && this.props.initialValue.id &&
                this.props.params.context.keyField && this.props.params.data[this.props.params.context.keyField].value) {
            let recId = this.props.params.data[this.props.params.context.keyField].value;
            key = this.props.params.rowIndex + "-fid" + this.props.initialValue.id + '-recId' + recId ;
        }

        if (this.props.initialValue === null) {
            return (<span className="emptyCell" />);
        }

        // the reactabular grid doesn't need to render an editor unless it's actually editing

        let cellType = this.props.type;

        // use multi-line text editor and renderer for qbGrid only to demonstrate auto resizing rows
        if (this.props.qbGrid && (cellType === formats.TEXT_FORMAT)) {
            cellType = formats.MULTI_LINE_TEXT_FORMAT;
        }

        return (

            <span className={"cellWrapper " + this.getClassNameForType(this.props.type)}>

                { isEditable && (this.props.editing || !this.props.qbGrid) &&
                    <CellEditor type={cellType}
                                value={this.state.valueAndDisplay.value}
                                colDef={this.props.colDef}
                                onChange={this.onChange}
                                onValidated={this.onValidated}
                                key={key + '-edt'}
                                onTabColumn={this.onTabColumn}
                                validateFieldValue={this.props.validateFieldValue}
                                isInvalid={this.state.valueAndDisplay.isInvalid}
                                invalidMessage={this.state.valueAndDisplay.invalidMessage}
                    />
                }

                { (!isEditable || !this.props.editing || !this.props.qbGrid) &&
                    <CellValueRenderer type={cellType}
                                       isEditable={isEditable}
                                       value={this.state.valueAndDisplay.value}
                                       key={key + '-dsp'}
                                       display={this.state.valueAndDisplay.display}
                                       attributes={this.props.colDef.datatypeAttributes}/>
                }
            </span>);
    },

    onValidated(results) {
        this.cellValidated(results);
    },

    onChange(value) {
        switch (this.props.type) {
        case formats.DATE_FORMAT:
        case formats.DATETIME_FORMAT:
        case formats.TIME_FORMAT:
            this.dateTimeCellEdited(value);
            break;

        case formats.NUMBER_FORMAT:
        case formats.RATING_FORMAT:
        case formats.CURRENCY_FORMAT:
        case formats.PERCENT_FORMAT:
            this.numericCellEdited(value);
            break;

        default:
            this.cellEdited(value);

        }
    },

    cellChanges() {
        if (this.props &&
            _.has(this.props, 'params') &&
            _.has(this.props.params, 'data') &&
            _.has(this.props.params, 'column.colId') &&
            _.has(this.props.params, 'context.keyField') &&
            _.has(this.props.params, 'colDef.id')) {

            let change = {
                values: {
                    oldVal: this.props.params.data[this.props.params.column.colId],
                    newVal: this.state.valueAndDisplay
                },
                recId: this.props.params.data[this.props.params.context.keyField].value,
                fid: +this.props.params.colDef.id,
                fieldName: this.props.params.column.colId
            };
            this.props.params.context.onFieldChange(change);
        }
    },
    /**
     * cell was edited, update the r/w and r/o value
     * @param value
     */
    cellEdited(value) {
        let theVals = {
            value: value,
            display: value
        };

        this.setState({valueAndDisplay : Object.assign({}, theVals)}, ()=>{this.cellChanges();});
    },

    /**
     * cell validate change update
     * @param result of validation
     */
    cellValidated(result) {
        let current =  Object.assign({}, this.state.valueAndDisplay);
        current.isInvalid = result.isInvalid;
        current.invalidMessage = result.invalidMessage;
        this.setState({valueAndDisplay : current}, ()=>{this.cellChanges();});
    },


    /**
     * date, datetime, or time cell was edited
     * @param newValue
     */
    dateTimeCellEdited(newValue) {
        let theVals = {
            value: newValue,
        };
        switch (this.props.type) {
        case formats.DATE_FORMAT: {
            // normalized form is YYYY-MM-DD
            theVals.display = dateTimeFormatter.format(theVals, this.props.colDef.datatypeAttributes);
            break;
        }
        case formats.TIME_FORMAT: {
            // normalized form is 1970-01-01THH:MM:SSZ
            theVals.display = timeOfDayFormatter.format(theVals, this.props.colDef.datatypeAttributes);
            break;
        }
        case formats.DATETIME_FORMAT: {
            // normalized form is YYYY-MM-DDTHH:MM:SSZ
            theVals.display = dateTimeFormatter.format(theVals, this.props.colDef.datatypeAttributes);
            break;
        }
        default: {
            theVals.display = newValue;
            break;
        }
        }

        this.setState({valueAndDisplay : Object.assign({}, theVals)}, ()=>{this.cellChanges();});
    },

    /**
     * numeric cell edited, update the display value from common formatter
     * @param value
     */
    numericCellEdited(value) {
        let theVals = {
            value: Number(value)
        };
        theVals.display = numericFormatter.format(theVals, this.props.colDef.datatypeAttributes);

        this.setState({valueAndDisplay : Object.assign({}, theVals)}, ()=>{this.cellChanges();});
    }
});

// formatter classes (cell formatters render an editor and a display value)'
class CellRendererFactory  {
    static makeCellRenderer(type, props) {
        return <CellRenderer type={type}
                             validateFieldValue={props.params && props.params.context ? props.params.context.validateFieldValue : null}
                             invalidMessage={props.invalidMessage}
                             isInvalid={props.isInvalid}
                             colDef={props.params.column.colDef}
                             initialValue={props.params.value}
                             editing={props.editing}
                             params={props.params}
                             qbGrid={props.qbGrid}
        />;
    }
}

export const TextCellRenderer = React.createClass({
    render() {
        let format = formats.TEXT_FORMAT;
        if (this.props.params && this.props.params.column && this.props.params.column.colDef &&
            this.props.params.column.colDef.datatypeAttributes &&
            this.props.params.column.colDef.datatypeAttributes.clientSideAttributes &&
            this.props.params.column.colDef.datatypeAttributes.clientSideAttributes.num_lines &&
            this.props.params.column.colDef.datatypeAttributes.clientSideAttributes.num_lines > 1) {
            format = formats.MULTI_LINE_TEXT_FORMAT;
        }
        return CellRendererFactory.makeCellRenderer(format, this.props);
    }
});

export const DateCellRenderer = React.createClass({
    render() {
        return CellRendererFactory.makeCellRenderer(formats.DATE_FORMAT, this.props);
    }
});

export const DateTimeCellRenderer = React.createClass({
    render() {
        return CellRendererFactory.makeCellRenderer(formats.DATETIME_FORMAT, this.props);
    }
});

export const TimeCellRenderer = React.createClass({
    render() {
        return CellRendererFactory.makeCellRenderer(formats.TIME_FORMAT, this.props);
    }
});

export const DurationCellRenderer = React.createClass({
    render: function() {
        return CellRendererFactory.makeCellRenderer(formats.DURATION_FORMAT, this.props);
    }
});

export const PhoneCellRenderer = React.createClass({
    render: function() {
        return CellRendererFactory.makeCellRenderer(formats.PHONE_FORMAT, this.props);
    }
});

export const NumericCellRenderer = React.createClass({
    render() {
        return CellRendererFactory.makeCellRenderer(formats.NUMBER_FORMAT, this.props);
    }
});

export const CurrencyCellRenderer = React.createClass({
    render() {
        return CellRendererFactory.makeCellRenderer(formats.CURRENCY_FORMAT, this.props);
    }
});

export const PercentCellRenderer = React.createClass({

    render() {
        return CellRendererFactory.makeCellRenderer(formats.PERCENT_FORMAT, this.props);
    }
});

export const RatingCellRenderer = React.createClass({

    render() {
        return CellRendererFactory.makeCellRenderer(formats.RATING_FORMAT, this.props);
    }
});
export const UserCellRenderer = React.createClass({

    render() {
        return CellRendererFactory.makeCellRenderer(formats.USER_FORMAT, this.props);
    }
});
export const CheckBoxCellRenderer = React.createClass({

    render() {
        return CellRendererFactory.makeCellRenderer(formats.CHECKBOX_FORMAT, this.props);
    }
});

export const SelectionColumnCheckBoxCellRenderer = React.createClass({


    onClickEdit() {
        if (this.props.params.context.defaultActionCallback) {
            this.props.params.context.defaultActionCallback(this.props.params.data);
        }
    },

    /**
     * placeholder for deleting a record
     */
    onClickDelete() {
        if (this.props.params.context.onRecordDelete) {
            this.props.params.context.onRecordDelete(this.props.params.data);
        }
    },

    render() {
        const record = Locale.getMessage('records.singular');
        const actions = [
            {msg: Locale.getMessage('selection.edit') + " " + record, rawMsg: true, className:'edit', icon:'edit', onClick: this.onClickEdit},
            {msg: Locale.getMessage('selection.print') + " " + record, rawMsg: true, className:'print', icon:'print'},
            {msg: Locale.getMessage('selection.email') + " " + record, rawMsg: true, className:'email', icon:'mail'},
            {msg: Locale.getMessage('selection.copy') + " " + record, rawMsg: true, className:'duplicate', icon:'duplicate'},
            {msg: Locale.getMessage('selection.delete') + " " + record, rawMsg: true, className:'delete', icon:'delete', onClick: this.onClickDelete}
        ];

        return (<div>
            <RowEditActions flux={this.props.params.context.flux}
                            api={this.props.params.api}
                            data={this.props.params.data}
                            params={this.props.params}
            />
            <IconActions dropdownTooltip={true} className="recordActions" pullRight={false} menuIcons actions={actions} maxButtonsBeforeMenu={1} />
        </div>);
    }
});

