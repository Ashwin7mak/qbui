import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import Logger from '../../utils/logger';
import FieldChoiceList from './fieldChoiceList';
import './sortAndGroup.scss';

let logger = new Logger();

/**
 * Renders a section of chosen fields for ordering a report in the sort/group dialog
 * @type {ClassicComponentClass<P>}
 */
const FieldSettings = React.createClass({

    propTypes: {
        type: React.PropTypes.string, //sort or group

    },

    render() {
        return (
            <div className={this.props.type + "BySettings"}  tabIndex="0" >
                <div className="title" >
                    <I18nMessage message={"report.sortAndGroup." + this.props.type}/>
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

export default FieldSettings;
