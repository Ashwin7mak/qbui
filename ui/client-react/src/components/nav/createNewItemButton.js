import {I18nMessage} from '../../utils/i18nMessage';
import QBicon from '../qbIcon/qbIcon';
import './leftNav.scss';

export const createNewItemButton = (handleOnCLick, message) => {
    return (
        <li className="newTableItem link" key="newTable">
            <a className="newTable leftNavLink" onClick={handleOnCLick}>
                <QBicon icon="add-new-stroke"/><span className="leftNavLabel"><I18nMessage message={message}/></span>
                {/*<div className="hoverComponent">*/}
                    {/*<I18nMessage message="tableCreation.newTablePageTitle"/>*/}
                {/*</div>*/}
            </a>
        </li>
    );
};
