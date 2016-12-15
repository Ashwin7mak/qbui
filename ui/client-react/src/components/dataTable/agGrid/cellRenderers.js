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
import * as durationFormatter from "../../../../../common/src/formatter/durationFormatter";


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

            recId = props.params.data[FieldUtils.getPrimaryKeyFieldName(props.params.data)].value;
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
                // Key is use to force a re-rendering when there are validation changes
                rerenderKey: -1
            };
        } else {
            logger.warn('"this.props.initialValue" in getInitialState is undefined');
            return {rerenderKey: -1};
        }
    },

    /**
     * get row primaryKeyName value that this cells is rendered in (usually record id)
     * @returns value primitive
     */
    getRecId() {
        let recIdAnswer = null;
        if (this.props &&
            _.has(this.props, 'params') &&
            _.has(this.props.params, 'data') &&
            _.has(this.props.params, 'context') &&
            _.has(this.props.params, 'context.primaryKeyName') &&
            !_.isUndefined(this.props.params.data) &&
            !_.isUndefined(this.props.params.context.primaryKeyName) &&
            !_.isUndefined(this.props.params.data[this.props.params.context.primaryKeyName])) {
            recIdAnswer = this.props.params.data[this.props.params.context.primaryKeyName].value;
        }
        return recIdAnswer;
    },
    /**
     * get this cells field id
     * @returns id - field number number
     */
    getFieldId() {
        let fieldIdAnswer = null;
        if (this.props &&
            _.has(this.props, 'colDef') &&
            _.has(this.props.colDef, 'fieldDef') &&
            _.has(this.props.colDef, 'fieldDef.id') &&
            !_.isUndefined(this.props.colDef.fieldDef.id)) {
            fieldIdAnswer = this.props.colDef.fieldDef.id;
        }
        return fieldIdAnswer;
    },
    /**
     * register this component
     *  if form/parent needs to call component to setState in in or call its methods
     */
    componentWillMount() {
        if (this.props.params && this.props.params.context &&
            this.props.params.context.onAttach) {
            this.props.params.context.onAttach(this, this.getRecId(), this.getFieldId());
        }
    },
    /**
     * unregister this component
     */
    componentWillUnmount() {
        if (this.props.params && this.props.params.context &&
            this.props.params.context.onDetach) {
            this.props.params.context.onDetach(this.getRecId(), this.getFieldId());
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
     * gets the classname for duration, scales with fixed text units get wUnitsText
     * in addition to durationFormat
     * @param coldef
     * @returns {string}
     */
    getClassNameForDuration(coldef) {
        let answer = "durationFormat";
        if (coldef && _.has(coldef, 'fieldDef.datatypeAttributes.scale') &&
            durationFormatter.hasUnitsText(coldef.fieldDef.datatypeAttributes.scale)) {
            answer += " wUnitsText";
        }
        return answer;
    },
    /**
     *
     * @returns {*}
     */
    getClassNameForType(cellType, coldef) {
        switch (cellType) {
        case FieldFormats.DATE_FORMAT:            return "dateFormat";
        case FieldFormats.DATETIME_FORMAT:        return "dateTimeFormat";
        case FieldFormats.TIME_FORMAT:            return "timeFormat";
        case FieldFormats.NUMBER_FORMAT:          return "numberFormat";
        case FieldFormats.RATING_FORMAT:          return "ratingFormat";
        case FieldFormats.CURRENCY_FORMAT:        return "currencyFormat";
        case FieldFormats.PERCENT_FORMAT:         return "percentFormat";
        case FieldFormats.DURATION_FORMAT:        return this.getClassNameForDuration(coldef);
        case FieldFormats.PHONE_FORMAT:           return "phoneFormat";
        case FieldFormats.TEXT_FORMAT:            return "textFormat";
        case FieldFormats.MULTI_LINE_TEXT_FORMAT: return "multiLineTextFormat";
        case FieldFormats.USER_FORMAT:            return "userFormat";
        case FieldFormats.URL:                    return "urlFormat";
        case FieldFormats.TEXT_FORMULA_FORMAT:    return "formulaTextFormat";
        case FieldFormats.NUMERIC_FORMULA_FORMAT: return "formulaNumericFormat";
        case FieldFormats.URL_FORMULA_FORMAT:     return "formulaUrlFormat";
        default:                                  return "textFormat";
        }
    },

    /**
     * Get validation status from current context
     * @returns {{isInvalid: boolean, invalidMessage: null, invalidResultData: null}}
     * @private
     */
    _getValidationErrors() {
        let validationErrors = {
            isInvalid: false,
            invalidMessage: null,
            invalidResultData: null
        };

        if (_.has(this.props, 'params.context.rowEditErrors.errors.length')) {
            let currentValidationErrors = _.find(this.props.params.context.rowEditErrors.errors, {id: this.getFieldId()});

            if (currentValidationErrors) {
                validationErrors = Object.assign({}, currentValidationErrors);
            }
        }

        return validationErrors;
    },

    render() {
        let isEditable = FieldUtils.isFieldEditable(this.props.colDef.fieldDef);

        let attributes = null;
        if (typeof this.props.colDef.fieldDef !== 'undefined' &&
            typeof this.props.colDef.fieldDef.datatypeAttributes !== 'undefined') {
            attributes = this.props.colDef.fieldDef.datatypeAttributes;
        }

        let key = CellRendererFactory.getCellKey(this.props);

        if (this.props.initialValue === null) {
            return (<span className="emptyCell" />);
        }

        // the reactabular grid doesn't need to render an editor unless it's actually editing

        let cellType = FieldUtils.getFieldType(this.props.colDef.fieldDef, this.props.type, attributes);

        let invalidStatus = this._getValidationErrors();

        return (
            <span className={"cellWrapper " + this.getClassNameForType(this.props.type, this.props.colDef)}>

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
                                invalidResultData={invalidStatus.invalidResultData}
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
                                       attributes={attributes}/>
                }
            </span>);
    },

    onValidated(results) {
        // Cause the component to update so we can display the new validation errors
        // Without this, the field does not show the most recent validation coming from the grid context
        if (results && results.isInvalid) {
            this.setState({rerenderKey: Math.random()});
        }
    },

    onBlur(theVals) {
        this.setState({valueAndDisplay : Object.assign({}, theVals)},
            ()=>{this.cellChanges();});
    },

    cellChanges() {
        if (this.props &&
            _.has(this.props, 'params') &&
            _.has(this.props.params, 'data') &&
            _.has(this.props.params, 'column.colId') &&
            _.has(this.props.params, 'colDef.id')) {

            let primaryKeyName = FieldUtils.getPrimaryKeyFieldName(this.props.params.data);

            let change = {
                values: {
                    oldVal: this.props.params.data[this.props.params.column.colId],
                    newVal: this.state.valueAndDisplay
                },
                recId: this.props.params.data[primaryKeyName].value,
                fid: +this.props.params.colDef.id,
                fieldName: this.props.params.column.colId,
                fieldDef: this.props.params.colDef.fieldDef
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

        this.setState({valueAndDisplay : Object.assign({}, theVals)},
            ()=>{this.cellChanges();});
    }
});

export const TextCellRenderer = React.createClass({
    displayName: 'TextCellRenderer',
    render() {
        let format = FieldFormats.TEXT_FORMAT;
        if (this.props.params && this.props.params.column && this.props.params.column.colDef &&
            this.props.params.column.colDef.fieldDef &&  this.props.params.column.colDef.fieldDef.datatypeAttributes &&
            this.props.params.column.colDef.fieldDef.datatypeAttributes.clientSideAttributes &&
            this.props.params.column.colDef.fieldDef.datatypeAttributes.clientSideAttributes.num_lines &&
            this.props.params.column.colDef.fieldDef.datatypeAttributes.clientSideAttributes.num_lines > 1) {
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

export const TextFormulaCellRenderer = React.createClass({
    displayName: 'TextFormulaCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.TEXT_FORMULA_FORMAT, this.props);
    }
});

export const UrlFormulaCellRenderer = React.createClass({
    displayName: 'UrlFormulaCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.URL_FORMULA_FORMAT, this.props);
    }
});

export const NumericFormulaCellRenderer = React.createClass({
    displayName: 'NumericFormulaCellRenderer',
    render() {
        return CellRendererFactory.makeCellRenderer(FieldFormats.NUMERIC_FORMULA_FORMAT, this.props);
    }
});

export const SelectionColumnCheckBoxCellRenderer = React.createClass({
    displayName: 'SelectionColumnCheckBoxCellRenderer',


    onClickEdit() {
        if (this.props.params.context.defaultActionCallback) {
            this.props.params.context.defaultActionCallback(this.props.params.data);
        }
    },

    getInitialState() {
        return {
            rowEditErrors : null
        };
    },

    updateRowEditErrors(rowEditErrors) {
        if (rowEditErrors !== this.state.rowEditErrors) {
            this.setState({rowEditErrors: rowEditErrors});
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
            {msg: Locale.getMessage('selection.edit')   + " " + record, rawMsg: true, className:'edit', icon:'edit', onClick: this.onClickEdit},
            {msg: Locale.getMessage('selection.print')  + " " + record, rawMsg: true, className:'print', icon:'print', tooltipMsg: 'unimplemented.print', disabled:true},
            {msg: Locale.getMessage('selection.email')  + " " + record, rawMsg: true, className:'email', icon:'mail', tooltipMsg: 'unimplemented.email', disabled:true},
            {msg: Locale.getMessage('selection.copy')   + " " + record, rawMsg: true, className:'duplicate', icon:'duplicate', tooltipMsg: 'unimplemented.copy', disabled:true},
            {msg: Locale.getMessage('selection.delete') + " " + record, rawMsg: true, className:'delete', icon:'delete', onClick: this.onClickDelete}
        ];

        return (<div>
            <RowEditActions flux={this.props.params.context.flux}
                            api={this.props.params.api}
                            data={this.props.params.data}
                            saving={_.has(this.props, 'params.context.saving') ? this.props.params.context.saving : false}
                            rowEditErrors={this.state.rowEditErrors}
                            params={this.props.params}
            />
            <IconActions flux={this.props.params.context.flux} dropdownTooltip={true} className="recordActions" pullRight={false} menuIcons actions={actions} maxButtonsBeforeMenu={1} />
        </div>);
    }
});