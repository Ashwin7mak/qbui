import React from 'react';
import {MenuItem, Dropdown, OverlayTrigger, Tooltip} from 'react-bootstrap';
import QBicon from '../qbIcon/qbIcon';
import {I18nMessage} from '../../utils/i18nMessage';

const actionPropType = React.PropTypes.shape({
    icon: React.PropTypes.string.isRequired,
    msg: React.PropTypes.string.isRequired,
    link: React.PropTypes.string
});

let BuilderDropDownAction = React.createClass({

    propTypes: {
        actions: React.PropTypes.arrayOf(actionPropType),
        formBuilderIcon: React.PropTypes.string,
        startTabIndex: React.PropTypes.number.isRequired,
        recId: React.PropTypes.string,
        navigateToBuilder: React.PropTypes.func.isRequired,
        position: React.PropTypes.string.isRequired,
    },

    hasOverLayTrigger(formBuilderDropDown) {
        const availableOnFormView = <Tooltip id="unimplemented.formBuilder.tt"><I18nMessage message="unimplemented.formBuilder"/></Tooltip>;

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
                <MenuItem id="modifyForm" onClick={this.props.navigateToBuilder} eventKey={eventKeyIdx++}><I18nMessage
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
