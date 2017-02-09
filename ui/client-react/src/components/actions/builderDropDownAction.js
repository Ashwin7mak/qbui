import React from 'react';
import {MenuItem, Dropdown, OverlayTrigger, Tooltip} from 'react-bootstrap';
import QBicon from '../qbIcon/qbIcon';
import {I18nMessage} from '../../utils/i18nMessage';

let BuilderDropDownAction = React.createClass({
    propTypes: {
        linkClass: React.PropTypes.string,
    },

    hasOverLayTrigger(formBuilderDropDown) {
        const availableOnFormView = <Tooltip><I18nMessage message="unimplemented.formBuilder"/></Tooltip>;

        return <OverlayTrigger placement="bottom" trigger={['hover', 'click']} overlay={availableOnFormView}>
            {formBuilderDropDown}
        </OverlayTrigger>;
    },

    getBuilderDropdown() {
        let eventKeyIdx = 20;
        let isFormView = this.props.recId ? true : false;
        let isDisabled = isFormView ? "dropdownToggle globalActionLink formBuilder" : "disabled btn btn-default";

        let formBuilderDropdown = <Dropdown className={isDisabled} id="nav-right-dropdown" dropup={this.props.position === "left"} >

            <a bsRole="toggle"
               className={isDisabled}
               tabIndex={this.props.startTabIndex + this.props.actions.length}>
                <QBicon icon={this.props.formBuilderIcon}/>
            </a>

            <Dropdown.Menu>

                <MenuItem onClick={this.props.navigateToBuilder} eventKey={eventKeyIdx++}><I18nMessage
                    message={"pageActions.configureFormBuilder"}/></MenuItem>

            </Dropdown.Menu>
        </Dropdown>;

        return isFormView ? formBuilderDropdown : this.hasOverLayTrigger(formBuilderDropdown);

    },

    render() {
        let isFormView = this.props.recId ? true : false;
        let isDisabled = isFormView ? "link globalAction withDropdown builder" : "link globalAction disabled withDropdown builder";
        return (
            <li className={isDisabled}>{this.getBuilderDropdown()}</li>
        );
    }
});

export default BuilderDropDownAction;