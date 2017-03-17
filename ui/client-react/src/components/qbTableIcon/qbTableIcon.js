/**
 * This component should not be used anymore.
 * Use the Icon component from the reuse library.
 * This stub remains here so code doesn't have to change yet.
 */

import React, {PropTypes} from 'react';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';

/**
 * an icon using a new qb icon font (from Lisa)
 */
const TableIcon = ({classes, icon}) => {

    // Map the parameters to the format expected by the embedded tag.
    // The icon passed in is the full class name including font.
    // So separate them into two parameters.
    let realIcon = `${icon}`;
    let iconFont = AVAILABLE_ICON_FONTS.TABLE_STURDY;

    if (realIcon.indexOf(AVAILABLE_ICON_FONTS.UI_STURDY) === 0) {
        iconFont = AVAILABLE_ICON_FONTS.UI_STURDY;
    }
    realIcon = realIcon.replace(iconFont + '-', '');

    return (
        <Icon className={`${classes}`} icon={realIcon} iconFont={iconFont} />
    );
};

TableIcon.propTypes = {
    icon: React.PropTypes.string.isRequired,
    classes: React.PropTypes.string
};

TableIcon.defaultProps = {
    classes: ''
};

export default TableIcon;
