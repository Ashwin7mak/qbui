import React, {Component, PropTypes} from "react";
import "./StandardGridItemsCount.scss";

class StandardGridItemsCount extends Component {
    /**
     * Renders the item count
     * if we have some dynamic filtering in effect include the number of filtered items out of the total
     * otherwise just show the grid total items
     *
     * Single Item = 1 Item
     * 0/Multiple Items = 0/1 Items
     *
     * Filtered Item = M of N Items
     * Not Filtered = M Items
     */

    render() {

        const itemCountMessage = (this.props.totalFilteredItems === 1) ? this.props.itemTypeSingular : this.props.itemTypePlural;

        const standardGridItemsCount = (this.props.totalFilteredItems === this.props.totalItems) ? `${this.props.totalItems}` : `${this.props.totalFilteredItems} of ${this.props.totalItems}`;

        return (
             <div className="itemsCountLoaderContainer">
                         <div className="itemCount">
                             {standardGridItemsCount} {itemCountMessage}
                         </div>
             </div>
        );
    }
}

StandardGridItemsCount.propTypes = {

    /**
     * Total Items before filtering
     */
    totalItems: PropTypes.number.isRequired,

    /**
     * Total Items after filtering
     */
    totalFilteredItems: PropTypes.number.isRequired,

    /**
     * The type of item we are displaying. For example "Users"/"User"
     */
    itemTypePlural: PropTypes.string,
    itemTypeSingular: PropTypes.string,
};

export default StandardGridItemsCount;
