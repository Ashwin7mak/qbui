/**
 * Created by rbeyer on 2/6/17.
 */
import React, {PropTypes} from 'react';
import './appProperties.scss';

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
                <h5 className={"fieldLabel"}>{curProperty}</h5>
                {this.createSpan(curProperty)}
            </div>
        );
    },

    render() {
        var fields = [];
        var properties = ["dateFormat", "firstDayOfWeek", "id", "name", "numberFormat", "timeZone"];
        for (var c = 0; c < properties.length; c++) {
            fields.push(this.createField(properties[c]));
        }
        return (
            <div className="appPropertiesContainer">
                {fields}
            </div>
        );
    }

});

export default AppProperties;
