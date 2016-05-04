import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import QBicon from '../qbIcon/qbIcon';
import TableIcon from '../qbTableIcon/qbTableIcon';

import Logger from '../../utils/logger';

import './sortAndGroup.scss';


/**
 * Renders an field entry in the sort and group popover used for either sort of group
 * shows 1 field if any and action buttons to set ordering and button for delete
 * if there is no field there is an action button to bring up the field select panel to add a field
 *
 * @type {ClassicComponentClass<P>}
 */
const FieldChoice = React.createClass({
    render() {
        let hasField = !!this.props.field;
        let name =  '';
        let order = '';
        let isEmpty = ' empty';

        if (hasField) {
            name = this.props.field.name;
            isEmpty = ' notEmpty';
            order =  (this.props.field.descendOrder && this.props.field.descendOrder === true) ? 'down' : 'up';
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
                        { order &&
                            <span className={"sortOrderIcon " + order} tabIndex="0"
                                  onClick={() => this.props.onSetOrder(this.props.type, this.props.index,
                                                            !this.props.field.descendOrder, this.props.field)} >
                                  <TableIcon icon={"icon-TableIcons_sturdy_arrow" + order}/>
                            </span>
                        }
                        <span>
                        { hasField ?
                            <span className="groupFieldDeleteIcon" tabIndex="0"
                                onClick={() => this.props.onRemoveField(this.props.type, this.props.index, this.props.field)} >
                                <QBicon className="groupFieldDelete"
                                    icon="clear-mini"/>
                            </span> :
                            <span className="groupFieldOpenIcon" tabIndex="0" >
                                <QBicon className="groupFieldOpen" icon="icon_caretfilledright"/>
                            </span>
                        }
                        </span>
                    </div>
            </div>)
        );
    }
});

export default FieldChoice;

