import React from 'react';

const RowWrapper = React.createClass({
    shouldComponentUpdate(nextProps) {
        return (!nextProps || (this.props.editing !== nextProps.editing) || this.compareFieldValues(nextProps.children));
    },

    compareFieldValues(fields) {
        let isDifferent = false;
        fields.some((field, index) => {
            if (field.props.children.value !== this.props.children[index].props.children.value) {
                isDifferent = true;
                return true;
            }
        });

        return isDifferent;
    },

    render() {
        return <tr {...this.props} />;
    }
});

export default RowWrapper;
