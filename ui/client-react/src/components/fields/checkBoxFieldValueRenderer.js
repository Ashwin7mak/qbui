import React, {PropTypes} from 'react';

const CheckBoxFieldValueRenderer = React.createClass({
    propTypes: {
        value: PropTypes.boolean
    },

    getDefaultProps() {
        return {
            // If not specified, the checkbox should NOT be checked
            value: false
        };
    },

    render() {
        return (
            <span 
            <input type="checkbox" disabled checked={this.props.value} key={'inp-' + this.props.idKey}/>
        );
    }
});

export default CheckBoxFieldValueRenderer;
