import React, {PropTypes} from 'react';
import Icon, {AVAILABLE_ICON_FONTS} from '../icon/icon';
import {isValidHexColor} from '../../utils/colorValidator';

import './iconAndColorPreview.scss';

/**
 * A component that displays a preview of an icon and color.
 * For example, when creating an app, you can pick and icon and color. This provides the preview of that.
 *
 * If a valid color is set as the backgroundColor then that color displays as the background for the preview.
 * If an invalid hex color is supplied as the background color, then an empty circle with border appears.
 * The icon is also replaced with a question mark.
 * @param icon
 * @param iconFont
 * @param iconColor
 * @param backgroundColor
 * @constructor
 */
export const IconAndColorPreview = ({icon, iconFont, iconColor, backgroundColor}) => {
    const isPreviewVisible = isValidHexColor(backgroundColor) && icon;
    const previewClasses = ['preview'];
    if (!isPreviewVisible) {
        previewClasses.push(['previewHidden']);
    }

    const previewStyle = {
        color: iconColor,
        backgroundColor: isPreviewVisible ? backgroundColor : '#ffffff'
    };

    return (
        <div className="previewContainer">
            <div className={previewClasses.join(' ')} style={previewStyle}>
                {isPreviewVisible ?
                    <Icon
                        className="colorPickerPreviewIcon"
                        icon={icon}
                        iconFont={iconFont}
                    /> :
                    <div className="previewHiddenIcon">?</div>
                }
            </div>
        </div>
    );
};

IconAndColorPreview.propTypes = {
    /**
     * The name of the icon to display. See the <Icon> component for more information. */
    icon: PropTypes.string,

    /**
     * The name of the icon font to use. Default to the default icon font. See the <Icon> component
     * for more information. */
    iconFont: PropTypes.string,

    /**
     * The color of the icon in the preview as a hex value. Defaults to white (#ffffff) */
    iconColor: PropTypes.string,

    /**
     * The color of the background for the preview as a hex value. No default. Shows as no background color selected. */
    backgroundColor: PropTypes.string
};

IconAndColorPreview.defaultProps = {
    iconFont: AVAILABLE_ICON_FONTS.DEFAULT,
    iconColor: '#ffffff',
};

export default IconAndColorPreview;
