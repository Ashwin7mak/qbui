import React, {PropTypes, Component} from 'react';
import Icon from '../icon/icon';

import './stageHeader.scss';

const StageHeader = ({title, icon, iconClassName, description}) => (
    <div className="stageHeaderComponent">
        {
            icon &&
            <div className="stageHeaderIcon">
                <Icon className={iconClassName} icon={icon} />
            </div>
        }

        <div className="stageHeaderContent">
            <div className="stageHeaderTitleContainer">
                <h3 className="stageHeaderTitle">{title}</h3>
            </div>

            {
                description &&
                <div className="stageHeaderDescriptionContainer">
                    {description}
                </div>
            }
        </div>
    </div>
);

StageHeader.propTypes = {
    /**
     * The main title that will appear in the header */
    // TODO:: Convert to i18nMessageKey
    title: PropTypes.string.isRequired,

    /**
     * An optional icon name. See the Icon component for more information. */
    icon: PropTypes.string,

    /**
     * An optional class to add to the icon for custom styling/coloring */
    iconClassName: PropTypes.string,

    /**
     * Optional element to display below the title. Typically a <p> element. */
    description: PropTypes.element,
};

StageHeader.defaultProps = {
    iconClassName: ''
};

export default StageHeader;
