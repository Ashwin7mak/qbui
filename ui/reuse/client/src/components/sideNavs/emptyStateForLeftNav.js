import React, {PropTypes} from 'react';
import Locale from '../../../../../client-react/src/locales/locales';
import Icon from '../icon/icon';
import './emptyStateForLeftNav.scss';

const EmptyStateForLeftNav = ({handleOnClick, emptyMessage, icon, iconMessage, className}) => (
    <div className = {`${className} emptyState`}>
        {emptyMessage && <p>{Locale.getMessage(emptyMessage)}</p>}
        <div className="createNewIcon" onClick={handleOnClick} role="button" tabIndex="0">
            <Icon className={`${className} addNewIcon`} icon={icon}/>
            {iconMessage && <li className="iconMessage">{Locale.getMessage(iconMessage)}</li>}
        </div>
    </div>
);

EmptyStateForLeftNav.propTypes = {
    handleOnClick: PropTypes.func.isRequired,
    emptyMessage: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.string,
    iconMessage: PropTypes.string
};

EmptyStateForLeftNav.defaultProps = {
    icon: 'add-new-filled'
};

export default EmptyStateForLeftNav;
