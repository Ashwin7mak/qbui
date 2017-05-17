import React, {Component, PropTypes} from 'react';
import './StandardGridUsersCount.scss';
import Locale from "../../../../../reuse/client/src/locales/locale";
import {I18nMessage} from "../../../../../client-react/src/utils/i18nMessage";

class StandardGridUsersCount extends Component {
    /**
     * renders the record count
     * if we have some dynamic filtering in effect include the number of filtered records out of the total
     * otherwise just show the reports total records
     */

     render() {
         let recordCount;
         let recordCountMessage = (this.props.recordCount === 1) ? this.props.itemTypeSingular : this.props.itemTypePlural;


         if(this.props.filteredRecordCount === this.props.recordCount) {
            recordCount = this.props.recordCount;
        } else {
            recordCount = (this.props.filteredRecordCount) +" of " +(this.props.recordCount);
        }

         return (
             <div className="recordsCountLoaderContainer">
                         <div className="recordsCount">
                             {recordCount} {recordCountMessage}
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
