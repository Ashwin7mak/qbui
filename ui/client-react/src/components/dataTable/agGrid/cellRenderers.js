import React from 'react';

/**
 * placeholder for rendering users
 */
export const UserCellRenderer = React.createClass({

    propTypes: {
        format: React.PropTypes.string,
        value: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            format: "FIRST_THEN_LAST"
        };
    },
    render() {
        let display = "";
        switch (this.props.format) {
        case "FIRST_THEN_LAST":
            if (this.props.value && this.props.value.firstName && this.props.value.lastName) {
                display = this.props.value.firstName + ' ' + this.props.value.lastName;
            }
            break;
        }
        return <div>{display}</div>;
    }
});
