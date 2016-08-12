import React from 'react';

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
        onTabColumn: React.PropTypes.func,
        validateFieldValue: React.PropTypes.func,
        isInvalid: React.PropTypes.bool,
        invalidMessage: React.PropTypes.string
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
                              fieldDef={this.props.colDef}
                              indicateRequired={true}
                              onChange={this.props.onChange}
                              onBlur={this.props.onBlur}
                              onKeyDown={this.onKeyDown}
                              onValidated={this.props.onValidated}
                              validateFieldValue={this.props.validateFieldValue}
                              isInvalid={this.props.isInvalid}
                              invalidMessage={this.props.invalidMessage}

    />);
    }
});

export default CellEditor;

