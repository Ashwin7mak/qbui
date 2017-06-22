import React, {PropTypes} from "react";
import Locale from '../../../../../client-react/src/locales/locales';
import QBicon from '../icon/icon';
import './emptyStateForLeftNav.scss';

const EmptyStateForLeftNav = ({handleOnClick, emptyMessage, icon, iconMessage, className}) => (
    <div className = {`${className} emptyState`}>
        {Locale.getMessage(emptyMessage)}
        <div className="createNewIcon">
            <div className="emptyStateIcon" onClick={handleOnClick}>
                <QBicon icon={icon}/>
                <li className="iconMessage">{Locale.getMessage(iconMessage)}</li>
            </div>
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
