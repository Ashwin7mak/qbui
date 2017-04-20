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
                <td id={this.props.subHeaderId} className="subHeaderCell" colSpan={this.props.numberOfColumns} onClick={this.toggleCollapseGroup}>
                    <div className="subHeaderContainer">
                        <QbIcon icon={subHeaderIcon}/>
                        <span className="subHeaderLabel">{this.props.subHeaderLabel}</span>
                    </div>
                </td>
            </tr>
        );
    },

    /**
     * add class to TR when edit icon in cell gets mouse enter
     */
    handleMouseEnterEditIcon() {
        this.tr.classList.add("willEdit");
    },

    /**
     * remove class to TR when edit icon in cell gets mouse leave
     */
    handleMouseLeaveEditIcon() {
        this.tr.classList.remove("willEdit");
    },

    componentDidMount() {
        if (this.tr) {
            // handle the row styling when the nested edit icons get mouse enter/leave events

            const editIcons = this.tr.getElementsByClassName("cellEditIcon");

            for (let i = 0; i < editIcons.length; i++) {
                editIcons[i].addEventListener("mouseenter", this.handleMouseEnterEditIcon);
                editIcons[i].addEventListener("mouseleave", this.handleMouseLeaveEditIcon);
            }
        }
    },

    componentWillUnmount() {

        if (this.tr) {
            // remove mouse listeners from non-subheader rows

            const editIcons = this.tr.getElementsByClassName("cellEditIcon");

            for (let i = 0; i < editIcons.length; i++) {
                editIcons[i].removeEventListener("mouseenter", this.handleMouseEnterEditIcon);
                editIcons[i].removeEventListener("mouseleave", this.handleMouseLeaveEditIcon);
            }
        }
    },

    render() {
        if (this.props.isSubHeader) {
            return this.renderSubHeader();
        }

        return <tr ref={element => this.tr = element} className={this.props.className} key={`qbRow-${this.props.rowId}`} {...this.props} />;
    }
});

export default QbRow;
