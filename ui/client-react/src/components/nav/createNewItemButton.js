import React, {PropTypes, Component} from "react";
import {I18nMessage} from '../../utils/i18nMessage';
import QBicon from '../qbIcon/qbIcon';
import './leftNav.scss';

//newTableItem
//newTable
class CreateNewItemButton extends Component {
    render() {
        return (
            <li className="newItemButton link" key="newItem">
                <a className="newItem leftNavLink" onClick={this.props.handleOnClick}>
                    <QBicon icon="add-new-stroke"/><span className="leftNavLabel"><I18nMessage message={this.props.message}/></span>
                    <div className="hoverComponent">
                        <I18nMessage message={this.props.message}/>
                    </div>
                </a>
            </li>
        );
    }
}

CreateNewItemButton.propTypes = {
    handleOnClick: PropTypes.func,
    message: PropTypes.string,
};

export default CreateNewItemButton;
