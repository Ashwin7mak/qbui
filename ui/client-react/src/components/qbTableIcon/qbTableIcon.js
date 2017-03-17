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
    let iconName = `${icon}`;
    let iconFont = undefined;

    // iterate through the available fonts to see which one is specified on this icon
    Object.keys(AVAILABLE_ICON_FONTS).map(function (key) {
        if (iconName.indexOf(AVAILABLE_ICON_FONTS[key]) === 0) {
            iconFont = AVAILABLE_ICON_FONTS[key];
        }
    });

    // strip the icon font off the front of the icon name because the Icon component expects them passed in separately
    if (iconFont) {
        iconName = iconName.replace(iconFont + '-', '');
    }

    return (
        <Icon className={`${classes}`} icon={iconName} iconFont={iconFont} />
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
