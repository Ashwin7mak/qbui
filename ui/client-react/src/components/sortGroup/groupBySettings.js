import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from '../../locales/locales';
import Logger from '../../utils/logger';
import StringUtils from '../../utils/stringUtils';
import {Well} from 'react-bootstrap';
import QBicon from '../qbIcon/qbIcon';
import FieldChoiceList from './fieldChoiceList';
import './sortAndGroup.scss';

let logger = new Logger();

const GroupBySettings = React.createClass({

    propTypes: {
    },

    render() {
        return (
            <div className="groupBySettings"  tabIndex="0" >
                <div className="title" >
                    <I18nMessage message="report.sortAndGroup.group"/>
                </div>

                <div className="fieldSelectorContainer">
                    <div className="fieldSelector">
                        <FieldChoiceList {...this.props}/>
                    </div>
                </div>
            </div>
        );
    }
});

export default GroupBySettings;
