import React from 'react';
import {MenuItem, Dropdown} from 'react-bootstrap';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import {I18nMessage} from '../../../../reuse/client/src/utils/i18nMessage';
import * as UrlConsts from "../../constants/urlConstants";
import URLUtils from '../../utils/urlUtils';
import './builderDropDown.scss';

const actionPropType = React.PropTypes.shape({
    icon: React.PropTypes.string.isRequired,
    msg: React.PropTypes.string.isRequired,
    link: React.PropTypes.string
});

let BuilderDropDownAction = React.createClass({

    propTypes: {
        actions: React.PropTypes.arrayOf(actionPropType),
        icon: React.PropTypes.string,
        startTabIndex: React.PropTypes.number.isRequired,
        recId: React.PropTypes.string,
        navigateToBuilder: React.PropTypes.func.isRequired,
        position: React.PropTypes.string.isRequired,
        selectedApp: React.PropTypes.object,
        selectedTable: React.PropTypes.object
    },

    getTableSettingsLink() {
        let link = URLUtils.getTableSettingsLink(this.props.selectedApp.id, this.props.selectedTable.id);
        this.props.history.push(link);
    },

    getAutomationSettingsLink() {
        let link = URLUtils.getAutomationSettingsLink(this.props.selectedApp.id);
        this.props.history.push(link);
    },

    getConfigOptions() {
        let isAppView = !!this.props.selectedApp; // !! converts to boolean
        let isTableView = (isAppView && this.props.selectedTable);
        let isFormView = (isTableView && this.props.recId);
        let classes = "dropdownToggle globalActionLink";

        let dropDown = <Dropdown className={classes} id="nav-right-dropdown" dropup={this.props.position === "left"} >
            <a bsRole="toggle"
               className={classes}
               tabIndex={this.props.startTabIndex + this.props.actions ? this.props.actions.length : 0}>
                <Icon icon={this.props.icon}/>
            </a>

            <Dropdown.Menu>
                <div className="configMenu">
                    {isAppView ?
                    <div className="configMenu--configSet withIcon">
                        <h3><I18nMessage message={"settings.header"}/></h3>
                        <ul>
                            <li className="heading">
                                <a>
                                    <Icon className="headingIcon" iconFont={AVAILABLE_ICON_FONTS.UI_STURDY} icon="favicon"/>
                                    <span><I18nMessage message={"settings.appHeader"}/></span>
                                </a>
                            </li>
                            <li>
                                <a className="modifyAutomationSettings" onClick={this.getAutomationSettingsLink}>
                                    <I18nMessage message={"settings.automationSettings"}/>
                                </a>
                            </li>
                        </ul>
                    </div> : null}
                    {isTableView ?
                    <div className="configMenu--configSet withIcon">
                        <ul>
                            <li className="heading">
                                <a>
                                    {this.props.selectedTable.tableIcon && <Icon className="headingIcon" iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={this.props.selectedTable.tableIcon}/> }
                                    <span><I18nMessage message={"settings.tablesHeader"}/></span>
                                </a>
                            </li>
                            <li>
                                <a className="modifyTableSettings" onClick={this.getTableSettingsLink}>
                                    <I18nMessage message={"settings.tableSettings"}/>
                                </a>
                            </li>
                        </ul>
                    </div> : null}
                    {isFormView ?
                    <div className="configMenu--configSet currentContext">
                        <ul>
                            <li className="heading">
                                <a>
                                    <span><I18nMessage message={"settings.formsHeader"}/></span>
                                </a>
                            </li>
                            <li>
                                <a className="modifyForm" onClick={this.props.navigateToBuilder}>
                                    <I18nMessage message={"settings.configureFormBuilder"}/>
                                </a>
                            </li>
                        </ul>
                    </div> : null}
                </div>
            </Dropdown.Menu>
        </Dropdown>;

        return dropDown;

    },

    render() {
        let isAppView = !!this.props.selectedApp; // !! converts to boolean
        return (isAppView ? <li className="link globalAction withDropdown builder">{this.getConfigOptions()}</li> : null);
    }
});

export default BuilderDropDownAction;
