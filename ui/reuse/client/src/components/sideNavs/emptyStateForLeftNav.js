import React, {PropTypes} from 'react';
import Locale from '../../../../../client-react/src/locales/locales';
import Icon from '../icon/icon';
import './emptyStateForLeftNav.scss';

const EmptyStateForLeftNav = ({handleOnClick, emptyMessage, icon, iconMessage, className}) => (
    <div className = {`${className} emptyState`}>
        <p>{Locale.getMessage(emptyMessage)}</p>
        <div className="createNewIcon" onClick={handleOnClick} role="button" tabIndex="0">
                <Icon className={`${className} addNewIcon`} icon={icon}/>
            <li className="iconMessage">{Locale.getMessage(iconMessage)}</li>
            </div>
        </div>
);

EmptyStateForLeftNav.propTypes = {
    handleOnClick: PropTypes.func.isRequired,
    emptyMessage: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    iconMessage: PropTypes.string.isRequired
};

export default EmptyStateForLeftNav;
