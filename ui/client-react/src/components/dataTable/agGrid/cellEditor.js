import React from 'react';

//import {DefaultFieldEditor, MultiLineTextFieldEditor, ComboBoxFieldEditor, DateFieldEditor, DateTimeFieldEditor, TimeFieldEditor, UserFieldEditor, CheckBoxFieldEditor} from '../../fields/fieldEditors';
import FieldEditor from '../../fields/fieldEditor';

//import * as formats from '../../../constants/fieldFormats';

/**
 * Table cell inline edit specific editor
 */
const CellEditor = React.createClass({

    propTypes: {
        type: React.PropTypes.number,
        value: React.PropTypes.any,
        colDef: React.PropTypes.object,
        onChange: React.PropTypes.func,
        onTabColumn: React.PropTypes.func
    },


    /**
     * inform parent component of tabbing so it can navigate to next row if necessary
     */
    onKeyDown(ev) {
        if (ev.key === "Tab" && !ev.shiftKey) {
            this.props.onTabColumn();
        }
    },

    render() {
        return (<FieldEditor  classes="cellEditWrapper"
                              type={this.props.type}
                              value={this.props.value}
                              indicateRequired={true}
                              fieldDef={this.props.colDef}
                              onChange={this.props.onChange}
                              onKeyDown={this.onKeyDown}
        />);
    }
});

export default CellEditor;

