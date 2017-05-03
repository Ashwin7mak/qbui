import React, {PropTypes, Component} from 'react';
import Loader  from 'react-loader';
import {I18nMessage} from '../../../../../reuse/client/src/utils/i18nMessage';
import * as SpinnerConfigurations from "../../../../../client-react/src/constants/spinnerConfigurations";
import Breakpoints from "../../../../../client-react/src/utils/breakpoints";
import {colorBlack700, colorBlack100} from '../../../../../client-react/src/constants/colors';

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
        // No users check
        if ((this.props.isFiltered && (this.props.filteredUsersCount === null) || this.props.usersCount === null)) {
            return null;
        }
        // Set resource property name
        let message = (this.props.usersCount === 1) ? "count.singleUserCount" : "count.usersCount";
        let placeHolderMessage = (Breakpoints.isSmallBreakpoint()) ? "count.cardViewCountPlaceHolder" : "count.usersCountPlaceHolder";

        let dbl = null;

        if (this.props.isFiltered && this.props.usersCount !== this.props.filteredUsersCount) {
            dbl = this.props.clearAllFilters;
            message = (this.props.usersCount === 1) ? "count.filteredSingleUserCount" : "count.filteredUsersCount";
        }

        let loaderOptions = SpinnerConfigurations.RECORD_COUNT;
        loaderOptions.color = !Breakpoints.isSmallBreakpoint() ? largeBreakpointColor : smallBreakpointColor;
        return (
            <div className="usersCountLoaderContainer">
                <Loader loaded={!this.props.isCounting} options={loaderOptions}>
                    <div className="usersCount" onDoubleClick={dbl}>
                        <I18nMessage message={message}
                                     filteredUsersCount={this.props.filteredUsersCount + ''}
                                     usersCount={this.props.usersCount + ''}
                        />
                    </div>
                </Loader>
                {   this.props.isCounting ?
                    <div className="usersCount">
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
    usersCount: React.PropTypes.number,
    filteredUsersCount: React.PropTypes.number,
    clearAllFilters: React.PropTypes.func,
    isCounting: React.PropTypes.bool
};


export default StandardGridUsersCount;
