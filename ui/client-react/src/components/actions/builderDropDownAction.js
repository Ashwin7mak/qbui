import React from 'react';
import {Dropdown} from 'react-bootstrap';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import {I18nMessage} from '../../../../reuse/client/src/utils/i18nMessage';
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
        navigateToFormBuilder: React.PropTypes.func.isRequired,
        navigateToReportBuilder: React.PropTypes.func.isRequired,
        position: React.PropTypes.string.isRequired,
        selectedApp: React.PropTypes.object,
        selectedTable: React.PropTypes.object,
        rptId: React.PropTypes.string
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
        // rptId > 0 are all reportRoute reports
        let isReportView = (isTableView && !this.props.recId && this.props.rptId > 0);
        let hasContextView = isFormView || isReportView;
        let classes = "dropdownToggle globalActionLink" + (hasContextView ? " hasContextView" : "");

        let dropDown = <Dropdown className={classes} id="nav-right-dropdown" dropup={this.props.position === "left"} >
            <a bsRole="toggle"
               className={classes}
               tabIndex={this.props.startTabIndex + this.props.actions ? this.props.actions.length : 0}>
                <Icon icon={this.props.icon}/>
            </a>

            <Dropdown.Menu>
                <div className="configMenu">
                    {isAppView ?
                    <div className="configMenu--configSet configMenu__App">
                        <h3 className="menuHeader"><I18nMessage message="settings.header"/></h3>
                        <ul>
                            <li>
                                <Icon className="headingIcon" iconFont={AVAILABLE_ICON_FONTS.UI_STURDY} icon="favicon"/>
                                <span><I18nMessage message="settings.appHeader"/></span>
                            </li>
                            <li>
                                <a onClick={this.getAutomationSettingsLink} className="modifyAutomationSettings">
                                    <I18nMessage message="settings.automationSettings"/>
                                </a>
                            </li>
                        </ul>
                    </div> : null}
                    {isTableView ?
                    <div className="configMenu--configSet configMenu__Table">
                        <ul>
                            <li>
                                {this.props.selectedTable.tableIcon && <Icon className="headingIcon" iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={this.props.selectedTable.tableIcon}/> }
                                <span><I18nMessage message="settings.tablesHeader"/></span>
                            </li>
                            <li>
                                <a onClick={this.getTableSettingsLink} className="modifyTableSettings">
                                    <I18nMessage message="settings.tableSettings"/>
                                </a>
                            </li>
                        </ul>
                    </div> : null}

                    {isReportView &&
                        <div className="configMenu--configSet configMenu__currentContext">
                            <li className="heading">
                                <span><I18nMessage message="settings.reportsHeader"/></span>
                            </li>
                            <li>
                                <a className="modifyForm" onClick={this.props.navigateToReportBuilder}>
                                    <I18nMessage message="settings.configureReportBuilder"/>
                                </a>
                            </li>
                        </div>
                    }

                    {isFormView ?
                    <div className="configMenu--configSet configMenu__currentContext">
                        <ul>
                            <li>
                                <span><I18nMessage message="settings.formsHeader"/></span>
                            </li>
                            <li>
                                <a onClick={this.props.navigateToFormBuilder} className="modifyForm">
                                    <I18nMessage message="settings.configureFormBuilder"/>
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
