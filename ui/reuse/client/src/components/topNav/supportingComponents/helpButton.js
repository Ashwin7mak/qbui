import React from 'react';
import Icon from 'REUSE/components/icon/icon';
import {I18nMessage} from 'REUSE/utils/i18nMessage';
import UrlUtils from '../../../../../../client-react/src/utils/urlUtils';
import Tooltip from '../../tooltip/tooltip';


/**
 * A Link to the Help Page.
 */
const ReHelpButton = () => (
    <Tooltip bsRole="toggle" tipId="help" i18nMessageKey="header.menu.helpTooltip" key="help" location="bottom">
        <a href={UrlUtils.getHelpLink()} target="_blank" className="globalActionLink reHelpButton">
            <Icon icon="help" />
        </a>
    </Tooltip>
);

export default ReHelpButton;
