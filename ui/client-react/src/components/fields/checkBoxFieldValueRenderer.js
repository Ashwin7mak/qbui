import React, {PropTypes} from 'react';
import './checkbox';

const CheckBoxFieldValueRenderer = React.createClass({
    propTypes: {
        value: PropTypes.bool,
        checkedIconClass: PropTypes.string,
        uncheckedIconClass: PropTypes.string
    },

    getDefaultProps() {
        return {
            // If not specified, the checkbox should NOT be checked
            value: false,
            checkedIconClass: 'iconssturdy-check',
            uncheckedIconClass: ''
        };
    },

    getDisplayValue() {
        let {checkedIconClass, uncheckedIconClass} = this.props;

        let checkClass = 'symbol qbIcon ';
        checkClass += (this.props.value ? checkedIconClass : uncheckedIconClass);

        return (<span className={checkClass}></span>);
    },

    render() {
        return (
            <div className="checkbox renderer">
                {this.getDisplayValue()}
            </div>
        );
    }
});

export default CheckBoxFieldValueRenderer;
