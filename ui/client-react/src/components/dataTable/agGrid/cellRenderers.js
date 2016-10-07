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
import consts from '../../../../../common/src/constants';

import IconActions from '../../actions/iconActions';

import _ from 'lodash';
import FieldFormats from '../../../utils/fieldFormats';
import FieldUtils from '../../../utils/fieldUtils';
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
            _.has(props.params, 'rowIndex')) {

            recId = props.params.data[FieldUtils.getUniqueIdentifierFieldName(props.params.data)].value;
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
                             appUsers={ _.has(props.params, 'context.getAppUsers') ? props.params.context.getAppUsers() : []}
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
        appUsers: React.PropTypes.array,
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
                    display: this.props.initialValue.display
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
        case FieldFormats.USER_FORMAT:            return "userFormat";
        case FieldFormats.URL:                    return "urlFormat";
        default:                                  return "textFormat";
        }
    },

    render() {
        let isEditable = true;

        // built in fields are not editable
        if (typeof this.props.colDef.builtIn !== 'undefined' &&  this.props.colDef.builtIn) {
            isEditable = false;
        }
        // field must be scalar
        if (typeof this.props.colDef.type !== 'undefined' &&  this.props.colDef.type !== consts.SCALAR) {
            isEditable = false;
        }
        // field must be editable i.e. user editable not a restricted value
        if (typeof this.props.colDef.userEditableValue !== 'undefined' && !this.props.colDef.userEditableValue) {
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
                                appUsers={this.props.appUsers}
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

    onBlur(theVals) {
        this.setState({valueAndDisplay : Object.assign({}, theVals), validationStatus: {}}, ()=>{this.cellChanges();});
    },

    cellChanges() {
        if (this.props &&
            _.has(this.props, 'params') &&
            _.has(this.props.params, 'data') &&
            _.has(this.props.params, 'column.colId') &&
            _.has(this.props.params, 'colDef.id')) {

            let uniqueIdentifier = FieldUtils.getUniqueIdentifierFieldName(this.props.params.data);

            let change = {
                values: {
                    oldVal: this.props.params.data[this.props.params.column.colId],
                    newVal: this.state.valueAndDisplay
                },
                recId: this.props.params.data[uniqueIdentifier].value,
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

export const EmailCellRenderer = React.createClass({
    displayName: 'EmailCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.EMAIL_ADDRESS, this.props);
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

export const UrlCellRenderer = React.createClass({
    displayName: 'UrlCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.URL, this.props);
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
