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
    // TODO:: Turn performance enhancements back on. https://quickbase.atlassian.net/browse/MB-1976
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

    toggleCollapseGroup() {
        if (this.props.toggleCollapseGroup) {
            this.props.toggleCollapseGroup(this.props.subHeaderId);
        }
    },

    renderSubHeader() {
        let subHeaderIcon = 'caret-filled-down';

        if (this.props.isCollapsed) {
            subHeaderIcon = 'caret-filled-right';
        }

        return (
            <tr key={`qbRowHeader-${this.props.subHeaderId}`} {...this.props} className={`groupHeader subHeaderLevel-${this.props.subHeaderLevel}`}>
                <td id={this.props.subHeaderId} className="subHeaderCell" colSpan={this.props.numberOfColumns}>
                    <QbIcon icon={subHeaderIcon} onClick={this.toggleCollapseGroup}/>
                    <span className="subHeaderLabel">{this.props.subHeaderLabel}</span>
                </td>
            </tr>
        );
    },

    render() {
        if (this.props.isSubHeader) {
            return this.renderSubHeader();
        }

        return <tr className={this.props.className} key={`qbRow-${this.props.rowId}`} {...this.props} />;
    }
});

export default QbRow;
