import React from 'react';
import {MenuItem, Dropdown, OverlayTrigger, Tooltip, Popover, Button} from 'react-bootstrap';
import QBicon from '../qbIcon/qbIcon';
import {I18nMessage} from '../../utils/i18nMessage';
import './builderDropDown.scss';

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
        let isFormView = this.props.recId ? true : false;
        let isAppView = this.props.selectedAppId !== null;
        let isTableView = this.props.selectedTableId !== null;
        let isDisabled = isTableView ? "dropdownToggle globalActionLink formBuilder" : "disabled btn btn-default";


        let formBuilderDropdown = <Dropdown className={isDisabled} id="nav-right-dropdown" dropup={this.props.position === "left"} >
            <a bsRole="toggle"
               className={isDisabled}
               tabIndex={this.props.startTabIndex + this.props.actions.length}>
                <QBicon icon={this.props.formBuilderIcon}/>
            </a>

            <Dropdown.Menu>
                <div className="configurationMenu">
                    {isTableView ?
                    <div>
                        <li><a className="heading"><I18nMessage message={"pageActions.tableSettingsHeader"}/></a></li>
                        <li><a id="modifyTableSettings"><I18nMessage message={"pageActions.tableSettings"}/></a></li>
                    </div> : null}
                    {isFormView ?
                    <div>
                        <li><a id="modifyForm" onClick={this.props.navigateToBuilder}><I18nMessage
                            message={"pageActions.configureFormBuilder"}/></a></li>
                    </div> : null}
                </div>
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
