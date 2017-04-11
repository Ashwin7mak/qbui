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

    let iconName = `${icon}`;
    return (
        <Icon className={`${classes}`} icon={iconName} iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} />
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
