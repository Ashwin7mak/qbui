import React from 'react';

import FieldValueEditor from '../../fields/fieldValueEditor';
import ReportUtils from '../../../utils/reportUtils';
/**
 * Table cell inline edit specific editor
 */
const CellEditor = React.createClass({
    displayName: 'CellEditor',

    propTypes: {
        type: React.PropTypes.number,
        value: React.PropTypes.any,
        display: React.PropTypes.any,
        idKey : React.PropTypes.any,
        colDef: React.PropTypes.object,
        onChange: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        onValidated: React.PropTypes.func,
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
        return (<FieldValueEditor  classes="cellEditWrapper"
                              type={this.props.type}
                              value={this.props.value}
                              display={this.props.display}
                              fieldDef={this.props.colDef}
                              indicateRequired={true}
                              onChange={this.props.onChange}
                              onBlur={this.props.onBlur}
                              onKeyDown={this.onKeyDown}
                              onValidated={this.props.onValidated}
                              validateFieldValue={this.props.validateFieldValue}
                              isInvalid={this.props.isInvalid}
                              key={'fve' + this.props.idKey}
                              idKey={this.props.idKey}
                              invalidMessage={this.props.invalidMessage}
                              ref={(c) => {
                                  //get reference to the component for this field
                                  let uniqueIdentifier = ReportUtils.getUniqueIdentifierFieldName(this.props.params.data);
                                  if (this.props.params.data && uniqueIdentifier) {
                                      let rid = this.props.params.data[uniqueIdentifier].value;

                                      if (!this.props.params.context.cells) {
                                          this.props.params.context.cells = {};
                                      }
                                      if (!this.props.params.context.cells[rid]) {
                                          this.props.params.context.cells[rid] = {};
                                      }
                                      this.props.params.context.cells[rid][this.props.params.column.colDef.id] = c;
                                  }
                              }}


        />);
    }
});

export default CellEditor;
