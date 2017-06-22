import React, {PropTypes} from "react";
import _ from 'lodash';
import Locale from '../../../../../client-react/src/locales/locales';
import QBicon from '../icon/icon';
import './emptyStateForLeftNav.scss';

const EmptyStateForLeftNav = ({listOfItems, handleOnClick, emptyMessage, icon, iconMessage, className}) => {

    let buildEmptyStateMessage = () => {
        return Locale.getMessage(emptyMessage);
    };

    /**
     * returns icon when the appList is empty
     */
    let emptyStateIcon = () => {
        return (
            <div className="createNewIcon">
                <div className="emptyStateIcon" onClick={handleOnClick}>
                    <QBicon icon={icon}/>
                    <li className="iconMessage">{Locale.getMessage(iconMessage)}</li>
                </div>
            </div>
        );
    };

    /**
     * returns the message and a new icon to create items when there are no items otherwise return null
     */
    let emptyStateMessage = () => {
        if (_.isEmpty(listOfItems)) {
            return (
                <div className = {`${className} emptyState`}>
                    {buildEmptyStateMessage()}
                    {emptyStateIcon()}
                </div>
            );
        } else {
            return null;
        }
    };
    return emptyStateMessage();
};

EmptyStateForLeftNav.propTypes = {
    listOfItems: PropTypes.array.isRequired,
    handleOnClick: PropTypes.func.isRequired,
    emptyMessage: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    iconMessage: PropTypes.string.isRequired
};

export default EmptyStateForLeftNav;
