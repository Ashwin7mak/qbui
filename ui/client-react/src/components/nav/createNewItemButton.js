import React, {PropTypes} from "react";
import {I18nMessage} from '../../utils/i18nMessage';
import QBicon from '../qbIcon/qbIcon';
import './leftNav.scss';

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
