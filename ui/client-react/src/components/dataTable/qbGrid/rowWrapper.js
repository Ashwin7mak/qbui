import React from 'react';
import QbIcon from '../../qbIcon/qbIcon';

const RowWrapper = React.createClass({
    shouldComponentUpdate(nextProps) {
        return (!nextProps || (this.props.editing !== nextProps.editing) || (this.props.selected !== nextProps.selected) || this.compareFieldValues(nextProps.children));
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
