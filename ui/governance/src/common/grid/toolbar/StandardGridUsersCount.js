import React, {PropTypes, Component} from 'react';
import {I18nMessage} from '../../../../../reuse/client/src/utils/i18nMessage';
import {colorBlack700, colorBlack100} from '../../../../../client-react/src/constants/colors';
import Locale from '../../../../../reuse/client/src/locales/locale';

import './StandardGridUsersCount.scss';

const largeBreakpointColor = colorBlack700;
const smallBreakpointColor = colorBlack100;

class StandardGridUsersCount extends Component {
    /**
     * renders the users count
     * if we have some dynamic filtering in effect include the number of filtered users out of the total
     * otherwise just show the grid total users
     *
     */
    render() {
        // No records check
        if (this.props.filteredRecords === null || this.props.totalRecords === null) {
            return null;
        }
        // Set resource property name
        let message = (this.props.totalRecords === 1) ? Locale.getMessage("governance.count.singleRecordCount") : Locale.getMessage("governance.count.totalRecords");

        let dbl = null;

        if (this.props.isFiltered && this.props.totalRecords !== this.props.filteredRecordCount) {
            message = (this.props.totalRecords === 1) ? Locale.getMessage("governance.count.filteredSingleRecordCount") : Locale.getMessage("governance.count.filteredRecordCount");
        }

        loaderOptions.color = !Breakpoints.isSmallBreakpoint() ? largeBreakpointColor : smallBreakpointColor;
        return (
            <div className="recordsCountLoaderContainer">
                    <div className="recordsCount">
                        <I18nMessage message={message}
                                     filteredRecordCount={this.props.filteredRecords + ''}
                                     totalRecords={this.props.totalRecords + ''}
                        />
                    </div>
            </div>
        );
    }
}

StandardGridUsersCount.propTypes = {
    totalRecords: React.PropTypes.number,
    filteredRecords: React.PropTypes.number,
};


export default StandardGridUsersCount;
