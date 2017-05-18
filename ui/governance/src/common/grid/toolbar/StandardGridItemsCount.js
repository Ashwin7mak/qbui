import React, {Component, PropTypes} from 'react';
import './StandardGridItemsCount.scss';

class StandardGridItemsCount extends Component {
    /**
     * renders the item count
     * if we have some dynamic filtering in effect include the number of filtered items out of the total
     * otherwise just show the grid total items
     */

    render() {

        const itemCountMessage = (this.props.itemCount === 1) ? this.props.itemTypeSingular : this.props.itemTypePlural;

        const itemCount = (this.props.filteredItemCount === this.props.itemCount) ? `${this.props.itemCount}` : `${this.props.filteredItemCount} of ${this.props.itemCount}`;

        return (
             <div className="itemsCountLoaderContainer">
                         <div className="itemCount">
                             {itemCount} {itemCountMessage}
                         </div>
             </div>
        );
    }
}

StandardGridItemsCount.propTypes = {
    itemCount: PropTypes.number.isRequired,
    filteredItemCount: PropTypes.number.isRequired,
    itemTypePlural: PropTypes.string,
    itemTypeSingular: PropTypes.string,
};

export default StandardGridItemsCount;
