import React from 'react';
import QbIcon from '../../qbIcon/qbIcon';

const RowWrapper = React.createClass({
    shouldComponentUpdate(nextProps) {
        // TODO:: Turned off for now because of issues with blank rows displaying their edit mode when switching to editing.
        // return (!nextProps || (this.props.isEditing !== nextProps.isEditing) || (this.props.selected !== nextProps.selected) || this.compareFieldValues(nextProps.children));
        return true;
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
        if (this.props.subHeader) {
            return (
                <tr {...this.props} className={`groupHeader subHeaderLevel-${this.props.subHeaderLevel}`}>
                    <td id={this.props.subHeaderId} className="subHeaderCell" colSpan={this.props.numberOfColumns}>
                        <QbIcon icon="caret-filled-down"/>
                        {this.props.subHeaderLabel}
                    </td>
                </tr>
            );
        }

        return <tr {...this.props} />;
    }
});

export default RowWrapper;
