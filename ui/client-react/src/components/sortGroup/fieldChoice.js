import React from 'react';
import Fluxxor from 'fluxxor';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import QBicon from '../qbIcon/qbIcon';
import Logger from '../../utils/logger';
import StringUtils from '../../utils/stringUtils';

import './sortAndGroup.scss';

let logger = new Logger();

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
                                  <QBicon icon={"return"} />
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

