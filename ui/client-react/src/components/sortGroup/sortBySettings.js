import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import Logger from '../../utils/logger';
import FieldChoiceList from './fieldChoiceList';
import './sortAndGroup.scss';

let logger = new Logger();


const SortBySettings = React.createClass({

    propTypes: {
    },

    render() {
        return (
            <div className="sortBySettings">
                <div className="title">
                    <I18nMessage message="report.sortAndGroup.sort"/>
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

export default SortBySettings;
