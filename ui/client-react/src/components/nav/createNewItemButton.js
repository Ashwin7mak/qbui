import React, {PropTypes, Component} from "react";
import {I18nMessage} from '../../utils/i18nMessage';
import QBicon from '../qbIcon/qbIcon';
import './leftNav.scss';

class CreateNewItemButton extends Component {
    render() {
        return (
            <li className="newTableItem link" key="newTable">
                <a className="newTable leftNavLink" onClick={this.props.handleOnClick}>
                    <QBicon icon="add-new-stroke"/><span className="leftNavLabel"><I18nMessage
                    message={this.props.message}/></span>
                    {/*<div className="hoverComponent">*/}
                        {/*<I18nMessage message={this.props.message}/>*/}
                    {/*</div>*/}
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
