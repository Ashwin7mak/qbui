import React from 'react';
import {MenuItem, Dropdown} from 'react-bootstrap';
import QBicon from '../qbIcon/qbIcon';
import {I18nMessage} from '../../utils/i18nMessage';
import * as UrlConsts from "../../constants/urlConstants";
import TableIcon from '../qbTableIcon/qbTableIcon';
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
        let link = `${UrlConsts.SETTINGS_ROUTE}/app/${this.props.selectedApp.id}/table/${this.props.selectedTable.id}/properties`;
        this.props.router.push(link);
    },

    getConfigOptions() {
        let isAppView = this.props.selectedApp ? true : false;
        let isTableView = this.props.selectedTable ? true : false;
        let isFormView = this.props.recId ? true : false;
        let classes = "dropdownToggle globalActionLink formBuilder";


        let dropDown = <Dropdown className={classes} id="nav-right-dropdown" dropup={this.props.position === "left"} >
            <a bsRole="toggle"
               className={classes}
               tabIndex={this.props.startTabIndex + this.props.actions.length}>
                <QBicon icon={this.props.icon}/>
            </a>

            <Dropdown.Menu>
                <div className="configurationMenu">
                    {isTableView ?
                    <div className="tableConfig">
                        <li><a className="heading">{this.props.selectedTable.icon && <TableIcon icon={this.props.selectedTable.icon}/> }
                            <span>{this.props.selectedTable.name}&nbsp;<I18nMessage message={"pageActions.tableSettingsHeader"}/></span></a></li>
                        <li><a id="modifyTableSettings" onClick={this.getTableSettingsLink}><I18nMessage message={"pageActions.tableSettings"}/></a></li>
                    </div> : null}
                    {isFormView ?
                    <div>
                        <li><a id="modifyForm" onClick={this.props.navigateToBuilder}><I18nMessage
                            message={"pageActions.configureFormBuilder"}/></a></li>
                    </div> : null}
                </div>
            </Dropdown.Menu>
        </Dropdown>;

        return dropDown;

    },

    render() {
        let isTableView = this.props.selectedTable ? true : false;
        //For now this menu only shows for table/form view. Eventually this should show for all views with content dependent on the route.
        return (isTableView ? <li className="link globalAction withDropdown builder">{this.getConfigOptions()}</li> : null);
    }
});

export default BuilderDropDownAction;
