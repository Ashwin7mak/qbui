import React, {PropTypes, Component} from 'react';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropDown from 'react-bootstrap/lib/Dropdown';
import Icon from '../../icon/icon';
import {I18nMessage} from '../../../utils/i18nMessage';
import UrlUtils from '../../../../../../client-react/src/utils/urlUtils';
import Tooltip from '../../tooltip/tooltip';
import Breakpoints from 'APP/utils/breakpoints';
import './userFeedBack.scss';

// Uses default icon specific to a feedback dropdown in the DefaultTopNav
const dropDownIcon = 'Advertising';

/**
 * This component was not designed to be reused outside of the ReDefaultTopNavGlobalActions component.
 * @param props
 * @constructor
 */
class userFeedBack extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {startTabIndex} = this.props;
        const dropDownId = Breakpoints.isNotSmallBreakpoint() ? "nav-right-dropdown" : "nav-left-dropup";
        const dropDownMenuClass = Breakpoints.isNotSmallBreakpoint() ? "userFeedBackDropDown" : "userFeedBackDropUp";

        return (
            <DropDown id={dropDownId} className="userFeedBack globalActionLink" dropup={this.props.shouldOpenMenusUp}>
                <Tooltip bsRole="toggle" tipId="feedback" i18nMessageKey="header.menu.feedbackTooltip" key="feedback" location="bottom">
                    <a bsRole="toggle" className="dropdownToggle" tabIndex={startTabIndex}>
                        <Icon icon={dropDownIcon} iconFont="iconTableSturdy"/>
                    </a>
                </Tooltip>

                <DropDown.Menu className={dropDownMenuClass}>
                    <MenuItem href={UrlUtils.getFeedBackLink()} target="_blank" className="feedbackMenuButton">
                        <I18nMessage message="header.menu.feedbackMenuButton"/>
                    </MenuItem>
                    <MenuItem href={UrlUtils.getReportFeedBackLink()} target="_blank" className="reportFeedBackButton">
                        <I18nMessage message="header.menu.reportFeedBackButton"/>
                    </MenuItem>
                </DropDown.Menu>
            </DropDown>
        );
    }
}

userFeedBack.propTypes = {
    startTabIndex: PropTypes.number,
    shouldOpenMenusUp: PropTypes.bool
};

userFeedBack.defaultPropTypes = {
    startTabIndex: 0,
};

export default userFeedBack;
