import React from 'react';
import QbIcon from '../../qbIcon/qbIcon';

const RowWrapper = React.createClass({
    /**
     * Use for a performance boost. Row will only re-render if there is a change.
     * @param nextProps
     * @returns {boolean|*}
     */
    // shouldComponentUpdate(nextProps) {
    //     let shouldUpdate =
    //         (!nextProps || (this.props.isEditing !== nextProps.isEditing) ||
    //         (this.props.selected !== nextProps.selected) ||
    //         (this.props.editingRowId !== nextProps.editingRowId)) ||
    //         (this.props.isInlineEditOpen !== nextProps.isInlineEditOpen) ||
    //         (this.props.isValid !== nextProps.isValid) ||
    //         (this.props.isSaving !== nextProps.isSaving);
    //
    //     if (this.props.compareCellChanges) {
    //         return (shouldUpdate || this.props.compareCellChanges(this.props.children, nextProps.children));
    //     }
    //
    //     return shouldUpdate;
    // },

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
