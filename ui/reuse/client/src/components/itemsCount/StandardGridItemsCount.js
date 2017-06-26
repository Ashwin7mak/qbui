import React, {Component, PropTypes} from "react";
import "./StandardGridItemsCount.scss";

class StandardGridItemsCount extends Component {

    /**
     * determines if items component navigation should be visible
     * @returns {boolean}
     */
    shouldShowItems = () => {
        return this.props.totalItems !== 0;
    };


    /**
     * Renders the item count
     * No Item = Hide
     * Single Item = 1 Item
     * 0/Multiple Items = 0/N Items
     * Filtered Item = M of N Items
     */

    render() {
        const itemCountMessage = (this.props.totalItems === 1) ? this.props.itemTypeSingular : this.props.itemTypePlural;
        const standardGridItemsCount = (this.props.totalFilteredItems === this.props.totalItems) ? `${this.props.totalItems}` : `${this.props.totalFilteredItems} of ${this.props.totalItems}`;

        return (
            this.shouldShowItems() &&
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
