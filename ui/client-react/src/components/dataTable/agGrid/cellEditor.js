import React from 'react';

import {DefaultFieldEditor, MultiLineTextFieldEditor, ComboBoxFieldEditor, DateFieldEditor, DateTimeFieldEditor, TimeFieldEditor, UserFieldEditor, CheckBoxFieldEditor} from '../../fields/fieldEditors';

import * as formats from '../../../constants/fieldFormats';

const CellEditor = React.createClass({

    propTypes: {
        type: React.PropTypes.number,
        value: React.PropTypes.any,
        colDef: React.PropTypes.object,
        onChange: React.PropTypes.func,
        onTabColumn: React.PropTypes.func
    },

    getEditorForType(type) {
        switch (type) {
        case formats.CHECKBOX_FORMAT:
            return <CheckBoxFieldEditor value={this.props.value} onChange={this.props.onChange} />;

        case formats.DATE_FORMAT: {
            return <DateFieldEditor value={this.props.value} onChange={this.props.onChange} />;
        }

        case formats.DATETIME_FORMAT: {
            return <DateTimeFieldEditor value={this.props.value} onChange={this.props.onChange} />;
        }

        case formats.TIME_FORMAT: {
            return <TimeFieldEditor value={this.props.value} onChange={this.props.onChange} />;
        }

        case formats.NUMBER_FORMAT:
        case formats.RATING_FORMAT:
        case formats.CURRENCY_FORMAT:
        case formats.PERCENT_FORMAT: {
            return <DefaultFieldEditor value={this.props.value}
                                       type="number"
                                       onChange={this.props.onChange} />;
        }

        case formats.USER_FORMAT: {
            return <UserFieldEditor value={this.props.value}
                                    onChange={this.props.onChange} />;
        }

        case formats.TEXT_FORMAT:
        default: {

            if (this.props.colDef.choices) {
                return (
                    <ComboBoxFieldEditor choices={this.props.colDef.choices} value={this.props.value}
                                     onChange={this.props.onChange} />
                );
            } else {
                return <MultiLineTextFieldEditor value={this.props.value}
                                           onChange={this.props.onChange} />;
            }
        }
        }
    },

    /**
     * inform parent component of tabbing
     */
    onKeyDown(ev) {
        if (ev.key === "Tab" && !ev.shiftKey) {
            this.props.onTabColumn();
        }
    },

    render() {

        return (<div className="cellEditWrapper" onKeyDown={this.onKeyDown}>
            {this.getEditorForType(this.props.type)}
            </div>);
    }
});

export default CellEditor;

