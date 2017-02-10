/**
 * Created by rbeyer on 2/6/17.
 */
import React, {PropTypes} from 'react';
import './appProperties.scss';

const propertiesToDisplay = ["dateFormat", "firstDayOfWeek", "id", "name", "numberFormat", "timeZone"];
const displayProps = {dateFormat: "Date Format", firstDayOfWeek: "First Day of the Week", id: "id",
                      name: "Name", numberFormat: "Number Format", timeZone: "Time Zone"};
const AppProperties = React.createClass({

    propTypes: {
        appId: PropTypes.string.isRequired,
        selectedApp: PropTypes.object.isRequired
    },

    createSpan(curProperty) {
        return (
            <span className="fieldValue">{this.props.selectedApp[curProperty]}</span>
        );
    },

    createField(curProperty) {
        return (
            <div className="field">
                <h5 className={"fieldLabel"}>{displayProps[curProperty]}</h5>
                {this.createSpan(curProperty)}
            </div>
        );
    },

    render() {
        let fields = [];
        let keys = Object.keys(displayProps);
        for (var c = 0; c < keys.length; c++) {
            if (this.props.selectedApp.hasOwnProperty(keys[c])) {
                fields.push(this.createField(keys[c]));
            }
        }
        return (
            <div className="appPropertiesContainer">
                {fields}
            </div>
        );
    }

});

export default AppProperties;
