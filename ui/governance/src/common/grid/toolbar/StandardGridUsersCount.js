import React, {PropTypes, Component} from 'react';
import Loader  from 'react-loader';
import {I18nMessage} from '../../../../../reuse/client/src/utils/i18nMessage';
import * as SpinnerConfigurations from "../../../../../client-react/src/constants/spinnerConfigurations";
import Breakpoints from "../../../../../client-react/src/utils/breakpoints";
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
     * If it isSmall then we change the color of the loader to match the color of the text for small breakpoints
     * and it changes the text header from 'Counting {users}' to 'Counting...'
     */
    render() {
        // No records check
        if ((this.props.isFiltered && (this.props.filteredRecordCount === null) || this.props.totalRecords === null)) {
            return null;
        }
        // Set resource property name
        let message = (this.props.totalRecords === 1) ? Locale.getMessage("governance.count.singleRecordCount") : Locale.getMessage("governance.count.totalRecords");
        let placeHolderMessage = (Breakpoints.isSmallBreakpoint()) ? Locale.getMessage("governance.count.cardViewCountPlaceHolder") : Locale.getMessage("governance.count.usersCountPlaceHolder");

        let dbl = null;

        if (this.props.isFiltered && this.props.totalRecords !== this.props.filteredRecordCount) {
            dbl = this.props.clearAllFilters;
            message = (this.props.totalRecords === 1) ? Locale.getMessage("governance.count.filteredSingleRecordCount") : Locale.getMessage("governance.count.filteredRecordCount");
        }

        let loaderOptions = SpinnerConfigurations.RECORD_COUNT;
        loaderOptions.color = !Breakpoints.isSmallBreakpoint() ? largeBreakpointColor : smallBreakpointColor;
        return (
            <div className="recordsCountLoaderContainer">
                <Loader loaded={!this.props.isCounting} options={loaderOptions}>
                    <div className="recordsCount" onDoubleClick={dbl}>
                        <I18nMessage message={message}
                                     filteredRecordCount={this.props.filteredRecordCount + ''}
                                     totalRecords={this.props.totalRecords + ''}
                        />
                    </div>
                </Loader>
                {   this.props.isCounting ?
                    <div className="recordsCount">
                        <I18nMessage message={placeHolderMessage} />
                    </div> :
                    null
                }
            </div>
        );
    }
}

StandardGridUsersCount.propTypes = {
    isFiltered: React.PropTypes.bool,
    totalRecords: React.PropTypes.number,
    filteredRecordCount: React.PropTypes.number,
    clearAllFilters: React.PropTypes.func,
    isCounting: React.PropTypes.bool
};


export default StandardGridUsersCount;
