import React, {Component, PropTypes} from 'react';
import './StandardGridUsersCount.scss';

class StandardGridUsersCount extends Component {
    /**
     * renders the record count
     * if we have some dynamic filtering in effect include the number of filtered records out of the total
     * otherwise just show the reports total records
     */

     render() {
         let recordCountMessage = (this.props.filteredRecordCount === 1) ? this.props.itemTypeSingular : this.props.itemTypePlural;

         return (
             <div className="recordsCountLoaderContainer">
                         <div className="recordsCount">
                             {this.props.filteredRecordCount} {recordCountMessage}
                         </div>
             </div>
         );
     }
}

StandardGridUsersCount.propTypes= {
    recordCount: React.PropTypes.number,
    filteredRecordCount: React.PropTypes.number,
    itemTypePlural: React.PropTypes.string,
    itemTypeSingular: React.PropTypes.string,
};

export default StandardGridUsersCount;
