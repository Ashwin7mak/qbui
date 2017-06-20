import React from 'react';
import Icon from 'REUSE/components/icon/icon';
import {I18nMessage} from 'REUSE/utils/i18nMessage';
import UrlUtils from '../../../../../../client-react/src/utils/urlUtils';
import Tooltip from '../../tooltip/tooltip';
import './helpButton.scss';

/**
 * A Link to the Help Page.
 */
const ReHelpButton = (props) => (
    <Tooltip bsRole="toggle" tipId="help" i18nMessageKey="header.menu.helpTooltip" key="help" location="bottom">
        <a href={UrlUtils.getHelpLink()} target="_blank" className="globalActionLink reHelpButton">
            <Icon icon="help" className="reHelpButtonHover"/>
            <span className="navLabel helpTitle reHelpButtonHover"><I18nMessage message="globalActions.help" /></span>
        </a>
    </Tooltip>
);

ReHelpButton.propTypes = {
    /**
     * Optionally pass in a url for the Help Button link if it differs from {@link HELP_LINK_PATH}
     */
    link: React.PropTypes.string
};

export default ReHelpButton;
