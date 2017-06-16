import React, {PropTypes} from "react";
import {I18nMessage} from '../../utils/i18nMessage';
import QBicon from '../icon/icon';
import './createNewItemButton.scss';

/**
 * CreateNeItemButton is located in the left nav. It is currently used to create new items such as creating a new table
 * or creating a new app.
 * */
const CreateNewItemButton = ({handleOnClick, message}) => (
        <li className="newItemButton link" key="newItem">
            <a className="newItem leftNavLink" onClick={handleOnClick}>
                <QBicon icon="add-new-stroke"/><span className="leftNavLabel"><I18nMessage message={message}/></span>
                <div className="hoverComponent">
                    <I18nMessage message={message}/>
                </div>
            </a>
        </li>
);

CreateNewItemButton.propTypes = {
    handleOnClick: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
};

export default CreateNewItemButton;
