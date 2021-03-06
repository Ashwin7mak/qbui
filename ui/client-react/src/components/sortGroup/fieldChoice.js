import React, {PropTypes} from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import QBicon from '../qbIcon/qbIcon';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import QBToolTip from '../qbToolTip/qbToolTip';

import './sortAndGroup.scss';


/**
 * Renders an field entry in the sort and group popover used for either sort of group
 * shows 1 field if any and action buttons to set ordering and button for delete
 * if there is no field there is an action button to bring up the field select panel to add a field
 *
 * @type {ClassicComponentClass<P>}
 */
const FieldChoice = React.createClass({
    propTypes: {
        // the selected field to show in the sort or group setting popover
        // or  null for empty not set place for new entry
        field: PropTypes.object,

        // the prefix message for the field: true it's 'then by'
        // if false it's just 'by'
        then: PropTypes.bool,

        // the type string either sort or group
        type: PropTypes.string,

        // the index into the list of sort or group fields
        index: PropTypes.number,

        // the callback that is used when the field list should show for adding an
        // new selection, pass type string 'sort' or 'group' parameter
        onShowFields: PropTypes.func,

        // the callback that is used to change the fields order ascending / descending
        // passes in type, field index, isAscending bool, field object
        onSetOrder: PropTypes.func,

        // the callback that is used  to remove a selected field
        // passes in type field indx, field object
        onRemoveField: PropTypes.func
    },

    render() {
        let hasField = !!this.props.field;
        let name =  '';
        let order = '';
        let fid = '';
        let isEmpty = ' empty';
        let msgKey = '';

        if (hasField) {
            name = this.props.field.name;
            isEmpty = ' notEmpty';
            order =  (this.props.field.descendOrder && this.props.field.descendOrder === true) ? 'down' : 'up';
            fid = " fid:" + this.props.field.id;
        }
        if (this.props.type === 'group')  {
            msgKey = "report.sortAndGroup.changeGroupOrder";
        } else  {
            msgKey = "report.sortAndGroup.changeSortOrder";
        }
        let byMessage = this.props.then ?
            "report.sortAndGroup.thenBy" : "report.sortAndGroup.by";

        return (
            (<div className={"fieldChoice " + this.props.type + isEmpty} tabIndex="0"
                  onClick={!hasField ? this.props.onShowFields : null}>
                    <div className="fieldChoiceLeft">
                        <span className="prefix">
                          <I18nMessage message={byMessage}/>
                        </span>
                        <span className="fieldName">{name}</span>
                    </div>
                    <div className="fieldChoiceActions">
                        { order ? (
                        <QBToolTip location="top" tipId="orderIcon" i18nMessageKey={msgKey}>
                            <span className={"action sortOrderIcon " + order} tabIndex="0"
                                  onClick={() => this.props.onSetOrder(this.props.type, this.props.index,
                                                            !this.props.field.descendOrder, this.props.field)} >
                                  <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={"arrow" + order}/>
                            </span>
                        </QBToolTip>) :
                            null
                        }
                        <span>
                        { hasField ?
                            <QBToolTip location="top" tipId="removeIcon"
                                       i18nMessageKey={this.props.type === 'group' ? 'report.sortAndGroup.stopGroupingBy' : 'report.sortAndGroup.stopSortingBy'}>
                                <span className="action fieldDeleteIcon" tabIndex="0"
                                     onClick={() => this.props.onRemoveField(this.props.type,
                                                this.props.index, this.props.field)} >
                                    <QBicon className="fieldDelete"
                                            icon="clear-mini"/>
                                </span>
                            </QBToolTip>  :
                            <QBToolTip location="top" tipId="addIcon" i18nMessageKey="report.sortAndGroup.addField">
                                <span className="action fieldOpenIcon" tabIndex="0" >
                                    <QBicon className="fieldOpen" icon="icon_caretfilledright"/>
                                </span>
                            </QBToolTip>
                        }
                        </span>
                    </div>
            </div>)
        );
    }
});

export default FieldChoice;

