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
import CellValueRenderer from './cellValueRenderer';
import CellEditor from './cellEditor';

import * as dateTimeFormatter from '../../../../../common/src/formatter/dateTimeFormatter';
import * as timeOfDayFormatter from '../../../../../common/src/formatter/timeOfDayFormatter';
import * as numericFormatter from '../../../../../common/src/formatter/numericFormatter';
import * as textFormatter from '../../../../../common/src/formatter/textFormatter';

import IconActions from '../../actions/iconActions';

import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.css';
import './dateTimePicker.scss';

import FieldFormats from '../../../utils/fieldFormats';
import _ from 'lodash';
import Logger from "../../../utils/logger";


let logger = new Logger();
// formatter classes (cell formatters render an editor and a display value)'
class CellRendererFactory  {
    static getCellKey(props) {
        let key = ''; // for uniq key rec+fid
        let recId;
        if (props &&
            _.has(props, 'params') &&
            _.has(props.params, 'value.id') &&
            _.has(props.params, 'data') &&
            _.has(props.params, 'context.uniqueIdentifier') &&
            _.has(props.params.data[props.params.context.uniqueIdentifier], 'value') &&
            _.has(props.params, 'rowIndex')) {
            recId = props.params.data[props.params.context.uniqueIdentifier].value;
            key = props.params.rowIndex + "-fid" + props.params.value.id + '-recId' + recId ;
        }
        return key;
    }

    static makeCellRenderer(type, props) {
        return <CellRenderer type={type}
                             validateFieldValue={props.params &&  props.params.context ?
                                 props.params.context.validateFieldValue : null}
                             invalidMessage={props.invalidMessage}
                             isInvalid={props.isInvalid}
                             colDef={props.params.column.colDef}
                             initialValue={props.params.value}
                             editing={props.editing}
                             params={props.params}
                             qbGrid={props.qbGrid}
                             key={CellRendererFactory.getCellKey(props)}
        />;
    }
}


/**
 * cell renderer
 */
const CellRenderer = React.createClass({
    displayName: 'CellRenderer',

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
                valueAndDisplay: {
                    id: this.props.initialValue.id,
                    value: this.props.initialValue.value,
                    display: this.props.initialValue.display,
                },
                validationStatus : null
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
        case FieldFormats.DATE_FORMAT:            return "dateFormat";
        case FieldFormats.DATETIME_FORMAT:        return "dateTimeFormat";
        case FieldFormats.TIME_FORMAT:            return "timeFormat";
        case FieldFormats.NUMBER_FORMAT:          return "numberFormat";
        case FieldFormats.RATING_FORMAT:          return "ratingFormat";
        case FieldFormats.CURRENCY_FORMAT:        return "currencyFormat";
        case FieldFormats.PERCENT_FORMAT:         return "percentFormat";
        case FieldFormats.DURATION_FORMAT:        return "durationFormat";
        case FieldFormats.PHONE_FORMAT:           return "phoneFormat";
        case FieldFormats.TEXT_FORMAT:            return "textFormat";
        case FieldFormats.MULTI_LINE_TEXT_FORMAT: return "multiLineTextFormat";
        default:                                  return "textFormat";
        }
    },

    render() {

        let isEditable = true;
        // built in fields are not editable
        if (typeof this.props.colDef.builtIn !== 'undefined' &&  this.props.colDef.builtIn) {
            isEditable = false;
        }
        // field must be scalar i.e. user editable not a formula or generated value
        if (typeof this.props.colDef.userEditableValue !== 'undefined' &&  !this.props.colDef.userEditableValue) {
            isEditable = false;
        }

        let key = CellRendererFactory.getCellKey(this.props);

        if (this.props.initialValue === null) {
            return (<span className="emptyCell" />);
        }

        // the reactabular grid doesn't need to render an editor unless it's actually editing

        let cellType = this.props.type;

        let invalidStatus = {isInvalid: false, invalidMessage: null};
        // did the validation on blur report an error
        if (this.state.validationStatus && this.state.validationStatus.isInvalid) {
            invalidStatus = this.state.validationStatus;
        }

        return (
            <span className={"cellWrapper " + this.getClassNameForType(this.props.type)}>

                { isEditable && (this.props.editing || !this.props.qbGrid) &&
                    <CellEditor type={cellType}
                                value={this.state.valueAndDisplay.value}
                                display={this.state.valueAndDisplay.display}
                                colDef={this.props.colDef}
                                onChange={this.cellEdited}
                                onBlur={this.onBlur}
                                onValidated={this.onValidated}
                                key={key + '-edt'}
                                idKey={key + '-edt'}
                                params={this.props.params}
                                onTabColumn={this.onTabColumn}
                                validateFieldValue={this.props.validateFieldValue}
                                isInvalid={invalidStatus.isInvalid}
                                invalidMessage={invalidStatus.invalidMessage}
                    />
                }

                { (!isEditable || !this.props.editing || !this.props.qbGrid) &&
                    <CellValueRenderer type={cellType}
                                       isEditable={isEditable}
                                       value={this.state.valueAndDisplay.value}
                                       key={key + '-dsp'}
                                       idKey={key + '-dsp'}
                                       display={this.state.valueAndDisplay.display}
                                       attributes={this.props.colDef.datatypeAttributes}/>
                }
            </span>);
    },

    onValidated(results) {
        this.cellValidated(results);
    },

    onBlur(value) {
        switch (this.props.type) {
        case FieldFormats.DATE_FORMAT:
        case FieldFormats.DATETIME_FORMAT:
        case FieldFormats.TIME_FORMAT:
            this.dateTimeCellEdited(value);
            break;

        case FieldFormats.NUMBER_FORMAT:
        case FieldFormats.RATING_FORMAT:
        case FieldFormats.CURRENCY_FORMAT:
        case FieldFormats.PERCENT_FORMAT:
            this.numericCellEdited(value);
            break;
        case FieldFormats.TEXT_FORMAT:
            this.textCellEdited(value);
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
            _.has(this.props.params, 'context.uniqueIdentifier') &&
            _.has(this.props.params, 'colDef.id')) {

            let change = {
                values: {
                    oldVal: this.props.params.data[this.props.params.column.colId],
                    newVal: this.state.valueAndDisplay
                },
                recId: this.props.params.data[this.props.params.context.uniqueIdentifier].value,
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

        this.setState({valueAndDisplay : Object.assign({}, theVals), validationStatus: {}}, ()=>{this.cellChanges();});
    },

    /**
     * cell validate change update
     * @param result of validation
     */
    cellValidated(result) {
        let current = Object.assign({}, this.state.validationStatus);
        current.isInvalid = result ? result.isInvalid : false;
        current.invalidMessage = result ? result.invalidMessage : null;
        this.setState({validationStatus : current});
    },

    /**
     * textcell was edited, update the r/w and r/o value
     * @param value
     */
    textCellEdited(value) {
        let theVals = {
            value: value,
        };
        theVals.display = textFormatter.format(theVals, this.props.colDef.datatypeAttributes);

        this.setState({valueAndDisplay : Object.assign({}, theVals), validationStatus: {}}, ()=>{this.cellChanges();});
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
        case FieldFormats.DATE_FORMAT: {
            // normalized form is YYYY-MM-DD
            theVals.display = dateTimeFormatter.format(theVals, this.props.colDef.datatypeAttributes);
            break;
        }
        case FieldFormats.TIME_FORMAT: {
            // normalized form is 1970-01-01THH:MM:SSZ
            theVals.display = timeOfDayFormatter.format(theVals, this.props.colDef.datatypeAttributes);
            break;
        }
        case FieldFormats.DATETIME_FORMAT: {
            // normalized form is YYYY-MM-DDTHH:MM:SSZ
            theVals.display = dateTimeFormatter.format(theVals, this.props.colDef.datatypeAttributes);
            break;
        }
        default: {
            theVals.display = newValue;
            break;
        }
        }

        this.setState({valueAndDisplay : Object.assign({}, theVals), validationStatus:null}, ()=>{this.cellChanges();});
    },

    /**
     * numeric cell edited, update the display value from common formatter
     * @param value
     */
    numericCellEdited(value) {
        //look at the separator, if its a comma for decimal place then strip out other chars other than comma then run through formatter.
        let datatypeAttributes = this.props.colDef && this.props.colDef.datatypeAttributes ? this.props.colDef.datatypeAttributes : {};
        let clientSideAttributes = datatypeAttributes.clientSideAttributes ? datatypeAttributes.clientSideAttributes : {};
        let decimalPlaces = datatypeAttributes.decimalPlaces;
        let decimalMark = decimalPlaces && clientSideAttributes.decimal_mark ? clientSideAttributes.decimal_mark : '.';
        let currencySymbol = datatypeAttributes && datatypeAttributes.type === "CURRENCY" &&  clientSideAttributes.symbol ?  clientSideAttributes.symbol : "";

        let theVals = {value: null, display: null};
        if (value) {
            // user can enter a value with repeated decimal marks. We need to keep the 1st one and remove the rest
            // example 50.9.9 => 50.90 (for 2 decimal place)
            // so strip out everything but numbers and decimal mark, then keep index of 1st decimal and remove other decimals
            let isNegative = (value.indexOf('-') === 0) || (currencySymbol && value.indexOf(currencySymbol) === 0 ? value.indexOf('-') === 1 : false);

            // clean up everything except for numbers and the decimal mark
            if (decimalMark === '.') {
                value = value.replace(/[^0-9.]/g, '');
            } else if (decimalMark === ',') {
                value = value.replace(/[^0-9,]/g, '');
            } else {
                value = value.replace(/[^0-9]/g, '');
            }

            // remove all decimal marks and then put back the 1st one
            let decimal_index = value.indexOf(decimalMark);
            value = value.replace(/[^0-9]/g, '');
            value = decimal_index >= 0 ? value.slice(0, decimal_index) + "." + value.slice(decimal_index) : value;

            // convert to number
            theVals.value  = value && value.length ? +value : null;
            // put back the negative sign if needed.
            theVals.value = theVals.value && isNegative ? -theVals.value : theVals.value;
        }
        //if its a percent field the raw value is display value/100
        if (datatypeAttributes.type === 'PERCENT') {
            theVals.value = theVals.value ? theVals.value / 100 : 0;
        }

        theVals.display = theVals.value ? numericFormatter.format(theVals, datatypeAttributes) : '';

        this.setState({valueAndDisplay : Object.assign({}, theVals), validationStatus:null}, ()=>{this.cellChanges();});
    }
});

export const TextCellRenderer = React.createClass({
    displayName: 'TextCellRenderer',
    render() {
        let format = FieldFormats.TEXT_FORMAT;
        if (this.props.params && this.props.params.column && this.props.params.column.colDef &&
            this.props.params.column.colDef.datatypeAttributes &&
            this.props.params.column.colDef.datatypeAttributes.clientSideAttributes &&
            this.props.params.column.colDef.datatypeAttributes.clientSideAttributes.num_lines &&
            this.props.params.column.colDef.datatypeAttributes.clientSideAttributes.num_lines > 1) {
            format = FieldFormats.MULTI_LINE_TEXT_FORMAT;
        }
        return CellRendererFactory.makeCellRenderer(format, this.props);
    }
});

export const DateCellRenderer = React.createClass({
    displayName: 'DateCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.DATE_FORMAT, this.props);
    }
});

export const DateTimeCellRenderer = React.createClass({
    displayName: 'DateTimeCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.DATETIME_FORMAT, this.props);
    }
});

export const TimeCellRenderer = React.createClass({
    displayName: 'TimeCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.TIME_FORMAT, this.props);
    }
});

export const DurationCellRenderer = React.createClass({
    displayName: 'DurationCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.DURATION_FORMAT, this.props);
    }
});

export const PhoneCellRenderer = React.createClass({
    displayName: 'PhoneCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.PHONE_FORMAT, this.props);
    }
});

export const NumericCellRenderer = React.createClass({
    displayName: 'NumericCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.NUMBER_FORMAT, this.props);
    }
});

export const CurrencyCellRenderer = React.createClass({
    displayName: 'CurrencyCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.CURRENCY_FORMAT, this.props);
    }
});

export const PercentCellRenderer = React.createClass({
    displayName: 'PercentCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.PERCENT_FORMAT, this.props);
    }
});

export const RatingCellRenderer = React.createClass({
    displayName: 'RatingCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.RATING_FORMAT, this.props);
    }
});
export const UserCellRenderer = React.createClass({
    displayName: 'UserCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.USER_FORMAT, this.props);
    }
});
export const CheckBoxCellRenderer = React.createClass({
    displayName: 'CheckBoxCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.CHECKBOX_FORMAT, this.props);
    }
});

export const SelectionColumnCheckBoxCellRenderer = React.createClass({
    displayName: 'SelectionColumnCheckBoxCellRenderer',


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

