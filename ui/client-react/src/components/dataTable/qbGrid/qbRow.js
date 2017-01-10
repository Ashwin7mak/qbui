import React from 'react';
import QbIcon from '../../qbIcon/qbIcon';

/**
 * The basic row component used by QbGrid. The component will detect subHeader rows (i.e., headers below the top row of column headers)
 * and output those. Otherwise, it will return a basic <tr> with the props passed through.
 * @type {__React.ClassicComponentClass<P>}
 */
const QbRow = React.createClass({
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

    renderSubHeader() {
        return (
            <tr key={`qbRowHeader-${this.props.subHeaderId}`} {...this.props} className={`groupHeader subHeaderLevel-${this.props.subHeaderLevel}`}>
                <td id={this.props.subHeaderId} className="subHeaderCell" colSpan={this.props.numberOfColumns}>
                    <QbIcon icon="caret-filled-down"/>
                    {this.props.subHeaderLabel}
                </td>
            </tr>
        );
    },

    render() {
        if (this.props.subHeader) {
            return this.renderSubHeader();
        }

        return <tr key={`qbRow-${this.props.recordId}`} {...this.props} />;
    }
});

export default QbRow;
