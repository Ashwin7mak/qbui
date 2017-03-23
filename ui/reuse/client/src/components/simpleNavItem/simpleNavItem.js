import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import Icon, {AVAILABLE_ICON_FONTS} from '../icon/icon';
import Tooltip from '../tooltip/tooltip';

import "./simpleNavItem.scss";

class SimpleNavItem extends Component {
    constructor(props) {
        super(props);


    }

    render() {
        return (
            <div className="simpleNavItem">

            </div>
        );
    }
}

SimpleNavItem.propTypes = {
    /**
     * The icon that displays on the left side. See the Icon component for more information. */
    icon: PropTypes.string,

    /**
     * Optionally use a different icon font for the primary icon. See Icon component for available fonts. */
    iconFont: PropTypes.string,

    /**
     * The text that displays on the nav item */
    title: PropTypes.string,

    /**
     * Optionally pass a callback that will be called when the nav item is clicked. It receives the click event as its only argument. */
    onClick: PropTypes.func,

    /**
     * Optionally pass a react-router link. If both onClick and link are passed in, link will take precedence. */
    link: PropTypes.string,

    /**
     * The icon that appears on hover on the right side of the nav item */
    secondaryIcon: PropTypes.string,

    /**
     * Optionally use a different icon font for the secondary icon. See Icon component for available fonts. */
    secondaryIconFont: PropTypes.string,

    /**
     * A callback that will occur when the secondary icon is clicked. It receives the click event as its only argument. */
    onClickSecondaryIcon: PropTypes.func,

    /**
     * Display the nav item in a disabled state and remove links and onClick */
    disabled: PropTypes.bool,
};

SimpleNavItem.defaultProps = {
    title: '',
    iconFont: AVAILABLE_ICON_FONTS.DEFAULT,
    secondaryIconFont: AVAILABLE_ICON_FONTS.DEFAULT
};

export default SimpleNavItem;
